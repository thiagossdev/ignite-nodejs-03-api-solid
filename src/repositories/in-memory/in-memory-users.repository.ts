import { type Prisma, type User } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { type UsersRepository } from '../users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  private readonly items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const item = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at:
        data.created_at != null ? new Date(data.created_at) : new Date(),
    };

    this.items.push(item);
    return item;
  }

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) ?? null;
  }
}
