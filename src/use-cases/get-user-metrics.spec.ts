import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository';
import { beforeEach, describe, expect, it } from 'vitest';
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
});
