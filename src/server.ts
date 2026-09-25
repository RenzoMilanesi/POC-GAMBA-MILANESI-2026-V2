import { crearApp } from './app.js';

const app = crearApp();
const port = Number(process.env.PORT ?? 3000);

try {
  await app.listen({ port, host: '127.0.0.1' });
  console.log(`GraphQL:  http://127.0.0.1:${port}/graphql`);
  console.log(`GraphiQL: http://127.0.0.1:${port}/graphiql`);
  console.log(`REST:     http://127.0.0.1:${port}/api/turnos`);
} catch (error) {
  app.log.error(error);
  process.exitCode = 1;
}
