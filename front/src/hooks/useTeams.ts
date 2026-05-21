import { useQuery } from '@tanstack/react-query';

import { repositories } from '../repositories';
import { TeamFilters } from '../repositories/contracts/team-repository';

export function useTeams(filters?: TeamFilters) {
  return useQuery({
    queryKey: ['teams', filters],
    queryFn: () => repositories.teams.list(filters),
  });
}
