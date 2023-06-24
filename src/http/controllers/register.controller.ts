import { registerUseCase } from '@/use-cases/register.use-case';
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
    await registerUseCase({
      name,
      email,
      password,
    });
  } catch (err) {
    return await reply.status(409).send();
  }

  return await reply.status(201).send();
}
