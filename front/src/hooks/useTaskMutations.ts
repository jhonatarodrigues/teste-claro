import { useMutation, useQueryClient } from '@tanstack/react-query';

import { repositories } from '../repositories';
import { CreateTaskInput, UpdateTaskInput } from '../repositories/contracts/task-repository';
import { TaskStatus } from '../types/task';

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['tasks'] }),
      queryClient.invalidateQueries({ queryKey: ['teams'] }),
      queryClient.invalidateQueries({ queryKey: ['task'] }),
      queryClient.refetchQueries({ queryKey: ['tasks'], type: 'all' }),
      queryClient.refetchQueries({ queryKey: ['teams'], type: 'all' }),
      queryClient.refetchQueries({ queryKey: ['task'], type: 'all' }),
    ]);
  };

  const createTask = useMutation({
    mutationFn: (input: CreateTaskInput) => repositories.tasks.create(input),
    onSuccess: invalidate,
  });

  const updateTask = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      repositories.tasks.update(id, input),
    onSuccess: invalidate,
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => repositories.tasks.remove(id),
    onSuccess: invalidate,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      repositories.tasks.updateStatus(id, status),
    onSuccess: invalidate,
  });

  return {
    createTask,
    updateTask,
    deleteTask,
    updateStatus,
  };
}
