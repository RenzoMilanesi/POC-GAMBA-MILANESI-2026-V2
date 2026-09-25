import {
  pacientes,
  profesionales,
  turnosIniciales,
  type CrearTurnoInput,
  type Turno
} from './data.js';

export type ErrorCode = 'VALIDATION_ERROR' | 'NOT_FOUND' | 'CONFLICT';

export class TurnoError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'TurnoError';
  }
}

// Lógica de negocio compartida por GraphQL y REST. Cada método que "toca la base"
// suma un acceso: sirve para mostrar el problema N+1 en el log del servidor.
export function crearServicioTurnos(onTurnoCreado: (turno: Turno) => void = () => {}) {
  const turnos: Turno[] = turnosIniciales.map((turno) => ({ ...turno }));
  let siguienteId = turnos.length + 1;
  const accesos = { turnos: 0, pacientes: 0, profesionales: 0 };

  const reiniciarAccesos = () => {
    accesos.turnos = accesos.pacientes = accesos.profesionales = 0;
  };

  // Un acceso por llamada, sin importar cuántos ids se pidan (equivale a un WHERE id IN (...)).
  function pacientesPorIds(ids: readonly string[]) {
    accesos.pacientes++;
    return ids.map((id) => pacientes.find((p) => p.id === id));
  }

  function profesionalesPorIds(ids: readonly string[]) {
    accesos.profesionales++;
    return ids.map((id) => profesionales.find((p) => p.id === id));
  }

  const paciente = (id: string) => pacientesPorIds([id])[0];
  const profesional = (id: string) => profesionalesPorIds([id])[0];

  function turno(id: string) {
    accesos.turnos++;
    return turnos.find((t) => t.id === id);
  }

  function listarTurnos(profesionalId?: string) {
    accesos.turnos++;
    return turnos.filter((t) => !profesionalId || t.profesionalId === profesionalId);
  }

  function crearTurno(input: CrearTurnoInput): Turno {
    if (!pacientes.some((p) => p.id === input.pacienteId)) {
      throw new TurnoError('NOT_FOUND', 'El paciente no existe');
    }
    if (!profesionales.some((p) => p.id === input.profesionalId)) {
      throw new TurnoError('NOT_FOUND', 'El profesional no existe');
    }

    const fechaEnMs = Date.parse(input.fecha);
    if (Number.isNaN(fechaEnMs)) {
      throw new TurnoError('VALIDATION_ERROR', 'La fecha no se puede interpretar');
    }

    if (turnos.some((t) =>
      t.profesionalId === input.profesionalId && Date.parse(t.fecha) === fechaEnMs
    )) {
      throw new TurnoError('CONFLICT', 'El profesional ya tiene un turno en esa fecha y hora');
    }

    const nuevo: Turno = {
      id: `turno-${siguienteId++}`,
      fecha: input.fecha,
      estado: 'PROGRAMADO',
      pacienteId: input.pacienteId,
      profesionalId: input.profesionalId
    };
    turnos.push(nuevo);
    onTurnoCreado(nuevo);
    return nuevo;
  }

  return {
    accesos,
    reiniciarAccesos,
    pacientesPorIds,
    profesionalesPorIds,
    paciente,
    profesional,
    turno,
    listarTurnos,
    crearTurno
  };
}

export type ServicioTurnos = ReturnType<typeof crearServicioTurnos>;
