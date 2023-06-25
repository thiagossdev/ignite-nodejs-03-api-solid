import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';
import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { UserAlreadyExistError } from './errors/user-already-exists.error';
import { RegisterUseCase } from './register.use-case';

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUserCase.handle({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUserCase.handle({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBeTruthy();
  });

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const email = 'johndoe@example.com';

    await registerUserCase.handle({
      name: 'John Doe',
      email,
      password: '123456',
    });

    void expect(
      async () =>
        await registerUserCase.handle({
          name: 'John Doe',
          email,
          password: '123456',
        }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
