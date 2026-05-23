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
