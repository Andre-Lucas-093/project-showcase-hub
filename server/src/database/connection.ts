import mysql from 'mysql2/promise';
import { config } from '../config/index.js';

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    console.log('[db] Conexão com MySQL estabelecida com sucesso.');
    connection.release();
    return true;
  } catch (error) {
    console.error('[db] Falha ao conectar com MySQL:', (error as Error).message);
    return false;
  }
}

export { pool };
