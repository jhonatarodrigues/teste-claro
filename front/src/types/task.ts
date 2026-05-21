export type TaskStatus = 'Pendente' | 'Em Progresso' | 'Concluida';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  teamIds: string[];
};

export type TaskFilters = {
  teamId?: string;
  status?: TaskStatus;
  search?: string;
  sort?: 'title' | 'dueDate' | 'status';
  offset?: number;
  limit?: number;
};
