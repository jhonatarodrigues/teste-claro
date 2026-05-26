import { DrawerActions } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';

import { TasksScreen } from '../TasksScreen';

const mockFetchNextTasksPage = jest.fn();
let mockInfiniteTasksState: any = {
  data: {
    pages: [
      {
        data: [
          {
            id: 'task-1',
            title: 'Task title',
            description: 'Long description',
            status: 'Pendente',
            teamIds: ['team-1'],
          },
        ],
        meta: { total: 2, limit: 20, offset: 0 },
      },
    ],
  },
  fetchNextPage: mockFetchNextTasksPage,
  hasNextPage: true,
  isFetchingNextPage: false,
  isLoading: false,
};

jest.mock('../../hooks/useTaskFilters', () => ({
  useTaskFilters: () => ({
    filters: { teamId: undefined, status: undefined, search: '', limit: 20, sort: 'status' },
    teamId: undefined,
    status: undefined,
    search: '',
    setTeamId: jest.fn(),
    setStatus: jest.fn(),
    setSearch: jest.fn(),
    reset: jest.fn(),
  }),
}));

jest.mock('../../hooks/useInfiniteTasks', () => ({
  useInfiniteTasks: () => mockInfiniteTasksState,
}));

jest.mock('../../hooks/useTeams', () => ({
  useTeams: () => ({
    data: {
      data: [
        {
          id: 'team-1',
          name: 'Team A',
          colorHex: '#8BFF3D',
        },
      ],
      meta: { total: 1, limit: 20, offset: 0 },
    },
  }),
}));

describe('TasksScreen', () => {
  beforeEach(() => {
    mockFetchNextTasksPage.mockClear();
    mockInfiniteTasksState = {
      data: {
        pages: [
          {
            data: [
              {
                id: 'task-1',
                title: 'Task title',
                description: 'Long description',
                status: 'Pendente',
                teamIds: ['team-1'],
              },
            ],
            meta: { total: 2, limit: 20, offset: 0 },
          },
        ],
      },
      fetchNextPage: mockFetchNextTasksPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
    };
  });

  it('renders mocked tasks on the main screen', () => {
    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const { getByText, getAllByText, getByTestId } = render(
      <TasksScreen
        navigation={navigation as any}
        route={{ key: 'Tasks', name: 'Tasks', params: undefined } as any}
      />,
    );

    expect(getByText('Tarefas')).toBeTruthy();
    expect(getByText('Task title')).toBeTruthy();
    expect(getAllByText('Team A').length).toBeGreaterThan(0);
    expect(getByText('Nova Tarefa')).toBeTruthy();
    expect(getByTestId('tasks-collapsible-header')).toBeTruthy();
    expect(getByTestId('tasks-fixed-carousel')).toBeTruthy();
    expect(getByTestId('tasks-team-carousel-container').props.className).toContain('-mx-5');
    expect(getByTestId('tasks-list').props.stickyHeaderIndices).toEqual([]);
    expect(typeof getByTestId('tasks-list').props.onScroll).toBe('function');

    fireEvent.press(getByText('Task title'));

    expect(navigation.navigate).toHaveBeenCalledWith('TaskDetails', { taskId: 'task-1' });
  });

  it('requests the next page when the list reaches the end', () => {
    const { getByTestId } = render(
      <TasksScreen
        navigation={{
          goBack: jest.fn(),
          navigate: jest.fn(),
        } as any}
        route={{ key: 'Tasks', name: 'Tasks', params: undefined } as any}
      />,
    );

    getByTestId('tasks-list').props.onEndReached();

    expect(mockFetchNextTasksPage).toHaveBeenCalledTimes(1);
  });

  it('shows a loading indicator while the task list is loading', () => {
    mockInfiniteTasksState = {
      data: undefined,
      fetchNextPage: mockFetchNextTasksPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: true,
    };

    const { getByTestId, getByText } = render(
      <TasksScreen
        navigation={{
          goBack: jest.fn(),
          navigate: jest.fn(),
        } as any}
        route={{ key: 'Tasks', name: 'Tasks', params: undefined } as any}
      />,
    );

    expect(getByTestId('tasks-loading-indicator')).toBeTruthy();
    expect(getByText('Carregando tarefas...')).toBeTruthy();
  });

  it('opens the drawer from the menu button', () => {
    const dispatch = jest.fn();

    const { getByTestId } = render(
      <TasksScreen
        navigation={{
          goBack: jest.fn(),
          navigate: jest.fn(),
          getParent: jest.fn(() => ({ dispatch })),
        } as any}
        route={{ key: 'Tasks', name: 'Tasks', params: undefined } as any}
      />,
    );

    fireEvent.press(getByTestId('tasks-drawer-button'));

    expect(dispatch).toHaveBeenCalledWith(DrawerActions.openDrawer());
  });
});
