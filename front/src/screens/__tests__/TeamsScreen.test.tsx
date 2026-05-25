import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { TeamsScreen } from '../TeamsScreen';

const mockRemoveTeamMutateAsync = jest.fn();

jest.mock('../../hooks/useTeams', () => ({
  useTeams: jest.fn(),
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

const { useTeams } = jest.requireMock('../../hooks/useTeams') as {
  useTeams: jest.Mock;
};

const { useTasks } = jest.requireMock('../../hooks/useTasks') as {
  useTasks: jest.Mock;
};

describe('TeamsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useTeams.mockReturnValue({
      data: {
        data: [
          {
            id: 'team-1',
            name: 'Team A',
            colorHex: '#00B37E',
          },
        ],
      },
      isLoading: false,
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
});
