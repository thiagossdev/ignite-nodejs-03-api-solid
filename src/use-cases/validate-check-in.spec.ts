import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { ValidateCheckInUseCase } from './validate-check-in.use-case';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);
  });

  it('should be able to validate check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate check-in with wrong id', async () => {
    await expect(
      async () =>
        await sut.execute({
          checkInId: 'non-existing-id',
        }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
