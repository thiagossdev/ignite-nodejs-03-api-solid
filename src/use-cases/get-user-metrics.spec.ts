import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { GetUserMetricsUseCase } from './get-user-metrics.use-case';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    });

    await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-2',
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-1',
    });

    expect(checkInsCount).toEqual(2);
  });

  it('should not be able to get user metrics with wrong id', async () => {
    await expect(
      async () =>
        await sut.execute({
          userId: 'non-existing-id',
        }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
