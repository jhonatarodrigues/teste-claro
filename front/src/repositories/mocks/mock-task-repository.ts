import { ApiItemResponse, ApiListResponse } from '../../types/api';
import { Task } from '../../types/task';
import { CreateTaskInput, TaskRepository, UpdateTaskInput } from '../contracts/task-repository';
import { createId, mockTasks } from './mock-db';

export const mockTaskRepository: TaskRepository = {
  async list(filters = {}): Promise<ApiListResponse<Task>> {
    const { teamId, status, search, sort = 'status', offset = 0, limit = 50 } = filters;

    let filtered = [...mockTasks];

    if (teamId) {
      filtered = filtered.filter((task) => task.teamIds.includes(teamId));
    }

    if (status) {
      filtered = filtered.filter((task) => task.status === status);
    }

    if (search?.trim()) {
      const normalized = search.trim().toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(normalized) ||
          task.description?.toLowerCase().includes(normalized),
      );
    }

    filtered.sort((left, right) => {
      if (sort === 'title') {
        return left.title.localeCompare(right.title);
      }

      if (sort === 'dueDate') {
        return (left.dueDate ?? '').localeCompare(right.dueDate ?? '');
      }

      return left.status.localeCompare(right.status);
    });

    return {
      data: filtered.slice(offset, offset + limit),
      meta: {
        total: filtered.length,
        offset,
        limit,
      },
    };
  },

  async getById(id: string): Promise<ApiItemResponse<Task>> {
    const task = mockTasks.find((item) => item.id === id);

    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    return { data: task };
  },

  async create(input: CreateTaskInput): Promise<ApiItemResponse<Task>> {
    const task: Task = {
      id: createId('task'),
      title: input.title,
      description: input.description,
      status: input.status ?? 'Pendente',
      dueDate: input.dueDate,
      teamIds: input.teamIds ?? [],
    };

    mockTasks.unshift(task);

    return { data: task };
  },

  async update(id: string, input: UpdateTaskInput): Promise<ApiItemResponse<Task>> {
    const taskIndex = mockTasks.findIndex((item) => item.id === id);

    if (taskIndex < 0) {
      throw new Error('Tarefa não encontrada');
    }

    const current = mockTasks[taskIndex];
    const updated: Task = {
      ...current,
      ...input,
      status: input.status ?? current.status,
      teamIds: input.teamIds ?? current.teamIds,
    };

    mockTasks[taskIndex] = updated;

    return { data: updated };
  },

  async remove(id: string): Promise<void> {
    const taskIndex = mockTasks.findIndex((item) => item.id === id);

    if (taskIndex < 0) {
      throw new Error('Tarefa não encontrada');
    }

    mockTasks.splice(taskIndex, 1);
  },

  async updateStatus(id: string, status: Task['status']): Promise<ApiItemResponse<Task>> {
    const task = mockTasks.find((item) => item.id === id);

    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    task.status = status;

    return { data: task };
  },
};
