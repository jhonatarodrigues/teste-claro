import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../utils/app-error';
import { normalizePagination } from '../../../utils/pagination';
import { toTeamResponse } from '../mapper/teams.mapper';
import { CreateTeamBody, ListTeamsQuery, UpdateTeamBody } from '../schema/teams.schema';

export async function listTeams(query: ListTeamsQuery) {
  const { limit, offset } = normalizePagination(query);

  const where = query.search?.trim()
    ? {
        name: {
          contains: query.search.trim(),
        },
      }
    : {};

  const [teams, total] = await prisma.$transaction([
    prisma.team.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.team.count({ where }),
  ]);

  return {
    data: teams.map(toTeamResponse),
    meta: {
      total,
      limit,
      offset,
    },
  };
}

export async function getTeamById(id: string) {
  const team = await prisma.team.findUnique({ where: { id } });

  if (!team) {
    throw new AppError(404, 'TEAM_NOT_FOUND', 'Team not found');
  }

  return toTeamResponse(team);
}

export async function createTeam(input: CreateTeamBody) {
  const team = await prisma.team.create({
    data: {
      name: input.name,
      colorHex: input.colorHex,
      description: input.description,
    },
  });

  return toTeamResponse(team);
}

export async function updateTeam(id: string, input: UpdateTeamBody) {
  const existing = await prisma.team.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, 'TEAM_NOT_FOUND', 'Team not found');
  }

  const team = await prisma.team.update({
    where: { id },
    data: {
      name: input.name,
      colorHex: input.colorHex,
      description: input.description,
    },
  });

  return toTeamResponse(team);
}

export async function deleteTeam(id: string) {
  const existing = await prisma.team.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, 'TEAM_NOT_FOUND', 'Team not found');
  }

  await prisma.team.delete({ where: { id } });
}
