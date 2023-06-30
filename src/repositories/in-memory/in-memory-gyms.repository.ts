import { type Gym, type Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from 'node:crypto';
import { type GymsRepository } from '../gyms.repository';

export class InMemoryGymsRepository implements GymsRepository {
  private readonly items: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const item: Gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude ?? 0),
      longitude: new Decimal(data.longitude ?? 0),
    };

    this.items.push(item);
    return item;
  }

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }
}
