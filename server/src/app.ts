import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { router } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

app.use('/api', router);
app.use(errorHandler);

export { app };
