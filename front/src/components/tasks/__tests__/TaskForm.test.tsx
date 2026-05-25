import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { TaskForm } from '../TaskForm';
import { taskFormSchema } from '../TaskForm';

describe('taskFormSchema', () => {
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
});

describe('TaskForm', () => {
  it('hydrates async default values in status-only edit mode and allows submit', async () => {
    const onSubmit = jest.fn();
    const teams = [{ id: 'team-1', name: 'Team A', colorHex: '#00B37E' }];

    const { getByDisplayValue, getByText, rerender } = render(
      <TaskForm teams={teams} submitLabel="Save" onSubmit={onSubmit} statusOnlyEdit />,
    );

    rerender(
      <TaskForm
        teams={teams}
        submitLabel="Save"
        onSubmit={onSubmit}
        statusOnlyEdit
        defaultValues={{
          title: 'Original title',
          description: 'Original description',
          status: 'Pendente',
          dueDate: '',
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
        dueDate: '',
        teamIds: ['team-1'],
      });
    });
  });
});
