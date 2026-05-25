import { useQuery } from '@tanstack/react-query';

import { repositories } from '../repositories';

export function useTeam(teamId?: string) {
  return useQuery({
    queryKey: ['teams', teamId],
    queryFn: () => repositories.teams.getById(teamId as string),
    enabled: Boolean(teamId),
  });
}
