import { type FastifyInstance } from 'fastify';
import { authenticate } from './controllers/authenticate.controller';
import { register } from './controllers/register.controller';

export async function appRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', () => {
    return 'All very well! 🧑‍⚕️';
  });

  app.post('/users', register);
  app.post('/sessions', authenticate);
}
