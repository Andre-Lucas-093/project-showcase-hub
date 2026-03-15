import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/connection.js';
import { isConnectionError, toDateString } from '../database/sql.js';
import type { ProjectDocument } from '../types/index.js';

interface ProjectDocumentRow extends RowDataPacket {
  documento_id: number;
  projeto_id: number | null;
  url_arquivo: string;
  enviado_por: number | null;
  data_envio: Date | string | null;
}

let documents: ProjectDocument[] = [
  {
    documento_id: 1,
    projeto_id: 1,
    url_arquivo: 'https://example.com/documentos/arquitetura-iot-smartcampus.pdf',
    enviado_por: 1,
    data_envio: '2024-07-15',
  },
  {
    documento_id: 2,
    projeto_id: 2,
    url_arquivo: 'https://example.com/documentos/artigo-media-final.pdf',
    enviado_por: 1,
    data_envio: '2024-12-10',
  },
];

function getNextDocumentId(): number {
  return documents.reduce((maxId, document) => Math.max(maxId, document.documento_id), 0) + 1;
}

function mapDocument(row: ProjectDocumentRow): ProjectDocument {
  return {
    documento_id: row.documento_id,
    projeto_id: row.projeto_id,
    url_arquivo: row.url_arquivo,
    enviado_por: row.enviado_por,
    data_envio: toDateString(row.data_envio),
  };
}

export async function getByProject(projectId: number): Promise<ProjectDocument[]> {
  try {
    const [rows] = await pool.query<ProjectDocumentRow[]>(
      `SELECT documento_id, projeto_id, url_arquivo, enviado_por, data_envio
       FROM documentos
       WHERE projeto_id = ?
       ORDER BY documento_id ASC`,
      [projectId],
    );

    return rows.map(mapDocument);
  } catch (error) {
    if (isConnectionError(error)) {
      return documents.filter(d => d.projeto_id === projectId);
    }

    console.warn('[db] documents.getByProject failed, using memory fallback.');
    return documents.filter(d => d.projeto_id === projectId);
  }
}

export async function insert(data: Omit<ProjectDocument, 'documento_id' | 'data_envio'>): Promise<ProjectDocument> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO documentos (projeto_id, url_arquivo, enviado_por)
       VALUES (?, ?, ?)`,
      [data.projeto_id, data.url_arquivo, data.enviado_por],
    );

    const [rows] = await pool.query<ProjectDocumentRow[]>(
      `SELECT documento_id, projeto_id, url_arquivo, enviado_por, data_envio
       FROM documentos
       WHERE documento_id = ?
       LIMIT 1`,
      [result.insertId],
    );

    if (!rows[0]) {
      throw new Error('Nao foi possivel recuperar documento inserido');
    }

    return mapDocument(rows[0]);
  } catch (error) {
    const doc: ProjectDocument = {
      ...data,
      documento_id: getNextDocumentId(),
      data_envio: new Date().toISOString().split('T')[0],
    };
    documents.push(doc);

    if (!isConnectionError(error)) {
      console.warn('[db] documents.insert failed, using memory fallback.');
    }

    return doc;
  }
}

export async function deleteById(id: number): Promise<boolean> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM documentos WHERE documento_id = ?',
      [id],
    );

    return result.affectedRows > 0;
  } catch (error) {
    const len = documents.length;
    documents = documents.filter(d => d.documento_id !== id);
    if (!isConnectionError(error)) {
      console.warn('[db] documents.deleteById failed, using memory fallback.');
    }
    return documents.length < len;
  }
}
