import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';
import { UserAlreadyExistError } from '@/use-cases/errors/user-already-exists.error';
import { RegisterUseCase } from '@/use-cases/register.use-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    await registerUseCase.handle({
      name,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistError) {
      return await reply.status(409).send({
        message: err.message,
      });
    }
    throw err;
  }

  return await reply.status(201).send();
}
