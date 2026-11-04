export type StageId = 'nuevo' | 'contactado' | 'propuesta' | 'negociacion' | 'ganado';

export interface Stage {
  id: StageId;
  name: string;
  /** Dot / bar color. */
  color: string;
  /** Avatar & tag background. */
  tag: string;
}

export interface Note {
  when: string;
  text: string;
}

export interface Deal {
  id: number;
  name: string;
  company: string;
  value: number;
  stage: StageId;
  owner: string;
  /** Human-readable "last activity" label, e.g. "hace 2 días". */
  last: string;
  email: string;
  phone: string;
  notes: Note[];
}

export type Access = 'admin' | 'responsable';

export interface Member {
  name: string;
  role: string;
  access: Access;
}

export const STAGES: Stage[] = [
  { id: 'nuevo', name: 'Nuevo', color: 'var(--blue-500)', tag: 'var(--blue-400)' },
  { id: 'contactado', name: 'Contactado', color: 'var(--orange-500)', tag: 'var(--orange-400)' },
  { id: 'propuesta', name: 'Propuesta', color: 'var(--pink-500)', tag: 'var(--pink-400)' },
  { id: 'negociacion', name: 'Negociación', color: 'var(--lime-600)', tag: 'var(--lime-300)' },
  { id: 'ganado', name: 'Ganado', color: 'var(--ink-800)', tag: 'var(--ink-100)' },
];

export const stageOf = (id: StageId): Stage => STAGES.find((s) => s.id === id)!;
export const stageIndex = (id: StageId) => STAGES.findIndex((s) => s.id === id);
export const nextStage = (id: StageId): Stage | undefined => STAGES[stageIndex(id) + 1];

export const usd = (n: number) => '$' + Number(n).toLocaleString('en-US');
export const initials = (n: string) =>
  n
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

/** A lead counts as "stale" when it hasn't been touched in 4+ days and isn't won. */
export const isStale = (d: Deal) => d.stage !== 'ganado' && /hace [4-9] días|semana/.test(d.last);

/** Leads shown in "Seguimientos pendientes": open and not contacted today/yesterday. */
export const needsFollowUp = (d: Deal) =>
  d.stage !== 'ganado' && /día|semana|hoy|ayer/.test(d.last) && !/hoy|ayer/.test(d.last);

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const SEED_ROWS: [string, string, number, StageId, string, string][] = [
  ['Valeria Mendoza', 'Colegio San Andrés', 4800, 'nuevo', 'Ana', 'hace 1 día'],
  ['Diego Paredes', 'Academia Nova', 2200, 'nuevo', 'Luis', 'hoy'],
  ['Camila Torres', 'Instituto Horizonte', 7500, 'contactado', 'Ana', 'hace 2 días'],
  ['Marco Ibáñez', 'Escuela Los Pinos', 3100, 'contactado', 'Luis', 'hace 4 días'],
  ['Lucía Fernández', 'Colegio Alameda', 9200, 'propuesta', 'Ana', 'hace 3 días'],
  ['Sebastián Rivas', 'Centro Educativo Sol', 5400, 'propuesta', 'Marta', 'hace 6 días'],
  ['Andrea Quispe', 'Liceo Kantu', 12600, 'negociacion', 'Ana', 'ayer'],
  ['Javier Salas', 'Colegio Mayor', 8300, 'negociacion', 'Luis', 'hace 2 días'],
  ['Renata Campos', 'Instituto Andino', 6100, 'ganado', 'Marta', 'hace 1 semana'],
  ['Pablo Ortega', 'Academia Cumbre', 3900, 'ganado', 'Ana', 'hace 2 semanas'],
];

export const SEED_DEALS: Deal[] = SEED_ROWS.map((r, i) => ({
  id: i + 1,
  name: r[0],
  company: r[1],
  value: r[2],
  stage: r[3],
  owner: r[4],
  last: r[5],
  email: slug(r[0].split(' ')[0]) + '@' + slug(r[1].split(' ').pop()!) + '.edu',
  phone: '+51 9' + (10000000 + ((i * 3719283) % 89999999)),
  notes: [{ when: r[5], text: 'Primer contacto: interesado en cursos de programación para sus estudiantes.' }],
}));

export const SEED_TEAM: Member[] = [
  { name: 'Ana', role: 'Gerente comercial', access: 'admin' },
  { name: 'Luis', role: 'Ejecutivo de ventas', access: 'responsable' },
  { name: 'Marta', role: 'Ejecutiva de ventas', access: 'responsable' },
];

export const MEMBER_COLORS = ['var(--lime-300)', 'var(--pink-400)', 'var(--orange-400)', 'var(--blue-400)'];
export const accessLabel = (a: Access) => (a === 'admin' ? 'Admin' : 'Responsable');
export const accessBg = (a: Access) => (a === 'admin' ? 'var(--lime-300)' : 'var(--blue-400)');
