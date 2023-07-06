import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { type Gym, type Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from 'node:crypto';
import {
  type FindManyNearbyParams,
  type GymsRepository,
} from '../gyms.repository';

export class InMemoryGymsRepository implements GymsRepository {
  private readonly items: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const item: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.items.push(item);
    return item;
  }

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby(coordinate: FindManyNearbyParams) {
    return this.items
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(coordinate, {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        });

        return distance < 10;
      })
      .slice(0, 20);
  }
}
