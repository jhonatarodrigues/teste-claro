import { render, waitFor } from '@testing-library/react-native';

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
        status: 'Pendente' | 'Em Progresso' | 'Concluida';
        dueDate: string;
        teamIds: string[];
      }) => void;
      statusOnlyEdit?: boolean;
    }
  | undefined;

jest.mock('../../hooks/useTask', () => ({
  useTask: jest.fn(),
}));

jest.mock('../../hooks/useTeams', () => ({
  useTeams: jest.fn(),
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

const { useTeams } = jest.requireMock('../../hooks/useTeams') as {
  useTeams: jest.Mock;
};

describe('TaskFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTaskFormProps = undefined;
    mockDeleteTaskPending = false;

    useTeams.mockReturnValue({
      data: {
        data: [{ id: 'team-1', name: 'Team A', colorHex: '#00B37E' }],
      },
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

  it('allows only status updates in edit mode', async () => {
    const navigation = {
      goBack: jest.fn(),
    };

    render(
      <TaskFormScreen
        navigation={navigation as never}
        route={{ key: 'TaskForm', name: 'TaskForm', params: { taskId: 'task-1' } } as never}
      />,
    );

    expect(mockTaskFormProps?.statusOnlyEdit).toBe(true);
    expect(mockTaskFormProps?.submitLabel).toBe('Salvar');

    await mockTaskFormProps?.onSubmit({
      title: 'Updated title',
      description: 'Updated description',
      status: 'Concluida',
      dueDate: '',
      teamIds: ['team-2'],
    });

    await waitFor(() => {
      expect(mockUpdateTaskMutateAsync).toHaveBeenCalledWith({
        id: 'task-1',
        input: {
          status: 'Concluida',
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
});
