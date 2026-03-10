import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 3001,
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'project_case',
  },
};
