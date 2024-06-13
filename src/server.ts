import fastify from 'fastify';
import { decryptEnv } from './functions';

/**
 * Starts a Fastify server that serves the decrypted environment variables.
 * The server will shut down after handling a single request.
 * 
 * @async
 * @function serve
 * @returns {Promise<void>} A promise that resolves when the server has been started and handled a request.
 */
export async function serve(): Promise<void> {
  const env = await decryptEnv();
  const server = fastify({ logger: true });

  server.get('/', async (_, reply) => {
    reply.send(env);

    // Close the server after handling the request
    server.close(() => {
      server.log.info('Server has been shut down');
    });
  });

  const start = async () => {
    try {
      await server.listen({ host: '0.0.0.0', port: 56123 });
      server.log.info(`Server listening at 0.0.0.0:56123`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  await start();
}
