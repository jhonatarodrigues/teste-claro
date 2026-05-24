import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/app-error';
import { normalizePagination } from '../../utils/pagination';
import { apiStatusToPrisma, buildTaskOrderBy, buildTaskWhere } from '../../utils/prisma-filters';
import { CreateTaskBody, ListTasksQuery, UpdateTaskBody } from './tasks.schema';
import { toTaskResponse } from './tasks.mapper';

export async function listTasks(query: ListTasksQuery) {
  const { limit, offset } = normalizePagination(query);
  const where = buildTaskWhere(query);
  const orderBy = buildTaskOrderBy(query.sort);

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      include: {
        teamLinks: {
          select: {
            teamId: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks.map(toTaskResponse),
    meta: {
      total,
      limit,
      offset,
    },
  };
}

export async function getTaskById(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      teamLinks: {
        select: {
          teamId: true,
        },
      },
    },
  });

  if (!task) {
    throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
  }

  return toTaskResponse(task);
}

export async function createTask(input: CreateTaskBody) {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: apiStatusToPrisma(input.status) ?? 'Pendente',
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      teamLinks: {
        create: (input.teamIds ?? []).map((teamId) => ({ teamId })),
      },
    },
    include: {
      teamLinks: {
        select: {
          teamId: true,
        },
      },
    },
  });

  return toTaskResponse(task);
}

export async function updateTask(id: string, input: UpdateTaskBody) {
  const existing = await prisma.task.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      title: input.title,
      description: input.description,
      status: input.status ? apiStatusToPrisma(input.status) : undefined,
      dueDate: input.dueDate ? new Date(input.dueDate) : input.dueDate === undefined ? undefined : null,
      teamLinks: input.teamIds
        ? {
            deleteMany: {},
            create: input.teamIds.map((teamId) => ({ teamId })),
          }
        : undefined,
    },
    include: {
      teamLinks: {
        select: {
          teamId: true,
        },
      },
    },
  });

  return toTaskResponse(task);
}

export async function deleteTask(id: string) {
  const existing = await prisma.task.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
  }

  await prisma.task.delete({ where: { id } });
}
