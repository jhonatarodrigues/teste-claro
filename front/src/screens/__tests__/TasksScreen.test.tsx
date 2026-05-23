import { render } from '@testing-library/react-native';

import { TasksScreen } from '../TasksScreen';

jest.mock('../../hooks/useTaskFilters', () => ({
  useTaskFilters: () => ({
    filters: { teamId: undefined, status: undefined, search: '', limit: 20, offset: 0, sort: 'status' },
    teamId: undefined,
    status: undefined,
    search: '',
    setTeamId: jest.fn(),
    setStatus: jest.fn(),
    setSearch: jest.fn(),
    reset: jest.fn(),
  }),
}));

jest.mock('../../hooks/useTasks', () => ({
  useTasks: () => ({
    data: {
      data: [
        {
          id: 'task-1',
          title: 'Task title',
          description: 'Long description',
          status: 'Pendente',
          teamIds: ['team-1'],
        },
      ],
      meta: { total: 1, limit: 20, offset: 0 },
    },
  }),
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
  it('renders mocked tasks on the main screen', () => {
    const { getByText, getAllByText } = render(
      <TasksScreen
        navigation={{
          goBack: jest.fn(),
          navigate: jest.fn(),
        } as any}
        route={{ key: 'Tasks', name: 'Tasks', params: undefined } as any}
      />,
    );

    expect(getByText('Tarefas')).toBeTruthy();
    expect(getByText('Task title')).toBeTruthy();
    expect(getAllByText('Team A').length).toBeGreaterThan(0);
    expect(getByText('Nova Tarefa')).toBeTruthy();
  });
});
