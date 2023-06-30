import { type Gym, type Prisma } from '@prisma/client';

export interface GymsRepository {
  create: (data: Prisma.GymCreateInput) => Promise<Gym>;
  findById: (id: string) => Promise<Gym | null>;
}
