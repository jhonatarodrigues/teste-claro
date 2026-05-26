import { useQuery } from '@tanstack/react-query';

import { repositories } from '../repositories';
import { Team } from '../types/team';

const TEAM_PAGE_LIMIT = 100;

export function useAllTeams() {
  return useQuery({
    queryKey: ['teams', 'all'],
    queryFn: async () => {
      const teams: Team[] = [];
      let offset = 0;
      let total = 0;

      do {
        const response = await repositories.teams.list({
          limit: TEAM_PAGE_LIMIT,
          offset,
        });

        teams.push(...response.data);
        total = response.meta.total;
        offset += response.data.length;

        if (response.data.length === 0) {
          break;
        }
      } while (offset < total);

      return teams;
    },
  });
}
