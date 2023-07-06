import { type GymsRepository } from '@/repositories/gyms.repository';
import { type Gym } from '@prisma/client';

interface FetchNearbyGymsUseCaseRequest {
  user: {
    latitude: number;
    longitude: number;
  };
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    user,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby(user);

    return {
      gyms,
    };
  }
}
