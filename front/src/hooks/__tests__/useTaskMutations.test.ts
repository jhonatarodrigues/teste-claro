import { renderHook } from '@testing-library/react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useTaskMutations } from '../useTaskMutations';

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock('../../repositories', () => ({
  repositories: {
    tasks: {
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      updateStatus: jest.fn(),
    },
  },
}));

describe('useTaskMutations', () => {
  it('invalidates task detail queries after a successful mutation', async () => {
    const invalidateQueries = jest.fn().mockResolvedValue(undefined);
    const refetchQueries = jest.fn().mockResolvedValue(undefined);
    const mockedUseMutation = useMutation as jest.Mock;

    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries,
      refetchQueries,
    });

    mockedUseMutation.mockImplementation((options: { onSuccess?: () => Promise<void> }) => ({
      mutateAsync: jest.fn(),
      isPending: false,
      triggerSuccess: options.onSuccess,
    }));

    const { result } = renderHook(() => useTaskMutations());

    await (result.current.updateTask as unknown as { triggerSuccess: () => Promise<void> }).triggerSuccess();

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['teams'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['task'] });
    expect(refetchQueries).toHaveBeenCalledWith({ queryKey: ['tasks'], type: 'all' });
    expect(refetchQueries).toHaveBeenCalledWith({ queryKey: ['teams'], type: 'all' });
    expect(refetchQueries).toHaveBeenCalledWith({ queryKey: ['task'], type: 'all' });
  });
});
