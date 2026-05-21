import { ApiItemResponse, ApiListResponse } from '../../types/api';
import { Task, TaskFilters, TaskStatus } from '../../types/task';

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  teamIds?: string[];
};

export interface TaskRepository {
  list(filters?: TaskFilters): Promise<ApiListResponse<Task>>;
  getById(id: string): Promise<ApiItemResponse<Task>>;
  create(input: CreateTaskInput): Promise<ApiItemResponse<Task>>;
  update(id: string, input: CreateTaskInput): Promise<ApiItemResponse<Task>>;
  remove(id: string): Promise<void>;
  updateStatus(id: string, status: TaskStatus): Promise<ApiItemResponse<Task>>;
}
