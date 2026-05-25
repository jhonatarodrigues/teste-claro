import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMocks = vi.hoisted(() => ({
  teamFindMany: vi.fn(),
  teamCount: vi.fn(),
  teamFindUnique: vi.fn(),
  teamDelete: vi.fn(),
  taskFindMany: vi.fn(),
  taskCount: vi.fn(),
  taskDelete: vi.fn(),
  taskTeamDeleteMany: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock('../../lib/prisma', () => ({
  prisma: {
    team: {
      findMany: prismaMocks.teamFindMany,
      count: prismaMocks.teamCount,
      create: vi.fn(),
      findUnique: prismaMocks.teamFindUnique,
      update: vi.fn(),
      delete: prismaMocks.teamDelete,
    },
    task: {
      findMany: prismaMocks.taskFindMany,
      count: prismaMocks.taskCount,
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: prismaMocks.taskDelete,
    },
    taskTeam: {
      deleteMany: prismaMocks.taskTeamDeleteMany,
      createMany: vi.fn(),
    },
    $transaction: prismaMocks.transaction,
  },
}));

import { app } from '../../app';

describe('app bootstrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMocks.transaction.mockImplementation(async (operationsOrCallback: unknown) => {
      if (typeof operationsOrCallback === 'function') {
        return operationsOrCallback({
          team: {
            delete: prismaMocks.teamDelete,
          },
          taskTeam: {
            deleteMany: prismaMocks.taskTeamDeleteMany,
          },
        });
      }

      return Promise.all(operationsOrCallback as Promise<unknown>[]);
    });
  });

  it('returns teams with data and meta', async () => {
    prismaMocks.teamFindMany.mockResolvedValue([
      {
        id: 'team-1',
        name: 'Team A',
        colorHex: '#8BFF3D',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    prismaMocks.teamCount.mockResolvedValue(1);

    const response = await request(app).get('/api/teams');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          id: 'team-1',
          name: 'Team A',
          colorHex: '#8BFF3D',
          description: null,
        },
      ],
      meta: {
        total: 1,
        limit: 20,
        offset: 0,
      },
    });
  });

  it('returns tasks with pagination even without filters', async () => {
    prismaMocks.taskFindMany.mockResolvedValue([
      {
        id: 'task-1',
        title: 'Task title',
        description: 'Task description',
        status: 'Pendente',
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        teamLinks: [
          {
            teamId: 'team-1',
          },
        ],
      },
    ]);
    prismaMocks.taskCount.mockResolvedValue(1);

    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          id: 'task-1',
          title: 'Task title',
          description: 'Task description',
          status: 'Pendente',
          dueDate: null,
          teamIds: ['team-1'],
        },
      ],
      meta: {
        total: 1,
        limit: 20,
        offset: 0,
      },
    });
  });

  it('returns the standard error envelope for missing routes', async () => {
    const response = await request(app).get('/missing-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  it('returns the standard error envelope for invalid payloads', async () => {
    const response = await request(app).post('/api/teams').send({
      name: 'AB',
      colorHex: 'green',
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.message).toBe('Invalid request data');
    expect(response.body.error.details).toBeDefined();
  });

  it('unlinks task relations before deleting a team without deleting tasks', async () => {
    prismaMocks.teamFindUnique.mockResolvedValue({
      id: 'team-1',
      name: 'Team A',
      colorHex: '#8BFF3D',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    prismaMocks.taskTeamDeleteMany.mockResolvedValue({ count: 2 });
    prismaMocks.teamDelete.mockResolvedValue({
      id: 'team-1',
      name: 'Team A',
      colorHex: '#8BFF3D',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).delete('/api/teams/team-1');

    expect(response.status).toBe(204);
    expect(prismaMocks.transaction).toHaveBeenCalledTimes(1);
    expect(prismaMocks.taskTeamDeleteMany).toHaveBeenCalledWith({
      where: {
        teamId: 'team-1',
      },
    });
    expect(prismaMocks.teamDelete).toHaveBeenCalledWith({
      where: {
        id: 'team-1',
      },
    });
    expect(prismaMocks.taskTeamDeleteMany.mock.invocationCallOrder[0]).toBeLessThan(
      prismaMocks.teamDelete.mock.invocationCallOrder[0],
    );
    expect(prismaMocks.taskDelete).not.toHaveBeenCalled();
  });
});
