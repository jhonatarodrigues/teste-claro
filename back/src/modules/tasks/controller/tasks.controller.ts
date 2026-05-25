import { Request, Response } from 'express';

import { ok, withMeta } from '../../../utils/api-response';
import { createTask, deleteTask, getTaskById, listTasks, updateTask } from '../service/tasks.service';
import { CreateTaskBody, ListTasksQuery, UpdateTaskBody } from '../schema/tasks.schema';

export async function listTasksController(request: Request, response: Response) {
  const result = await listTasks((request.validated?.query ?? request.query) as ListTasksQuery);
  return withMeta(response, result.data, result.meta);
}

export async function getTaskByIdController(request: Request, response: Response) {
  const { id } = (request.validated?.params ?? request.params) as { id: string };
  const task = await getTaskById(id);
  return ok(response, task);
}

export async function createTaskController(request: Request, response: Response) {
  const task = await createTask((request.validated?.body ?? request.body) as CreateTaskBody);
  return ok(response, task, 201);
}

export async function updateTaskController(request: Request, response: Response) {
  const { id } = (request.validated?.params ?? request.params) as { id: string };
  const task = await updateTask(id, (request.validated?.body ?? request.body) as UpdateTaskBody);
  return ok(response, task);
}

export async function deleteTaskController(request: Request, response: Response) {
  const { id } = (request.validated?.params ?? request.params) as { id: string };
  await deleteTask(id);
  return response.status(204).send();
}
