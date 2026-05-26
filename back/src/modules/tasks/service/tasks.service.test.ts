import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMocks = vi.hoisted(() => ({
  teamFindMany: vi.fn(),
  taskCreate: vi.fn(),
  taskFindUnique: vi.fn(),
  taskUpdate: vi.fn(),
}));

vi.mock('../../../lib/prisma', () => ({
  prisma: {
    team: {
      findMany: prismaMocks.teamFindMany,
    },
    task: {
      create: prismaMocks.taskCreate,
      findUnique: prismaMocks.taskFindUnique,
      update: prismaMocks.taskUpdate,
    },
  },
}));

import { createTask, updateTask } from './tasks.service';

describe('tasks.service teamIds validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects duplicate teamIds before creating a task', async () => {
    await expect(
      createTask({
        title: 'Task title',
        teamIds: [' team-1 ', 'team-1'],
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      code: 'INVALID_TASK_TEAM_IDS',
      message: 'Task teamIds must be unique non-empty strings',
      details: {
        duplicateTeamIds: ['team-1'],
        emptyIndexes: [],
      },
    });

    expect(prismaMocks.teamFindMany).not.toHaveBeenCalled();
    expect(prismaMocks.taskCreate).not.toHaveBeenCalled();
  });

  it('rejects empty teamIds before updating a task', async () => {
    prismaMocks.taskFindUnique.mockResolvedValue({
      id: 'task-1',
      title: 'Task title',
      description: null,
      status: 'Pendente',
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      updateTask('task-1', {
        teamIds: ['team-1', '  '],
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      code: 'INVALID_TASK_TEAM_IDS',
      message: 'Task teamIds must be unique non-empty strings',
      details: {
        duplicateTeamIds: [],
        emptyIndexes: [1],
      },
    });

    expect(prismaMocks.teamFindMany).not.toHaveBeenCalled();
    expect(prismaMocks.taskUpdate).not.toHaveBeenCalled();
  });

  it('rejects unknown teamIds before creating a task', async () => {
    prismaMocks.teamFindMany.mockResolvedValue([{ id: 'team-1' }]);

    await expect(
      createTask({
        title: 'Task title',
        teamIds: ['team-1', 'team-2'],
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      code: 'TASK_TEAM_IDS_NOT_FOUND',
      message: 'One or more task teamIds do not exist',
      details: {
        teamIds: ['team-2'],
      },
    });

    expect(prismaMocks.teamFindMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['team-1', 'team-2'],
        },
      },
      select: {
        id: true,
      },
    });
    expect(prismaMocks.taskCreate).not.toHaveBeenCalled();
  });
});
