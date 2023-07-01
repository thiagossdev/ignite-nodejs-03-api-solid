import { type CheckInsRepository } from '@/repositories/check-ins.repository';
import { type CheckIn } from '@prisma/client';

interface FetchMemberCheckInsHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchMemberCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchMemberCheckInsHistoryUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchMemberCheckInsHistoryUseCaseRequest): Promise<FetchMemberCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    );

    return {
      checkIns,
    };
  }
}
