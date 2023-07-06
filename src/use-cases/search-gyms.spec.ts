import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { SearchGymsUseCase } from './search-gyms.use-case';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -23.6810105,
      longitude: -46.9241312,
    });

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -23.6810105,
      longitude: -46.9241312,
    });

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 1,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' }),
      expect.objectContaining({ title: 'TypeScript Gym' }),
    ]);
  });

  it('should be able to search paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -23.6810105,
        longitude: -46.9241312,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ]);
  });
});
