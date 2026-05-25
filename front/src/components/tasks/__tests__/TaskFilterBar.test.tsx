import { render } from '@testing-library/react-native';

import { TaskFilterBar } from '../TaskFilterBar';

describe('TaskFilterBar', () => {
  it('renders search and status filters in the same row', () => {
    const { getByTestId } = render(
      <TaskFilterBar
        search=""
        status={undefined}
        teamId={undefined}
        teams={[{ id: 'team-1', name: 'Team A', colorHex: '#00B37E' }]}
        onSearchChange={jest.fn()}
        onStatusChange={jest.fn()}
        onTeamChange={jest.fn()}
      />,
    );

    expect(getByTestId('task-filter-primary-row')).toBeTruthy();
    expect(getByTestId('task-filter-search-wrapper').props.className).toContain('flex-1');
    expect(getByTestId('task-filter-status-wrapper').props.className).toContain('w-[44%]');
  });
});
