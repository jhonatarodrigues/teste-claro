import { useInfiniteQuery } from '@tanstack/react-query';

import { repositories } from '../repositories';
import { TeamFilters } from '../repositories/contracts/team-repository';
import { ApiListResponse } from '../types/api';
import { Team } from '../types/team';
import { getNextOffsetFromPages } from './useInfiniteTasks';

type InfiniteTeamFilters = Omit<TeamFilters, 'offset'>;

export function useInfiniteTeams(filters: InfiniteTeamFilters = {}) {
  const limit = filters.limit ?? 20;

  return useInfiniteQuery<ApiListResponse<Team>>({
    queryKey: ['teams', 'infinite', { ...filters, limit }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      repositories.teams.list({
        ...filters,
        limit,
        offset: pageParam as number,
      }),
    getNextPageParam: (_lastPage, allPages) => getNextOffsetFromPages(allPages),
  });
}
