import { useMutation, useQueryClient } from '@tanstack/react-query';

import { repositories } from '../repositories';
import { CreateTeamInput } from '../repositories/contracts/team-repository';

export function useTeamMutations() {
  const queryClient = useQueryClient();

  const createTeam = useMutation({
    mutationFn: (input: CreateTeamInput) => repositories.teams.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return {
    createTeam,
  };
}
