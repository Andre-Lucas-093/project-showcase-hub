import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/connection.js';
import { isConnectionError } from '../database/sql.js';
import type { ProjectMember } from '../types/index.js';

interface ProjectMemberRow extends RowDataPacket {
  id: number;
  projeto_id: number | null;
  usuario_id: number | null;
}

let members: ProjectMember[] = [
  { id: 1, projeto_id: 1, usuario_id: 1 },
  { id: 2, projeto_id: 2, usuario_id: 1 },
];

function getNextMemberId(): number {
  return members.reduce((maxId, member) => Math.max(maxId, member.id), 0) + 1;
}

function mapMember(row: ProjectMemberRow): ProjectMember {
  return {
    id: row.id,
    projeto_id: row.projeto_id,
    usuario_id: row.usuario_id,
  };
}

export async function getByProject(projectId: number): Promise<ProjectMember[]> {
  try {
    const [rows] = await pool.query<ProjectMemberRow[]>(
      `SELECT id, projeto_id, usuario_id
       FROM projeto_membros
       WHERE projeto_id = ?
       ORDER BY id ASC`,
      [projectId],
    );

    return rows.map(mapMember);
  } catch (error) {
    if (isConnectionError(error)) {
      return members.filter(m => m.projeto_id === projectId);
    }

    console.warn('[db] members.getByProject failed, using memory fallback.');
    return members.filter(m => m.projeto_id === projectId);
  }
}

export async function insert(data: Omit<ProjectMember, 'id'>): Promise<ProjectMember> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO projeto_membros (projeto_id, usuario_id)
       VALUES (?, ?)`,
      [data.projeto_id, data.usuario_id],
    );

    const [rows] = await pool.query<ProjectMemberRow[]>(
      `SELECT id, projeto_id, usuario_id
       FROM projeto_membros
       WHERE id = ?
       LIMIT 1`,
      [result.insertId],
    );

    if (!rows[0]) {
      throw new Error('Nao foi possivel recuperar membro inserido');
    }

    return mapMember(rows[0]);
  } catch (error) {
    const member: ProjectMember = {
      id: getNextMemberId(),
      ...data,
    };
    members.push(member);

    if (!isConnectionError(error)) {
      console.warn('[db] members.insert failed, using memory fallback.');
    }

    return member;
  }
}

export async function deleteByIds(projectId: number, userId: number): Promise<boolean> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM projeto_membros
       WHERE projeto_id = ? AND usuario_id = ?`,
      [projectId, userId],
    );

    return result.affectedRows > 0;
  } catch (error) {
    const len = members.length;
    members = members.filter(m => !(m.projeto_id === projectId && m.usuario_id === userId));
    if (!isConnectionError(error)) {
      console.warn('[db] members.deleteByIds failed, using memory fallback.');
    }
    return members.length < len;
  }
}
