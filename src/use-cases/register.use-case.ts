import { type UsersRepository } from '@/repositories/users.repository';
import { type User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UserAlreadyExistError } from './errors/user-already-exists.error';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const passwordHash = await bcrypt.hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail != null) {
      throw new UserAlreadyExistError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });

    return {
      user,
    };
  }
}
