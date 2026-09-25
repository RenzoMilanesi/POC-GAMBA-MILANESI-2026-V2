import DataLoader from 'dataloader';
import type { Paciente, Profesional } from './data.js';
import type { ServicioTurnos } from './turnos.js';

export interface Loaders {
  paciente: DataLoader<string, Paciente | undefined>;
  profesional: DataLoader<string, Profesional | undefined>;
}

declare module 'mercurius' {
  interface MercuriusContext {
    loaders: Loaders;
  }
}

// Con `conDataLoader: false` el mismo código hace una llamada por id: así se ve el N+1.
// Con `true`, DataLoader junta los ids del mismo "tick" y hace una sola llamada por tabla.
export function crearLoaders(servicio: ServicioTurnos, conDataLoader: boolean): Loaders {
  const opciones = { batch: conDataLoader, cache: conDataLoader };
  return {
    paciente: new DataLoader(async (ids) => servicio.pacientesPorIds(ids), opciones),
    profesional: new DataLoader(async (ids) => servicio.profesionalesPorIds(ids), opciones)
  };
}
