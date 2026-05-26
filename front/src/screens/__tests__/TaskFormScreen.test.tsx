import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { TaskFormScreen } from '../TaskFormScreen';

const mockUpdateTaskMutateAsync = jest.fn();
const mockDeleteTaskMutateAsync = jest.fn();
let mockDeleteTaskPending = false;
let mockTaskFormProps:
  | {
      submitLabel: string;
      onSubmit: (values: {
        title: string;
        description: string;
        status: 'Pendente' | 'Em Progresso' | 'Concluída';
        dueDate: string;
        teamIds: string[];
      }) => void;
    }
  | undefined;

jest.mock('../../hooks/useTask', () => ({
  useTask: jest.fn(),
}));

jest.mock('../../hooks/useAllTeams', () => ({
  useAllTeams: jest.fn(),
}));

jest.mock('../../hooks/useTaskMutations', () => ({
  useTaskMutations: () => ({
    createTask: {
      mutateAsync: jest.fn(),
      isPending: false,
    },
    updateTask: {
      mutateAsync: mockUpdateTaskMutateAsync,
      isPending: false,
    },
    deleteTask: {
      mutateAsync: mockDeleteTaskMutateAsync,
      isPending: mockDeleteTaskPending,
    },
  }),
}));

jest.mock('../../components/tasks/TaskForm', () => ({
  TaskForm: (props: typeof mockTaskFormProps) => {
    mockTaskFormProps = props;
    return null;
  },
}));

const { useTask } = jest.requireMock('../../hooks/useTask') as {
  useTask: jest.Mock;
};

const { useAllTeams } = jest.requireMock('../../hooks/useAllTeams') as {
  useAllTeams: jest.Mock;
};

describe('TaskFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTaskFormProps = undefined;
    mockDeleteTaskPending = false;

    useAllTeams.mockReturnValue({
      data: [{ id: 'team-1', name: 'Team A', colorHex: '#00B37E' }],
    });

    useTask.mockReturnValue({
      data: {
        data: {
          id: 'task-1',
          title: 'Original title',
          description: 'Original description',
          status: 'Pendente',
          dueDate: undefined,
          teamIds: ['team-1'],
        },
      },
      isLoading: false,
    });
  });

  it('submits full task updates in edit mode', async () => {
    const navigation = {
      goBack: jest.fn(),
    };

    render(
      <TaskFormScreen
        navigation={navigation as never}
        route={{ key: 'TaskForm', name: 'TaskForm', params: { taskId: 'task-1' } } as never}
      />,
    );

    expect(mockTaskFormProps?.submitLabel).toBe('Salvar');

    await mockTaskFormProps?.onSubmit({
      title: 'Updated title',
      description: 'Updated description',
      status: 'Concluída',
      dueDate: '2026-05-26',
      teamIds: ['team-2'],
    });

    await waitFor(() => {
      expect(mockUpdateTaskMutateAsync).toHaveBeenCalledWith({
        id: 'task-1',
        input: {
          title: 'Updated title',
          description: 'Updated description',
          status: 'Concluída',
          dueDate: '2026-05-26T00:00:00.000Z',
          teamIds: ['team-2'],
        },
      });
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });

  it('shows a loading state while deleting a task', () => {
    mockDeleteTaskPending = true;

    const navigation = {
      goBack: jest.fn(),
      popToTop: jest.fn(),
    };

    const { getByTestId } = render(
      <TaskFormScreen
        navigation={navigation as never}
        route={{ key: 'TaskForm', name: 'TaskForm', params: { taskId: 'task-1' } } as never}
      />,
    );

    expect(getByTestId('task-delete-loading')).toBeTruthy();
  });

  it('confirms before deleting and returns to the task list afterwards', async () => {
    mockDeleteTaskMutateAsync.mockResolvedValueOnce(undefined);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    const navigation = {
      goBack: jest.fn(),
      popToTop: jest.fn(),
    };

    const { getByTestId } = render(
      <TaskFormScreen
        navigation={navigation as never}
        route={{ key: 'TaskForm', name: 'TaskForm', params: { taskId: 'task-1' } } as never}
      />,
    );

    fireEvent.press(getByTestId('task-delete-action'));

    expect(alertSpy).toHaveBeenCalled();

    const [, , actions] = alertSpy.mock.calls[0] ?? [];
    const confirmAction = actions?.find((action: { style?: string }) => action.style === 'destructive');

    await confirmAction?.onPress?.();

    await waitFor(() => {
      expect(mockDeleteTaskMutateAsync).toHaveBeenCalledWith('task-1');
      expect(navigation.goBack).toHaveBeenCalled();
      expect(navigation.popToTop).not.toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });
});
