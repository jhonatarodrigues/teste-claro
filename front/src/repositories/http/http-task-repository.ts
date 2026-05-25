import { stripUndefined } from '../../lib/http/strip-undefined';
import { ApiItemResponse, ApiListResponse } from '../../types/api';
import { Task } from '../../types/task';
import { CreateTaskInput, TaskRepository, UpdateTaskInput } from '../contracts/task-repository';
import { createHttpClient, HttpClient } from './http-client';

type ApiTask = Omit<Task, 'description' | 'dueDate'> & {
  description?: string | null;
  dueDate?: string | null;
};

function normalizeTask(task: ApiTask): Task {
  return {
    ...task,
    description: task.description ?? undefined,
    dueDate: task.dueDate ?? undefined,
  };
}

function normalizeTaskListResponse(response: ApiListResponse<ApiTask>): ApiListResponse<Task> {
  return {
    ...response,
    data: response.data.map(normalizeTask),
  };
}

function normalizeTaskItemResponse(response: ApiItemResponse<ApiTask>): ApiItemResponse<Task> {
  return {
    data: normalizeTask(response.data),
  };
}

function normalizeDueDate(dueDate?: string) {
  if (dueDate === undefined) {
    return undefined;
  }

  const trimmed = dueDate.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeTaskInput(input: CreateTaskInput | UpdateTaskInput) {
  return stripUndefined({
    ...input,
    dueDate: normalizeDueDate(input.dueDate),
  });
}

export function createHttpTaskRepository(client: HttpClient = createHttpClient()): TaskRepository {
  return {
    async list(filters = {}): Promise<ApiListResponse<Task>> {
      const response = await client.get<ApiListResponse<ApiTask>>('/tasks', filters);
      return normalizeTaskListResponse(response);
    },

    async getById(id: string): Promise<ApiItemResponse<Task>> {
      const response = await client.get<ApiItemResponse<ApiTask>>(`/tasks/${id}`);
      return normalizeTaskItemResponse(response);
    },

    async create(input: CreateTaskInput): Promise<ApiItemResponse<Task>> {
      const response = await client.post<ApiItemResponse<ApiTask>>('/tasks', normalizeTaskInput(input));
      return normalizeTaskItemResponse(response);
    },

    async update(id: string, input: UpdateTaskInput): Promise<ApiItemResponse<Task>> {
      const response = await client.put<ApiItemResponse<ApiTask>>(`/tasks/${id}`, normalizeTaskInput(input));
      return normalizeTaskItemResponse(response);
    },

    async remove(id: string): Promise<void> {
      await client.delete(`/tasks/${id}`);
    },

    async updateStatus(id: string, status: Task['status']): Promise<ApiItemResponse<Task>> {
      const response = await client.put<ApiItemResponse<ApiTask>>(`/tasks/${id}`, { status });
      return normalizeTaskItemResponse(response);
    },
  };
}

export const httpTaskRepository = createHttpTaskRepository();
