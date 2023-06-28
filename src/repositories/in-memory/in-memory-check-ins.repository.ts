import { type Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { type CheckInsRepository } from '../check-ins.repository';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private readonly items: any[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const item = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at:
        data.validated_at != null ? new Date(data.validated_at) : null,
      created_at:
        data.created_at != null ? new Date(data.created_at) : new Date(),
    };

    this.items.push(item);
    return item;
  }

  async findById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');
    return this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      return checkIn.user_id === userId && isOnSameDate;
    });
  }
}
