import { Router } from 'express';

import { validate } from '../../middlewares/validate';
import {
  createTaskController,
  deleteTaskController,
  getTaskByIdController,
  listTasksController,
  updateTaskController,
} from './tasks.controller';
import { createTaskBodySchema, listTasksQuerySchema, taskParamsSchema, updateTaskBodySchema } from './tasks.schema';

export const tasksRouter = Router();

tasksRouter.get('/', validate({ query: listTasksQuerySchema }), listTasksController);
tasksRouter.get('/:id', validate({ params: taskParamsSchema }), getTaskByIdController);
tasksRouter.post('/', validate({ body: createTaskBodySchema }), createTaskController);
tasksRouter.put('/:id', validate({ params: taskParamsSchema, body: updateTaskBodySchema }), updateTaskController);
tasksRouter.delete('/:id', validate({ params: taskParamsSchema }), deleteTaskController);
