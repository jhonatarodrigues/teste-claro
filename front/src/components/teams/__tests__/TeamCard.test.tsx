import { fireEvent, render } from '@testing-library/react-native';

import { TeamCard } from '../TeamCard';

describe('TeamCard', () => {
  it('keeps the primary press behavior when the card body is pressed', () => {
    const onPress = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const { getByTestId } = render(
      <TeamCard
        team={{
          id: 'team-1',
          name: 'Team A',
          colorHex: '#00B37E',
        }}
        tasksCount={3}
        onPress={onPress}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.press(getByTestId('team-card-pressable'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onEdit).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('runs edit without triggering the primary press', () => {
    const onPress = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const { getByTestId } = render(
      <TeamCard
        team={{
          id: 'team-1',
          name: 'Team A',
          colorHex: '#00B37E',
        }}
        onPress={onPress}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.press(getByTestId('team-card-edit-action'));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('runs delete without triggering the primary press', () => {
    const onPress = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const { getByTestId } = render(
      <TeamCard
        team={{
          id: 'team-1',
          name: 'Team A',
          colorHex: '#00B37E',
        }}
        onPress={onPress}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.press(getByTestId('team-card-delete-action'));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
    expect(onEdit).not.toHaveBeenCalled();
  });
});
