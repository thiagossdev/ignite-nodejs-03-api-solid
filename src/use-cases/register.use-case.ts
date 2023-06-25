import { type UsersRepository } from '@/repositories/users.repository';
import bcrypt from 'bcryptjs';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail != null) {
      throw new Error('E-mail already exists.');
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });
  }
}
