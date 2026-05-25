import { stripUndefined } from '../../lib/http/strip-undefined';
import { ApiItemResponse, ApiListResponse } from '../../types/api';
import { Team } from '../../types/team';
import {
  CreateTeamInput,
  TeamFilters,
  TeamRepository,
} from '../contracts/team-repository';
import { createHttpClient, HttpClient } from './http-client';

type ApiTeam = Omit<Team, 'description'> & {
  description?: string | null;
};

function normalizeTeam(team: ApiTeam): Team {
  return {
    ...team,
    description: team.description ?? undefined,
  };
}

function normalizeTeamListResponse(response: ApiListResponse<ApiTeam>): ApiListResponse<Team> {
  return {
    ...response,
    data: response.data.map(normalizeTeam),
  };
}

function normalizeTeamItemResponse(response: ApiItemResponse<ApiTeam>): ApiItemResponse<Team> {
  return {
    data: normalizeTeam(response.data),
  };
}

export function createHttpTeamRepository(client: HttpClient = createHttpClient()): TeamRepository {
  return {
    async list(filters?: TeamFilters): Promise<ApiListResponse<Team>> {
      const response = await client.get<ApiListResponse<ApiTeam>>('/teams', filters);
      return normalizeTeamListResponse(response);
    },

    async getById(id: string): Promise<ApiItemResponse<Team>> {
      const response = await client.get<ApiItemResponse<ApiTeam>>(`/teams/${id}`);
      return normalizeTeamItemResponse(response);
    },

    async create(input: CreateTeamInput): Promise<ApiItemResponse<Team>> {
      const response = await client.post<ApiItemResponse<ApiTeam>>('/teams', stripUndefined(input));
      return normalizeTeamItemResponse(response);
    },

    async update(id: string, input: CreateTeamInput): Promise<ApiItemResponse<Team>> {
      const response = await client.put<ApiItemResponse<ApiTeam>>(`/teams/${id}`, stripUndefined(input));
      return normalizeTeamItemResponse(response);
    },

    async remove(id: string): Promise<void> {
      await client.delete(`/teams/${id}`);
    },
  };
}

export const httpTeamRepository = createHttpTeamRepository();
