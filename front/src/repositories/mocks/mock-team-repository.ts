import { ApiItemResponse, ApiListResponse } from '../../types/api';
import { Team } from '../../types/team';
import {
  CreateTeamInput,
  TeamFilters,
  TeamRepository,
} from '../contracts/team-repository';
import { createId, mockTeams } from './mock-db';

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
};
