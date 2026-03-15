import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/connection.js';
import { isConnectionError, toDateString } from '../database/sql.js';
import type { User, UserRole } from '../types/index.js';

interface UserRow extends RowDataPacket {
  usuario_id: number;
  nome: string;
  email: string;
  senha: string;
  papel: UserRole;
  bio_perfil: string | null;
  data_cadastro: Date | string | null;
}

let users: User[] = [
  {
    usuario_id: 1,
    nome: 'Carlos Admin',
    email: 'admin@projeto.com',
    senha: '',
    papel: 'admin',
    bio_perfil: 'Coordenador do laboratório de inovação tecnológica.',
    data_cadastro: '2024-01-10',
  },
];

function getNextUserId(): number {
  return users.reduce((maxId, user) => Math.max(maxId, user.usuario_id), 0) + 1;
}

function mapUser(row: UserRow): User {
  return {
    usuario_id: row.usuario_id,
    nome: row.nome,
    email: row.email,
    senha: row.senha,
    papel: row.papel,
    bio_perfil: row.bio_perfil,
    data_cadastro: toDateString(row.data_cadastro),
  };
}

export async function getAll(): Promise<User[]> {
  try {
    const [rows] = await pool.query<UserRow[]>(
      `SELECT usuario_id, nome, email, senha, papel, bio_perfil, data_cadastro
       FROM usuarios
       ORDER BY usuario_id ASC`,
    );

    return rows.map(mapUser);
  } catch (error) {
    if (isConnectionError(error)) {
      return [...users];
    }

    console.warn('[db] users.getAll failed, using memory fallback.');
    return [...users];
  }
}

export async function findById(id: number): Promise<User | undefined> {
  try {
    const [rows] = await pool.query<UserRow[]>(
      `SELECT usuario_id, nome, email, senha, papel, bio_perfil, data_cadastro
       FROM usuarios
       WHERE usuario_id = ?
       LIMIT 1`,
      [id],
    );

    return rows[0] ? mapUser(rows[0]) : undefined;
  } catch (error) {
    if (isConnectionError(error)) {
      return users.find(u => u.usuario_id === id);
    }

    console.warn('[db] users.findById failed, using memory fallback.');
    return users.find(u => u.usuario_id === id);
  }
}

export async function findByEmail(email: string): Promise<User | undefined> {
  try {
    const [rows] = await pool.query<UserRow[]>(
      `SELECT usuario_id, nome, email, senha, papel, bio_perfil, data_cadastro
       FROM usuarios
       WHERE email = ?
       LIMIT 1`,
      [email],
    );

    return rows[0] ? mapUser(rows[0]) : undefined;
  } catch (error) {
    if (isConnectionError(error)) {
      return users.find(u => u.email === email);
    }

    console.warn('[db] users.findByEmail failed, using memory fallback.');
    return users.find(u => u.email === email);
  }
}

export async function insert(data: Omit<User, 'usuario_id' | 'data_cadastro'>): Promise<User> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO usuarios (nome, email, senha, papel, bio_perfil)
       VALUES (?, ?, ?, ?, ?)`,
      [data.nome, data.email, data.senha, data.papel, data.bio_perfil],
    );

    const inserted = await findById(result.insertId);
    if (!inserted) {
      throw new Error('Nao foi possivel recuperar usuario inserido');
    }

    return inserted;
  } catch (error) {
    if (isConnectionError(error)) {
      const user: User = {
        ...data,
        usuario_id: getNextUserId(),
        data_cadastro: new Date().toISOString().split('T')[0],
      };
      users.push(user);
      return user;
    }

    console.warn('[db] users.insert failed, using memory fallback.');
    const user: User = {
      ...data,
      usuario_id: getNextUserId(),
      data_cadastro: new Date().toISOString().split('T')[0],
    };
    users.push(user);
    return user;
  }
}

export async function updateById(id: number, data: Partial<User>): Promise<User | undefined> {
  try {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.nome !== undefined) {
      updates.push('nome = ?');
      params.push(data.nome);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      params.push(data.email);
    }
    if (data.senha !== undefined) {
      updates.push('senha = ?');
      params.push(data.senha);
    }
    if (data.papel !== undefined) {
      updates.push('papel = ?');
      params.push(data.papel);
    }
    if (data.bio_perfil !== undefined) {
      updates.push('bio_perfil = ?');
      params.push(data.bio_perfil);
    }

    if (updates.length === 0) {
      return findById(id);
    }

    params.push(id);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE usuarios SET ${updates.join(', ')} WHERE usuario_id = ?`,
      params,
    );

    if (result.affectedRows === 0) {
      return undefined;
    }

    return findById(id);
  } catch (error) {
    const idx = users.findIndex(u => u.usuario_id === id);
    if (idx === -1) {
      return undefined;
    }

    users[idx] = { ...users[idx], ...data };
    if (!isConnectionError(error)) {
      console.warn('[db] users.updateById failed, using memory fallback.');
    }
    return users[idx];
  }
}

export async function deleteById(id: number): Promise<boolean> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM usuarios WHERE usuario_id = ?',
      [id],
    );

    return result.affectedRows > 0;
  } catch (error) {
    const len = users.length;
    users = users.filter(u => u.usuario_id !== id);
    if (!isConnectionError(error)) {
      console.warn('[db] users.deleteById failed, using memory fallback.');
    }
    return users.length < len;
  }
}
