import { ApiItemResponse, ApiListResponse } from '../../types/api';
import { Team } from '../../types/team';
import {
  CreateTeamInput,
  TeamFilters,
  TeamRepository,
} from '../contracts/team-repository';
import { createId, mockTasks, mockTeams } from './mock-db';

function paginate<T>(items: T[], offset = 0, limit = items.length): ApiListResponse<T> {
  const safeOffset = offset ?? 0;
  const safeLimit = limit ?? items.length;

  return {
    data: items.slice(safeOffset, safeOffset + safeLimit),
    meta: {
      total: items.length,
      offset: safeOffset,
      limit: safeLimit,
    },
  };
}

export const mockTeamRepository: TeamRepository = {
  async list(filters?: TeamFilters): Promise<ApiListResponse<Team>> {
    const search = filters?.search?.trim().toLowerCase();
    const filtered = search
      ? mockTeams.filter((team) => team.name.toLowerCase().includes(search))
      : [...mockTeams];

    return paginate(filtered, filters?.offset, filters?.limit);
  },

  async getById(id: string): Promise<ApiItemResponse<Team>> {
    const team = mockTeams.find((item) => item.id === id);

    if (!team) {
      throw new Error('Time não encontrado');
    }

    return { data: team };
  },

  async create(input: CreateTeamInput): Promise<ApiItemResponse<Team>> {
    const team: Team = {
      id: createId('team'),
      name: input.name,
      colorHex: input.colorHex,
      description: input.description,
    };

    mockTeams.unshift(team);

    return { data: team };
  },

  async update(id: string, input: CreateTeamInput): Promise<ApiItemResponse<Team>> {
    const teamIndex = mockTeams.findIndex((item) => item.id === id);

    if (teamIndex < 0) {
      throw new Error('Time não encontrado');
    }

    const updated: Team = {
      ...mockTeams[teamIndex],
      name: input.name,
      colorHex: input.colorHex,
      description: input.description,
    };

    mockTeams[teamIndex] = updated;

    return { data: updated };
  },

  async remove(id: string): Promise<void> {
    const teamIndex = mockTeams.findIndex((item) => item.id === id);

    if (teamIndex < 0) {
      throw new Error('Time não encontrado');
    }

    mockTeams.splice(teamIndex, 1);

    mockTasks.forEach((task) => {
      task.teamIds = task.teamIds.filter((teamId) => teamId !== id);
    });
  },
};
