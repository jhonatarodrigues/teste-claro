import { ApiItemResponse, ApiListResponse } from '../../types/api';
import { Team } from '../../types/team';

export type TeamFilters = {
  search?: string;
  offset?: number;
  limit?: number;
};

export type CreateTeamInput = {
  name: string;
  colorHex: string;
  description?: string;
};

export interface TeamRepository {
  list(filters?: TeamFilters): Promise<ApiListResponse<Team>>;
  getById(id: string): Promise<ApiItemResponse<Team>>;
  create(input: CreateTeamInput): Promise<ApiItemResponse<Team>>;
  update(id: string, input: CreateTeamInput): Promise<ApiItemResponse<Team>>;
  remove(id: string): Promise<void>;
}
