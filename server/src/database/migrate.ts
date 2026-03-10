import { pool } from './connection.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations(): Promise<void> {
  try {
    const schemaPath = join(__dirname, 'schema.sql');
    const sql = readFileSync(schemaPath, 'utf-8');

    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const connection = await pool.getConnection();

    for (const statement of statements) {
      await connection.query(statement);
    }

    connection.release();
    console.log('[db] Migrations executadas com sucesso.');
  } catch (error) {
    console.error('[db] Erro ao executar migrations:', (error as Error).message);
    throw error;
  }
}
