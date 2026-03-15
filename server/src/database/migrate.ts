import { pool } from './connection.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations(): Promise<void> {
  try {
    const schemaPath = join(__dirname, 'schema.sql');
    const rawSql = readFileSync(schemaPath, 'utf-8');
    const sql = rawSql.replace(/^\s*--.*$/gm, '');

    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const connection = await pool.getConnection();

    try {
      for (const statement of statements) {
        await connection.query(statement);
      }

      console.log(`[db] Migrations executadas com sucesso. ${statements.length} instrucoes aplicadas.`);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('[db] Erro ao executar migrations:', (error as Error).message);
    throw error;
  }
}

if (process.argv[1] === __filename) {
  runMigrations().catch(error => {
    console.error('[db] Falha na execucao das migrations:', (error as Error).message);
    process.exit(1);
  });
}
