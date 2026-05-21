import { render } from '@testing-library/react-native';

import { TaskCard } from '../TaskCard';

describe('TaskCard', () => {
  it('mostra título, status e chips de time', () => {
    const { getByText, getAllByText } = render(
      <TaskCard
        task={{
          id: 'task-1',
          title: 'Título da tarefa',
          description: 'Descrição da tarefa',
          status: 'Concluida',
          teamIds: ['team-1'],
        }}
        teams={[
          {
            id: 'team-1',
            name: 'Time A',
            colorHex: '#8BFF3D',
          },
        ]}
        onPress={() => undefined}
      />,
    );

    expect(getByText('Título da tarefa')).toBeTruthy();
    expect(getByText('Descrição da tarefa')).toBeTruthy();
    expect(getByText('concluida')).toBeTruthy();
    expect(getAllByText('Time A').length).toBeGreaterThan(0);
  });
});
