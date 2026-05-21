import { useQuery } from '@tanstack/react-query';

import { repositories } from '../repositories';

export function useTask(taskId?: string) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => repositories.tasks.getById(taskId ?? ''),
    enabled: Boolean(taskId),
  });
}
