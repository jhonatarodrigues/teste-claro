import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { TeamsScreen } from '../TeamsScreen';

const mockRemoveTeamMutateAsync = jest.fn();
const mockFetchNextTeamsPage = jest.fn();

jest.mock('../../hooks/useInfiniteTeams', () => ({
  useInfiniteTeams: jest.fn(),
}));

jest.mock('../../hooks/useTasks', () => ({
  useTasks: jest.fn(),
}));

jest.mock('../../hooks/useTeamMutations', () => ({
  useTeamMutations: () => ({
    removeTeam: {
      mutateAsync: mockRemoveTeamMutateAsync,
      isPending: false,
    },
  }),
}));

const { useInfiniteTeams } = jest.requireMock('../../hooks/useInfiniteTeams') as {
  useInfiniteTeams: jest.Mock;
};

const { useTasks } = jest.requireMock('../../hooks/useTasks') as {
  useTasks: jest.Mock;
};

describe('TeamsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useInfiniteTeams.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 'team-1',
                name: 'Team A',
                colorHex: '#00B37E',
              },
            ],
            meta: {
              total: 2,
              limit: 10,
              offset: 0,
            },
          },
        ],
      },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: mockFetchNextTeamsPage,
    });

    useTasks.mockReturnValue({
      data: {
        data: [
          {
            id: 'task-1',
            title: 'Task title',
            description: 'Task description',
            status: 'Pendente',
            teamIds: ['team-1'],
          },
        ],
      },
      isLoading: false,
    });
  });

  it('navigates to filtered tasks when the card body is pressed', () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const { getByTestId } = render(
      <TeamsScreen navigation={navigation as any} route={{ key: 'Teams', name: 'Teams' } as any} />,
    );

    fireEvent.press(getByTestId('team-card-pressable'));

    expect(navigation.navigate).toHaveBeenCalledWith('Tasks', {
      teamId: 'team-1',
      teamName: 'Team A',
    });
  });

  it('allows opening the global task list directly from the teams screen', () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const { getByText } = render(
      <TeamsScreen navigation={navigation as any} route={{ key: 'Teams', name: 'Teams' } as any} />,
    );

    fireEvent.press(getByText('Ver todas as tarefas'));

    expect(navigation.navigate).toHaveBeenCalledWith('Tasks');
  });

  it('navigates to team form in edit mode from the secondary action', () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const { getByTestId } = render(
      <TeamsScreen navigation={navigation as any} route={{ key: 'Teams', name: 'Teams' } as any} />,
    );

    fireEvent.press(getByTestId('team-card-edit-action'));

    expect(navigation.navigate).toHaveBeenCalledWith('TeamForm', {
      teamId: 'team-1',
    });
    expect(navigation.navigate).not.toHaveBeenCalledWith('Tasks', expect.anything());
  });

  it('confirms deletion and removes the team from the secondary action', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const navigation = {
      navigate: jest.fn(),
    };

    const { getByTestId } = render(
      <TeamsScreen navigation={navigation as any} route={{ key: 'Teams', name: 'Teams' } as any} />,
    );

    fireEvent.press(getByTestId('team-card-delete-action'));

    expect(alertSpy).toHaveBeenCalled();
    expect(navigation.navigate).not.toHaveBeenCalledWith('Tasks', expect.anything());

    const [, , actions] = alertSpy.mock.calls[0] ?? [];
    const confirmAction = actions?.find((action: { style?: string }) => action.style === 'destructive');

    await confirmAction?.onPress?.();

    await waitFor(() => {
      expect(mockRemoveTeamMutateAsync).toHaveBeenCalledWith('team-1');
    });

    alertSpy.mockRestore();
  });

  it('requests the next page when the teams list reaches the end', () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const { getByTestId } = render(
      <TeamsScreen navigation={navigation as any} route={{ key: 'Teams', name: 'Teams' } as any} />,
    );

    getByTestId('teams-list').props.onEndReached();

    expect(mockFetchNextTeamsPage).toHaveBeenCalledTimes(1);
  });

  it('keeps spacing between the search field and the first team card', () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const { getByTestId } = render(
      <TeamsScreen navigation={navigation as any} route={{ key: 'Teams', name: 'Teams' } as any} />,
    );

    expect(getByTestId('teams-list-header').props.className).toContain('pb-4');
  });
});
