import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInUseCase } from './check-in.use-case';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const gym = await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: -23.6810105,
      longitude: -46.9241312,
    });

    const { checkIn } = await sut.execute({
      user: {
        id: 'user-01',
        latitude: -23.6814347,
        longitude: -46.9249428,
      },
      gymId: gym.id,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    const gym = await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: -23.6810105,
      longitude: -46.9241312,
    });

    await sut.execute({
      user: {
        id: 'user-01',
        latitude: -23.6814347,
        longitude: -46.9249428,
      },
      gymId: gym.id,
    });

    await expect(
      async () =>
        await sut.execute({
          user: {
            id: 'user-01',
            latitude: -23.6814347,
            longitude: -46.9249428,
          },
          gymId: gym.id,
        }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    const gym = await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: -23.6810105,
      longitude: -46.9241312,
    });

    await sut.execute({
      user: {
        id: 'user-01',
        latitude: -23.6814347,
        longitude: -46.9249428,
      },
      gymId: gym.id,
    });

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0));
    const { checkIn } = await sut.execute({
      user: {
        id: 'user-01',
        latitude: -23.6814347,
        longitude: -46.9249428,
      },
      gymId: gym.id,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    const gym = await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: -23.4443397,
      longitude: -46.5066264,
    });

    await expect(
      async () =>
        await sut.execute({
          user: {
            id: 'user-01',
            latitude: -23.6814347,
            longitude: -46.9249428,
          },
          gymId: gym.id,
        }),
    ).rejects.toBeInstanceOf(Error);
  });
});
