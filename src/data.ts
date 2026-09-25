export type EstadoTurno = 'PROGRAMADO' | 'CANCELADO' | 'ATENDIDO';

export interface Paciente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  obraSocial: string;
}

export interface Profesional {
  id: string;
  nombre: string;
  especialidad: string;
}

export interface Turno {
  id: string;
  fecha: string;
  estado: EstadoTurno;
  pacienteId: string;
  profesionalId: string;
}

export interface CrearTurnoInput {
  pacienteId: string;
  profesionalId: string;
  fecha: string;
}

export const pacientes: Paciente[] = [
  { id: 'pac-1', nombre: 'Ana Pérez', email: 'ana@example.com', telefono: '11-5555-0001', obraSocial: 'OSDE' },
  { id: 'pac-2', nombre: 'Luis Gómez', email: 'luis@example.com', telefono: '11-5555-0002', obraSocial: 'Swiss Medical' },
  { id: 'pac-3', nombre: 'María Díaz', email: 'maria@example.com', telefono: '11-5555-0003', obraSocial: 'Galeno' },
  { id: 'pac-4', nombre: 'Carlos Ruiz', email: 'carlos@example.com', telefono: '11-5555-0004', obraSocial: 'OSDE' },
  { id: 'pac-5', nombre: 'Sofía Torres', email: 'sofia@example.com', telefono: '11-5555-0005', obraSocial: 'PAMI' },
  { id: 'pac-6', nombre: 'Jorge Silva', email: 'jorge@example.com', telefono: '11-5555-0006', obraSocial: 'Galeno' }
];

export const profesionales: Profesional[] = [
  { id: 'prof-1', nombre: 'Dra. Elena Ruiz', especialidad: 'Clínica médica' },
  { id: 'prof-2', nombre: 'Dr. Martín López', especialidad: 'Cardiología' },
  { id: 'prof-3', nombre: 'Dra. Paula Vega', especialidad: 'Dermatología' },
  { id: 'prof-4', nombre: 'Dr. Hugo Sosa', especialidad: 'Traumatología' },
  { id: 'prof-5', nombre: 'Dra. Laura Mena', especialidad: 'Pediatría' }
];

export const turnosIniciales: Turno[] = [
  { id: 'turno-1', fecha: '2030-05-20T09:00:00Z', estado: 'PROGRAMADO', pacienteId: 'pac-1', profesionalId: 'prof-1' },
  { id: 'turno-2', fecha: '2030-05-20T10:00:00Z', estado: 'PROGRAMADO', pacienteId: 'pac-2', profesionalId: 'prof-1' },
  { id: 'turno-3', fecha: '2030-05-21T11:00:00Z', estado: 'PROGRAMADO', pacienteId: 'pac-1', profesionalId: 'prof-2' },
  { id: 'turno-4', fecha: '2030-05-21T09:00:00Z', estado: 'PROGRAMADO', pacienteId: 'pac-3', profesionalId: 'prof-3' },
  { id: 'turno-5', fecha: '2030-05-22T15:00:00Z', estado: 'PROGRAMADO', pacienteId: 'pac-4', profesionalId: 'prof-2' },
  { id: 'turno-6', fecha: '2030-05-22T16:00:00Z', estado: 'CANCELADO', pacienteId: 'pac-5', profesionalId: 'prof-4' },
  { id: 'turno-7', fecha: '2026-09-10T13:00:00Z', estado: 'ATENDIDO', pacienteId: 'pac-6', profesionalId: 'prof-5' },
  { id: 'turno-8', fecha: '2026-09-11T12:00:00Z', estado: 'ATENDIDO', pacienteId: 'pac-1', profesionalId: 'prof-1' },
  { id: 'turno-9', fecha: '2026-09-12T14:00:00Z', estado: 'ATENDIDO', pacienteId: 'pac-2', profesionalId: 'prof-3' },
  { id: 'turno-10', fecha: '2030-05-23T09:00:00Z', estado: 'PROGRAMADO', pacienteId: 'pac-3', profesionalId: 'prof-1' }
];
