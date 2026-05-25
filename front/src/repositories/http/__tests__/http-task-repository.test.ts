import { createHttpClient } from '../http-client';
import { createHttpTaskRepository } from '../http-task-repository';

function createJsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: () => 'application/json',
    },
    json: jest.fn().mockResolvedValue(body),
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response;
}

describe('httpTaskRepository', () => {
  it('omits empty due dates when creating tasks', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      createJsonResponse({
        data: {
          id: 'task-1',
          title: 'Nova tarefa',
          description: 'Descricao',
          status: 'Pendente',
          dueDate: null,
          teamIds: ['team-1'],
        },
      }),
    );
    const repository = createHttpTaskRepository(
      createHttpClient({
        baseUrl: 'http://example.com/api',
        fetch: fetchMock,
      }),
    );

    await repository.create({
      title: 'Nova tarefa',
      description: 'Descricao',
      dueDate: '',
      teamIds: ['team-1'],
    });

    expect(fetchMock).toHaveBeenCalledWith('http://example.com/api/tasks', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Nova tarefa',
        description: 'Descricao',
        teamIds: ['team-1'],
      }),
    });
  });

  it('uses the existing PUT endpoint to update task status', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      createJsonResponse({
        data: {
          id: 'task-1',
          title: 'Nova tarefa',
          description: null,
          status: 'Concluida',
          dueDate: null,
          teamIds: [],
        },
      }),
    );
    const repository = createHttpTaskRepository(
      createHttpClient({
        baseUrl: 'http://example.com/api',
        fetch: fetchMock,
      }),
    );

    await repository.updateStatus('task-1', 'Concluida');

    expect(fetchMock).toHaveBeenCalledWith('http://example.com/api/tasks/task-1', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Concluida',
      }),
    });
  });

  it('normalizes nullable task fields from the API response', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      createJsonResponse({
        data: {
          id: 'task-1',
          title: 'Nova tarefa',
          description: null,
          status: 'Pendente',
          dueDate: null,
          teamIds: ['team-1'],
        },
      }),
    );
    const repository = createHttpTaskRepository(
      createHttpClient({
        baseUrl: 'http://example.com/api',
        fetch: fetchMock,
      }),
    );

    const response = await repository.getById('task-1');

    expect(response.data.description).toBeUndefined();
    expect(response.data.dueDate).toBeUndefined();
  });
});
