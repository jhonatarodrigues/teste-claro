import { useInfiniteQuery } from '@tanstack/react-query';

import { repositories } from '../repositories';
import { ApiListResponse } from '../types/api';
import { Task, TaskFilters } from '../types/task';

type InfiniteTaskFilters = Omit<TaskFilters, 'offset'>;

type InfinitePage<T> = {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
};

export function getNextOffsetFromPages<T>(pages: InfinitePage<T>[]) {
  const lastPage = pages.at(-1);

  if (!lastPage) {
    return undefined;
  }

  const nextOffset = lastPage.meta.offset + lastPage.data.length;
  return nextOffset < lastPage.meta.total ? nextOffset : undefined;
}

export function useInfiniteTasks(filters: InfiniteTaskFilters) {
  const limit = filters.limit ?? 20;

  return useInfiniteQuery<ApiListResponse<Task>>({
    queryKey: ['tasks', 'infinite', { ...filters, limit }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      repositories.tasks.list({
        ...filters,
        limit,
        offset: pageParam as number,
      }),
    getNextPageParam: (_lastPage, allPages) => getNextOffsetFromPages(allPages),
  });
}
