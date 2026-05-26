import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { TaskForm } from '../TaskForm';
import { taskFormSchema } from '../TaskForm';

describe('taskFormSchema', () => {
  it('fails when the title contains only spaces', () => {
    const result = taskFormSchema.safeParse({
      title: '   ',
      description: '',
      status: 'Pendente',
      dueDate: '',
      teamIds: [],
    });

    expect(result.success).toBe(false);
  });

  it('fails when the title has fewer than 3 characters', () => {
    const result = taskFormSchema.safeParse({
      title: 'Hi',
      description: '',
      status: 'Pendente',
      dueDate: '',
      teamIds: [],
    });

    expect(result.success).toBe(false);
  });

  it('accepts the minimum valid payload', () => {
    const result = taskFormSchema.safeParse({
      title: 'New task',
      description: '',
      status: 'Pendente',
      dueDate: '',
      teamIds: [],
    });

    expect(result.success).toBe(true);
  });

  it('accepts due dates in AAAA-MM-DD format', () => {
    const result = taskFormSchema.safeParse({
      title: 'New task',
      description: '',
      status: 'Pendente',
      dueDate: '2026-05-26',
      teamIds: [],
    });

    expect(result.success).toBe(true);
  });
});

describe('TaskForm', () => {
  it('hydrates async default values in edit mode and allows submit', async () => {
    const onSubmit = jest.fn();
    const teams = [{ id: 'team-1', name: 'Team A', colorHex: '#00B37E' }];

    const { getByDisplayValue, getByText, rerender } = render(<TaskForm teams={teams} submitLabel="Save" onSubmit={onSubmit} />);

    rerender(
      <TaskForm
        teams={teams}
        submitLabel="Save"
        onSubmit={onSubmit}
        defaultValues={{
          title: 'Original title',
          description: 'Original description',
          status: 'Pendente',
          dueDate: '2026-05-26',
          teamIds: ['team-1'],
        }}
      />,
    );

    expect(getByDisplayValue('Original title')).toBeTruthy();
    expect(getByDisplayValue('Original description')).toBeTruthy();
    expect(getByText('Team A')).toBeTruthy();

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.mock.calls[0]?.[0]).toEqual({
        title: 'Original title',
        description: 'Original description',
        status: 'Pendente',
        dueDate: '2026-05-26',
        teamIds: ['team-1'],
      });
    });
  });

  it('renders the due date field', () => {
    const { getByText } = render(
      <TaskForm teams={[]} submitLabel="Create" onSubmit={jest.fn()} />,
    );

    expect(getByText('Selecionar data de vencimento')).toBeTruthy();
  });
});
