import { UserAlreadyExistError } from '@/use-cases/errors/user-already-exists.error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-autheticate.use-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = registerBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistError) {
      return await reply.status(400).send({
        message: err.message,
      });
    }
    throw err;
  }

  return await reply.status(201).send();
}
