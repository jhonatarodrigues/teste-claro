import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../utils/app-error';
import { normalizePagination } from '../../../utils/pagination';
import { apiStatusToPrisma, buildTaskOrderBy, buildTaskWhere } from '../../../utils/prisma-filters';
import { toTaskResponse } from '../mapper/tasks.mapper';
import { CreateTaskBody, ListTasksQuery, UpdateTaskBody } from '../schema/tasks.schema';

function normalizeTaskTeamIds(teamIds: string[] | undefined) {
  if (teamIds === undefined) {
    return undefined;
  }

  const normalizedTeamIds = teamIds.map((teamId) => teamId.trim());
  const emptyIndexes = normalizedTeamIds.flatMap((teamId, index) => (teamId.length === 0 ? [index] : []));
  const seen = new Set<string>();
  const duplicateTeamIds = new Set<string>();

  for (const teamId of normalizedTeamIds) {
    if (teamId.length === 0) {
      continue;
    }

    if (seen.has(teamId)) {
      duplicateTeamIds.add(teamId);
      continue;
    }

    seen.add(teamId);
  }

  if (emptyIndexes.length > 0 || duplicateTeamIds.size > 0) {
    throw new AppError(400, 'INVALID_TASK_TEAM_IDS', 'Task teamIds must be unique non-empty strings', {
      duplicateTeamIds: [...duplicateTeamIds],
      emptyIndexes,
    });
  }

  return normalizedTeamIds;
}

async function ensureTaskTeamsExist(teamIds: string[] | undefined) {
  if (!teamIds || teamIds.length === 0) {
    return teamIds ?? [];
  }

  const teams = await prisma.team.findMany({
    where: {
      id: {
        in: teamIds,
      },
    },
    select: {
      id: true,
    },
  });

  const foundTeamIds = new Set(teams.map((team) => team.id));
  const missingTeamIds = teamIds.filter((teamId) => !foundTeamIds.has(teamId));

  if (missingTeamIds.length > 0) {
    throw new AppError(400, 'TASK_TEAM_IDS_NOT_FOUND', 'One or more task teamIds do not exist', {
      teamIds: missingTeamIds,
    });
  }

  return teamIds;
}

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
  const teamIds = await ensureTaskTeamsExist(normalizeTaskTeamIds(input.teamIds));

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: apiStatusToPrisma(input.status) ?? 'Pendente',
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      teamLinks: {
        create: teamIds.map((teamId) => ({ teamId })),
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

  const teamIds = input.teamIds === undefined ? undefined : await ensureTaskTeamsExist(normalizeTaskTeamIds(input.teamIds));

  const task = await prisma.task.update({
    where: { id },
    data: {
      title: input.title,
      description: input.description,
      status: input.status ? apiStatusToPrisma(input.status) : undefined,
      dueDate: input.dueDate ? new Date(input.dueDate) : input.dueDate === undefined ? undefined : null,
      teamLinks: teamIds
        ? {
            deleteMany: {},
            create: teamIds.map((teamId) => ({ teamId })),
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
