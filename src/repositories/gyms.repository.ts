import { type Gym, type Prisma } from '@prisma/client';

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface GymsRepository {
  create: (data: Prisma.GymCreateInput) => Promise<Gym>;
  findById: (id: string) => Promise<Gym | null>;
  findMany: (query: string, page: number) => Promise<Gym[]>;
  findManyNearby: (coordinate: FindManyNearbyParams) => Promise<Gym[]>;
}
