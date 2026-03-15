import type { RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/connection.js';
import { isConnectionError } from '../database/sql.js';
import { getAll as getAllProjects } from './projects.js';

export type CourseCategory = 'graduacao' | 'pos_graduacao';

export interface CourseSummary {
  id?: number;
  nome: string;
  categoria: CourseCategory;
  modalidade?: 'presencial' | 'hibrido' | 'ead';
  total_extensoes: number;
  disponiveis: number;
  andamento: number;
  concluidos: number;
}

interface CourseSummaryRow extends RowDataPacket {
  id: number;
  nome: string;
  categoria: CourseCategory;
  modalidade: 'presencial' | 'hibrido' | 'ead';
  total_extensoes: number;
  disponiveis: number;
  andamento: number;
  concluidos: number;
}

const CATEGORY_OVERRIDES: Record<string, CourseCategory> = {
  'inteligencia artificial': 'pos_graduacao',
  'internet das coisas': 'pos_graduacao',
  backend: 'pos_graduacao',
};

function normalizeLabel(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function inferCategory(nome: string): CourseCategory {
  const normalized = normalizeLabel(nome);

  if (CATEGORY_OVERRIDES[normalized]) {
    return CATEGORY_OVERRIDES[normalized];
  }

  if (/\b(pos|pos graduacao|mba|especializacao|mestrado|doutorado|residencia)\b/.test(normalized)) {
    return 'pos_graduacao';
  }

  return 'graduacao';
}

function aggregateCoursesFromProjects(
  projects: Array<{ area?: string | null; status: 'concluido' | 'andamento' | 'disponivel' }>,
): CourseSummary[] {
  const map = new Map<string, CourseSummary>();

  for (const project of projects) {
    const nome = (project.area || '').trim();
    if (!nome) {
      continue;
    }

    if (!map.has(nome)) {
      map.set(nome, {
        nome,
        categoria: inferCategory(nome),
        total_extensoes: 0,
        disponiveis: 0,
        andamento: 0,
        concluidos: 0,
      });
    }

    const course = map.get(nome)!;
    course.total_extensoes += 1;

    if (project.status === 'disponivel') {
      course.disponiveis += 1;
    } else if (project.status === 'andamento') {
      course.andamento += 1;
    } else if (project.status === 'concluido') {
      course.concluidos += 1;
    }
  }

  return [...map.values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

export async function listCourseSummaries(): Promise<CourseSummary[]> {
  try {
    const [rows] = await pool.query<CourseSummaryRow[]>(
      `SELECT
         c.id AS id,
         c.nome AS nome,
         c.categoria AS categoria,
         c.modalidade AS modalidade,
         COUNT(p.projeto_id) AS total_extensoes,
         SUM(CASE WHEN p.status = 'disponivel' THEN 1 ELSE 0 END) AS disponiveis,
         SUM(CASE WHEN p.status = 'andamento' THEN 1 ELSE 0 END) AS andamento,
         SUM(CASE WHEN p.status = 'concluido' THEN 1 ELSE 0 END) AS concluidos
       FROM cursos c
       LEFT JOIN projetos p ON c.id = p.curso_id
       GROUP BY c.id, c.nome, c.categoria, c.modalidade
       ORDER BY c.nome ASC`,
    );

    return rows.map(row => ({
      id: row.id,
      nome: row.nome,
      categoria: row.categoria,
      modalidade: row.modalidade,
      total_extensoes: Number(row.total_extensoes) || 0,
      disponiveis: Number(row.disponiveis) || 0,
      andamento: Number(row.andamento) || 0,
      concluidos: Number(row.concluidos) || 0,
    }));
  } catch (error) {
    const projects = await getAllProjects();
    if (!isConnectionError(error)) {
      console.warn('[db] courses.listCourseSummaries failed, using projects fallback.');
    }
    return aggregateCoursesFromProjects(projects);
  }
}