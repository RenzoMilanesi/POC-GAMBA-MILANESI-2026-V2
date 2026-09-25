import type { FastifyInstance, FastifyReply } from 'fastify';
import type { CrearTurnoInput } from './data.js';
import { TurnoError, type ServicioTurnos } from './turnos.js';

const noExiste = (reply: FastifyReply, que: string) =>
  reply.code(404).send({ code: 'NOT_FOUND', message: `${que} no existe` });

// REST "de manual": un recurso por URL, sin endpoints armados a medida de una pantalla.
export function registrarRest(app: FastifyInstance, servicio: ServicioTurnos) {
  app.get<{ Querystring: { profesionalId?: string } }>('/api/turnos', async (request) =>
    servicio.listarTurnos(request.query.profesionalId));

  app.get<{ Params: { id: string } }>('/api/turnos/:id', async (request, reply) =>
    servicio.turno(request.params.id) ?? noExiste(reply, 'El turno'));

  app.get<{ Params: { id: string } }>('/api/pacientes/:id', async (request, reply) =>
    servicio.paciente(request.params.id) ?? noExiste(reply, 'El paciente'));

  app.get<{ Params: { id: string } }>('/api/profesionales/:id', async (request, reply) =>
    servicio.profesional(request.params.id) ?? noExiste(reply, 'El profesional'));

  app.post<{ Body: CrearTurnoInput }>(
    '/api/turnos',
    { schema: { body: {
      type: 'object',
      required: ['pacienteId', 'profesionalId', 'fecha'],
      additionalProperties: false,
      properties: {
        pacienteId: { type: 'string', minLength: 1 },
        profesionalId: { type: 'string', minLength: 1 },
        fecha: { type: 'string', minLength: 1 }
      }
    } } },
    async (request, reply) => {
      try {
        return reply.code(201).send(servicio.crearTurno(request.body));
      } catch (error) {
        if (!(error instanceof TurnoError)) throw error;
        const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'CONFLICT' ? 409 : 400;
        return reply.code(status).send({ code: error.code, message: error.message });
      }
    }
  );
}
