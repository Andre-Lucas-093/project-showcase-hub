import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/connection.js';
import { isConnectionError, toDateString } from '../database/sql.js';
import type { Project, ProjectStatus } from '../types/index.js';

interface ProjectRow extends RowDataPacket {
  projeto_id: number;
  logo: string | null;
  titulo: string;
  descricao: string | null;
  status: ProjectStatus;
  curso_id: number | null;
  area?: string | null;
  criado_em: Date | string | null;
  atualizado_em: Date | string | null;
  dono_id: number | null;
  prazo_final: Date | string | null;
}

let projects: Project[] = [
  {
    projeto_id: 1,
    logo: '',
    titulo: 'SmartCampus IoT',
    descricao: 'Sistema de monitoramento inteligente do campus universitário utilizando sensores IoT.',
    status: 'andamento',
    curso_id: 2,
    area: 'Ciência da Computação',
    criado_em: '2024-06-01',
    atualizado_em: '2025-01-15',
    dono_id: 1,
    prazo_final: '2025-07-30',
  },
  {
    projeto_id: 2,
    logo: '',
    titulo: 'MedIA - Diagnóstico Assistido',
    descricao: 'Aplicação de redes neurais convolucionais para auxílio no diagnóstico de imagens médicas.',
    status: 'concluido',
    curso_id: 7,
    area: 'Medicina',
    criado_em: '2024-02-10',
    atualizado_em: '2024-12-20',
    dono_id: 1,
    prazo_final: '2024-12-15',
  },
];

function getNextProjectId(): number {
  return projects.reduce((maxId, project) => Math.max(maxId, project.projeto_id), 0) + 1;
}

function mapProject(row: ProjectRow): Project {
  return {
    projeto_id: row.projeto_id,
    logo: row.logo,
    titulo: row.titulo,
    descricao: row.descricao,
    status: row.status,
    curso_id: row.curso_id,
    area: row.area,
    criado_em: toDateString(row.criado_em),
    atualizado_em: toDateString(row.atualizado_em),
    dono_id: row.dono_id,
    prazo_final: toDateString(row.prazo_final),
  };
}

export async function getAll(): Promise<Project[]> {
  try {
    const [rows] = await pool.query<ProjectRow[]>(
      `SELECT p.projeto_id, p.logo, p.titulo, p.descricao, p.status, p.curso_id, c.nome as area, p.criado_em, p.atualizado_em, p.dono_id, p.prazo_final
       FROM projetos p
       LEFT JOIN cursos c ON p.curso_id = c.id
       ORDER BY p.projeto_id ASC`,
    );

    return rows.map(mapProject);
  } catch (error) {
    if (isConnectionError(error)) {
      return [...projects];
    }

    console.warn('[db] projects.getAll failed, using memory fallback.');
    return [...projects];
  }
}

export async function findById(id: number): Promise<Project | undefined> {
  try {
    const [rows] = await pool.query<ProjectRow[]>(
      `SELECT p.projeto_id, p.logo, p.titulo, p.descricao, p.status, p.curso_id, c.nome as area, p.criado_em, p.atualizado_em, p.dono_id, p.prazo_final
       FROM projetos p
       LEFT JOIN cursos c ON p.curso_id = c.id
       WHERE p.projeto_id = ?
       LIMIT 1`,
      [id],
    );

    return rows[0] ? mapProject(rows[0]) : undefined;
  } catch (error) {
    if (isConnectionError(error)) {
      return projects.find(p => p.projeto_id === id);
    }

    console.warn('[db] projects.findById failed, using memory fallback.');
    return projects.find(p => p.projeto_id === id);
  }
}

export async function insert(data: Omit<Project, 'projeto_id' | 'criado_em' | 'atualizado_em'>): Promise<Project> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO projetos (logo, titulo, descricao, status, curso_id, dono_id, prazo_final)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.logo,
        data.titulo,
        data.descricao,
        data.status,
        data.curso_id,
        data.dono_id,
        data.prazo_final,
      ],
    );

    const inserted = await findById(result.insertId);
    if (!inserted) {
      throw new Error('Nao foi possivel recuperar projeto inserido');
    }

    return inserted;
  } catch (error) {
    const now = new Date().toISOString().split('T')[0];
    const project: Project = {
      ...data,
      projeto_id: getNextProjectId(),
      area: undefined,
      criado_em: now,
      atualizado_em: now,
    };
    projects.push(project);

    if (!isConnectionError(error)) {
      console.warn('[db] projects.insert failed, using memory fallback.');
    }

    return project;
  }
}

export async function updateById(id: number, data: Partial<Project>): Promise<Project | undefined> {
  try {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.logo !== undefined) {
      updates.push('logo = ?');
      params.push(data.logo);
    }
    if (data.titulo !== undefined) {
      updates.push('titulo = ?');
      params.push(data.titulo);
    }
    if (data.descricao !== undefined) {
      updates.push('descricao = ?');
      params.push(data.descricao);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
    }
    if (data.curso_id !== undefined) {
      updates.push('curso_id = ?');
      params.push(data.curso_id);
    }
    if (data.dono_id !== undefined) {
      updates.push('dono_id = ?');
      params.push(data.dono_id);
    }
    if (data.prazo_final !== undefined) {
      updates.push('prazo_final = ?');
      params.push(data.prazo_final);
    }

    if (updates.length === 0) {
      return findById(id);
    }

    params.push(id);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE projetos
       SET ${updates.join(', ')}, atualizado_em = CURRENT_TIMESTAMP
       WHERE projeto_id = ?`,
      params,
    );

    if (result.affectedRows === 0) {
      return undefined;
    }

    return findById(id);
  } catch (error) {
    const idx = projects.findIndex(p => p.projeto_id === id);
    if (idx === -1) {
      return undefined;
    }

    projects[idx] = {
      ...projects[idx],
      ...data,
      atualizado_em: new Date().toISOString().split('T')[0],
    };

    if (!isConnectionError(error)) {
      console.warn('[db] projects.updateById failed, using memory fallback.');
    }

    return projects[idx];
  }
}

export async function deleteById(id: number): Promise<boolean> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM projetos WHERE projeto_id = ?',
      [id],
    );

    return result.affectedRows > 0;
  } catch (error) {
    const len = projects.length;
    projects = projects.filter(p => p.projeto_id !== id);
    if (!isConnectionError(error)) {
      console.warn('[db] projects.deleteById failed, using memory fallback.');
    }
    return projects.length < len;
  }
}
