import { app } from './app.js';
import { config } from './config/index.js';
import { testConnection } from './database/connection.js';

app.listen(config.port, async () => {
  console.log(`[server] API running on http://localhost:${config.port}`);
  console.log(`[server] Environment: ${config.nodeEnv}`);

  const dbOk = await testConnection();
  if (dbOk) {
    console.log(`[server] Banco de dados conectado: ${config.db.database}@${config.db.host}:${config.db.port}`);
  } else {
    console.warn('[server] Servidor rodando SEM conexão com banco de dados (modo in-memory).');
  }
});
