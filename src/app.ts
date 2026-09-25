import { readFileSync } from 'node:fs';
import Fastify from 'fastify';
import mercurius from 'mercurius';
import { crearLoaders } from './loaders.js';
import { crearResolvers, TOPIC_TURNO_CREADO } from './resolvers.js';
import { registrarRest } from './rest.js';
import { crearServicioTurnos } from './turnos.js';

const schema = readFileSync(new URL('./schema.graphql', import.meta.url), 'utf8');
const HEADER_SIN_DATALOADER = 'x-sin-dataloader';

export function crearApp() {
  const app = Fastify();
  // Un turno creado por REST o por GraphQL llega igual a los suscriptores.
  const servicio = crearServicioTurnos((turnoCreado) =>
    app.graphql.pubsub.publish({ topic: TOPIC_TURNO_CREADO, payload: { turnoCreado } })
  );

  app.register(mercurius, {
    schema,
    resolvers: crearResolvers(servicio),
    path: '/graphql',
    graphiql: true,
    subscription: { context: () => ({ loaders: crearLoaders(servicio, true) }) },
    // Un DataLoader nuevo por request: su caché no se comparte entre usuarios.
    context: (request) => ({
      loaders: crearLoaders(servicio, !request.headers[HEADER_SIN_DATALOADER])
    })
  });
  registrarRest(app, servicio);

  // ponytail: contador global, mezcla accesos si hay requests simultáneos; alcanza para una demo.
  app.addHook('onRequest', async () => servicio.reiniciarAccesos());
  app.addHook('onResponse', async (request) => {
    if (request.url !== '/graphql') return;
    const { turnos, pacientes, profesionales } = servicio.accesos;
    const modo = request.headers[HEADER_SIN_DATALOADER] ? 'SIN DataLoader' : 'CON DataLoader';
    console.log(
      `[accesos a datos] turnos=${turnos} pacientes=${pacientes} profesionales=${profesionales}` +
      ` | total=${turnos + pacientes + profesionales} | ${modo}`
    );
  });

  return app;
}
