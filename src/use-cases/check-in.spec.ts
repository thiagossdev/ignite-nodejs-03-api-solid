import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInUseCase } from './check-in.use-case';
import { MaxDistanceError } from './errors/max-distance.error';
import { MaxNumberOfCheckInsError } from './errors/max-numbers-of-check-ins.error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      latitude: -23.6810105,
      longitude: -46.9241312,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      user: {
        id: 'user-01',
        latitude: -23.6814347,
        longitude: -46.9249428,
      },
      gymId: 'gym-01',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await sut.execute({
      user: {
        id: 'user-01',
        latitude: -23.6814347,
        longitude: -46.9249428,
      },
      gymId: 'gym-01',
    });

    await expect(
      async () =>
        await sut.execute({
          user: {
            id: 'user-01',
            latitude: -23.6814347,
            longitude: -46.9249428,
          },
          gymId: 'gym-01',
        }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await sut.execute({
      user: {
        id: 'user-01',
        latitude: -23.6814347,
        longitude: -46.9249428,
      },
      gymId: 'gym-01',
    });

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0));
    const { checkIn } = await sut.execute({
      user: {
        id: 'user-01',
        latitude: -23.6814347,
        longitude: -46.9249428,
      },
      gymId: 'gym-01',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'TypeScript Gym',
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
          gymId: 'gym-02',
        }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
