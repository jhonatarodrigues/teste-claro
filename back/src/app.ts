import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { logger } from './lib/logger';
import { errorHandler } from './middlewares/error-handler';
import { notFound } from './middlewares/not-found';
import { tasksRouter } from './modules/tasks/tasks.routes';
import { teamsRouter } from './modules/teams/teams.routes';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/health', (_request, response) => {
  response.status(200).json({ data: { status: 'ok' } });
});

app.use('/api/teams', teamsRouter);
app.use('/api/tasks', tasksRouter);

app.use(notFound);
app.use(errorHandler);
