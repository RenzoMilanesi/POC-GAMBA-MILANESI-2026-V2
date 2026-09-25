import { GraphQLError } from 'graphql';
import type { IResolvers } from 'mercurius';
import type { CrearTurnoInput, Turno } from './data.js';
import { TurnoError, type ServicioTurnos } from './turnos.js';

export const TOPIC_TURNO_CREADO = 'TURNO_CREADO';

export function crearResolvers(servicio: ServicioTurnos): IResolvers {
  return {
    Query: {
      turno: (_, args: { id: string }) => servicio.turno(args.id) ?? null,
      turnos: (_, args: { profesionalId?: string }) => servicio.listarTurnos(args.profesionalId)
    },
    Mutation: {
      // Los errores de negocio salen como errores GraphQL con `extensions.code`.
      crearTurno: (_, args: { input: CrearTurnoInput }) => {
        try {
          return servicio.crearTurno(args.input);
        } catch (error) {
          if (error instanceof TurnoError) {
            throw new GraphQLError(error.message, { extensions: { code: error.code } });
          }
          throw error;
        }
      }
    },
    Subscription: {
      turnoCreado: {
        subscribe: (_, __, { pubsub }) => pubsub.subscribe(TOPIC_TURNO_CREADO)
      }
    },
    // Cada campo del schema tiene su propia función. `turno` devuelve solo ids
    // (pacienteId, profesionalId); GraphQL llama a estas dos únicamente si el cliente
    // pidió `paciente` o `profesional`. Por eso una consulta no paga por lo que no pide.
    Turno: {
      paciente: (turno: Turno, _, { loaders }) => loaders.paciente.load(turno.pacienteId),
      profesional: (turno: Turno, _, { loaders }) => loaders.profesional.load(turno.profesionalId)
    }
  };
}
