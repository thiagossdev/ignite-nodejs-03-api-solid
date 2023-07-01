import { type CheckIn, type Prisma } from '@prisma/client';

export interface CheckInsRepository {
  create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>;
  findById: (id: string) => Promise<CheckIn | null>;
  findManyByUserId: (userId: string, page: number) => Promise<CheckIn[]>;
  findByUserIdOnDate: (userId: string, date: Date) => Promise<CheckIn | null>;
}
