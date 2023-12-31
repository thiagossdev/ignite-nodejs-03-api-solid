import { type CheckIn, type Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { type CheckInsRepository } from '../check-ins.repository';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public readonly items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const item = {
      id: data.id ?? randomUUID(),
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

  async save(checkIn: CheckIn) {
    const index = this.items.findIndex((item) => item.id === checkIn.id);

    if (index >= 0) {
      this.items[index] = checkIn;
    }

    return checkIn;
  }

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkInOnSameDay = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      return checkIn.user_id === userId && isOnSameDate;
    });

    if (checkInOnSameDay == null) {
      return null;
    }

    return checkInOnSameDay;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length;
  }
}
