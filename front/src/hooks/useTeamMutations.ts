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

  const updateTeam = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateTeamInput }) =>
      repositories.teams.update(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const removeTeam = useMutation({
    mutationFn: (id: string) => repositories.teams.remove(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['teams'] }),
        queryClient.invalidateQueries({ queryKey: ['tasks'] }),
        queryClient.invalidateQueries({ queryKey: ['task'] }),
      ]);
    },
  });

  return {
    createTeam,
    updateTeam,
    removeTeam,
  };
}
