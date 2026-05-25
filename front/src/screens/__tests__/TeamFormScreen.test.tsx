import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { TeamFormScreen } from '../TeamFormScreen';

const createTeamMutateAsync = jest.fn();
const updateTeamMutateAsync = jest.fn();
const removeTeamMutateAsync = jest.fn();

jest.mock('../../hooks/useTeam', () => ({
  useTeam: jest.fn(),
}));

jest.mock('../../hooks/useTeamMutations', () => ({
  useTeamMutations: () => ({
    createTeam: {
      mutateAsync: createTeamMutateAsync,
      isPending: false,
    },
    updateTeam: {
      mutateAsync: updateTeamMutateAsync,
      isPending: false,
    },
    removeTeam: {
      mutateAsync: removeTeamMutateAsync,
      isPending: false,
    },
  }),
}));

jest.mock('../../components/ui/ColorPickerField', () => ({
  ColorPickerField: ({ value }: { value: string }) => value,
}));

const { useTeam } = jest.requireMock('../../hooks/useTeam') as {
  useTeam: jest.Mock;
};

describe('TeamFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTeam.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  it('renders edit labels and submits updated values in edit mode', async () => {
    useTeam.mockReturnValue({
      data: {
        data: {
          id: 'team-1',
          name: 'Existing Team',
          colorHex: '#00B37E',
        },
      },
      isLoading: false,
    });

    const navigation = {
      goBack: jest.fn(),
    };

    const { getByDisplayValue, getByText } = render(
      <TeamFormScreen
        navigation={navigation as any}
        route={{ key: 'TeamForm', name: 'TeamForm', params: { teamId: 'team-1' } } as any}
      />,
    );

    await waitFor(() => {
      expect(getByText('Editar Time')).toBeTruthy();
      expect(getByText('Salvar')).toBeTruthy();
      expect(getByText('Excluir time')).toBeTruthy();
      expect(getByDisplayValue('Existing Team')).toBeTruthy();
    });

    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(updateTeamMutateAsync).toHaveBeenCalledWith({
        id: 'team-1',
        input: {
          name: 'Existing Team',
          colorHex: '#00B37E',
        },
      });
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });

  it('confirms and removes the team in edit mode', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    useTeam.mockReturnValue({
      data: {
        data: {
          id: 'team-1',
          name: 'Existing Team',
          colorHex: '#00B37E',
        },
      },
      isLoading: false,
    });

    const navigation = {
      goBack: jest.fn(),
    };

    const { getByText } = render(
      <TeamFormScreen
        navigation={navigation as any}
        route={{ key: 'TeamForm', name: 'TeamForm', params: { teamId: 'team-1' } } as any}
      />,
    );

    await waitFor(() => {
      expect(getByText('Excluir time')).toBeTruthy();
    });

    fireEvent.press(getByText('Excluir time'));

    expect(alertSpy).toHaveBeenCalled();

    const [, , actions] = alertSpy.mock.calls[0] ?? [];
    const confirmAction = actions?.find((action: { style?: string }) => action.style === 'destructive');

    await confirmAction?.onPress?.();

    await waitFor(() => {
      expect(removeTeamMutateAsync).toHaveBeenCalledWith('team-1');
      expect(navigation.goBack).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });
});
