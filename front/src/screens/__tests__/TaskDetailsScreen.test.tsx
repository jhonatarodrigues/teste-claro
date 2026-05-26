import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { TaskDetailsScreen } from '../TaskDetailsScreen';

const mockDeleteTaskMutateAsync = jest.fn();
const mockUpdateStatusMutateAsync = jest.fn();

jest.mock('../../hooks/useTask', () => ({
  useTask: jest.fn(),
}));

jest.mock('../../hooks/useAllTeams', () => ({
  useAllTeams: jest.fn(),
}));

jest.mock('../../hooks/useTaskMutations', () => ({
  useTaskMutations: () => ({
    deleteTask: {
      mutateAsync: mockDeleteTaskMutateAsync,
      isPending: false,
    },
    updateStatus: {
      mutateAsync: mockUpdateStatusMutateAsync,
      isPending: false,
    },
  }),
}));

const { useTask } = jest.requireMock('../../hooks/useTask') as {
  useTask: jest.Mock;
};

const { useAllTeams } = jest.requireMock('../../hooks/useAllTeams') as {
  useAllTeams: jest.Mock;
};

describe('TaskDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useTask.mockReturnValue({
      data: {
        data: {
          id: 'task-1',
          title: 'Task title',
          description: 'Task description',
          status: 'Pendente',
          dueDate: '2026-05-26T00:00:00.000Z',
          teamIds: ['team-1'],
        },
      },
      isLoading: false,
    });

    useAllTeams.mockReturnValue({
      data: [{ id: 'team-1', name: 'Team A', colorHex: '#00B37E' }],
    });
  });

  it('lets the user edit the task from the details screen', () => {
    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const { getByText } = render(
      <TaskDetailsScreen
        navigation={navigation as any}
        route={{ key: 'TaskDetails', name: 'TaskDetails', params: { taskId: 'task-1' } } as any}
      />,
    );

    fireEvent.press(getByText('Editar tarefa'));

    expect(navigation.navigate).toHaveBeenCalledWith('TaskForm', { taskId: 'task-1' });
  });

  it('marks the task as completed with the quick action', async () => {
    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const { getByText } = render(
      <TaskDetailsScreen
        navigation={navigation as any}
        route={{ key: 'TaskDetails', name: 'TaskDetails', params: { taskId: 'task-1' } } as any}
      />,
    );

    fireEvent.press(getByText('Marcar como concluída'));

    await waitFor(() => {
      expect(mockUpdateStatusMutateAsync).toHaveBeenCalledWith({
        id: 'task-1',
        status: 'Concluída',
      });
    });
  });

  it('confirms before deleting the task', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    mockDeleteTaskMutateAsync.mockResolvedValueOnce(undefined);

    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const { getByTestId } = render(
      <TaskDetailsScreen
        navigation={navigation as any}
        route={{ key: 'TaskDetails', name: 'TaskDetails', params: { taskId: 'task-1' } } as any}
      />,
    );

    fireEvent.press(getByTestId('task-details-delete-action'));

    expect(alertSpy).toHaveBeenCalled();

    const [, , actions] = alertSpy.mock.calls[0] ?? [];
    const confirmAction = actions?.find((action: { style?: string }) => action.style === 'destructive');

    await confirmAction?.onPress?.();

    await waitFor(() => {
      expect(mockDeleteTaskMutateAsync).toHaveBeenCalledWith('task-1');
      expect(navigation.goBack).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });
});
