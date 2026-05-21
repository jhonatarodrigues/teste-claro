import { taskFormSchema } from '../TaskForm';

describe('taskFormSchema', () => {
  it('falha quando o título tem menos de 3 caracteres', () => {
    const result = taskFormSchema.safeParse({
      title: 'Oi',
      description: '',
      status: 'Pendente',
      dueDate: '',
      teamIds: [],
    });

    expect(result.success).toBe(false);
  });

  it('aceita o payload mínimo válido', () => {
    const result = taskFormSchema.safeParse({
      title: 'Nova tarefa',
      description: '',
      status: 'Pendente',
      dueDate: '',
      teamIds: [],
    });

    expect(result.success).toBe(true);
  });
});
