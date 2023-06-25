import { type Prisma } from '@prisma/client';
import { type UsersRepository } from '../users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  private readonly items: any[] = [];

  async create(data: Prisma.UserCreateInput) {
    const item = {
      id: data.id ?? new Date().getTime().toString(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at:
        data.created_at != null ? new Date(data.created_at) : new Date(),
    };

    this.items.push(item);
    return item;
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email);
  }
}
