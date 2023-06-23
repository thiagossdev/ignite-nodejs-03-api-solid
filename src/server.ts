import { app } from './app';
import { env } from './env';

app.listen(
  {
    host: env.HOST,
    port: env.PORT,
  },
  () => {
    console.log(`🚀 HTTP Server is Running on PORT:${env.PORT}!`);
  },
);
