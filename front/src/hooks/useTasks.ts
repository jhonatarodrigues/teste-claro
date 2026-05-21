import { useQuery } from '@tanstack/react-query';

import { repositories } from '../repositories';
import { TaskFilters } from '../types/task';

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => repositories.tasks.list(filters),
  });
}
