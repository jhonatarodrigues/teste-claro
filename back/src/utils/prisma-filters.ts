import { Prisma, TaskStatus } from '@prisma/client';

import { TaskApiStatus } from '../modules/tasks/schema/tasks.schema';

type TaskListParams = {
  teamId?: string;
  status?: TaskApiStatus;
  search?: string;
  sort?: 'title' | 'dueDate' | 'status';
};

export function apiStatusToPrisma(status: TaskListParams['status']): TaskStatus | undefined {
  if (!status) return undefined;
  if (status === 'Em Progresso') return TaskStatus.Em_Progresso;
  if (status === 'Concluída') return TaskStatus.Concluida;
  return TaskStatus.Pendente;
}

export function buildTaskWhere(params: TaskListParams): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {};

  if (params.teamId) {
    where.teamLinks = {
      some: {
        teamId: params.teamId,
      },
    };
  }

  const prismaStatus = apiStatusToPrisma(params.status);
  if (prismaStatus) {
    where.status = prismaStatus;
  }

  if (params.search?.trim()) {
    const search = params.search.trim();
    where.OR = [
      {
        title: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
    ];
  }

  return where;
}

export function buildTaskOrderBy(sort?: TaskListParams['sort']): Prisma.TaskOrderByWithRelationInput[] {
  if (sort === 'title') {
    return [{ title: 'asc' }, { createdAt: 'desc' }, { id: 'desc' }];
  }

  if (sort === 'dueDate') {
    return [{ dueDate: 'asc' }, { createdAt: 'desc' }, { id: 'desc' }];
  }

  return [{ status: 'asc' }, { createdAt: 'desc' }, { id: 'desc' }];
}
