import { type CheckInsRepository } from '@/repositories/check-ins.repository';
import { type GymsRepository } from '@/repositories/gyms.repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { type CheckIn } from '@prisma/client';
import { MaxDistanceError } from './errors/max-distance.error';
import { MaxNumberOfCheckInsError } from './errors/max-numbers-of-check-ins.error';
import { ResourceNotFoundError } from './errors/resource-not-found.error';

interface CheckInUseCaseRequest {
  user: {
    id: string;
    latitude: number;
    longitude: number;
  };
  gymId: string;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private readonly checkInsRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  async execute({
    user,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (gym == null) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(user, {
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    });

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      user.id,
      new Date(),
    );

    if (checkInOnSameDay != null) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: user.id,
      gym_id: gymId,
    });

    return {
      checkIn,
    };
  }
}
