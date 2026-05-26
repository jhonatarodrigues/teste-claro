import { render } from '@testing-library/react-native';

import { TaskCard } from '../TaskCard';

describe('TaskCard', () => {
  it('renders the task title, status, and team chips', () => {
    const { getByText, getAllByText } = render(
      <TaskCard
        task={{
          id: 'task-1',
          title: 'Task title',
          description: 'Task description',
          status: 'Concluída',
          dueDate: '2026-05-26T00:00:00.000Z',
          teamIds: ['team-1'],
        }}
        teams={[
          {
            id: 'team-1',
            name: 'Team A',
            colorHex: '#8BFF3D',
          },
        ]}
        onPress={() => undefined}
      />,
    );

    expect(getByText('Task title')).toBeTruthy();
    expect(getByText('Task description')).toBeTruthy();
    expect(getByText('Vencimento: 26/05/2026')).toBeTruthy();
    expect(getByText('concluída')).toBeTruthy();
    expect(getAllByText('Team A').length).toBeGreaterThan(0);
  });
});
