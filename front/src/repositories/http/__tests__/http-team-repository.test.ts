import { createHttpClient } from '../http-client';
import { createHttpTeamRepository } from '../http-team-repository';

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

describe('httpTeamRepository', () => {
  it('serializes list filters into query params and normalizes nullable descriptions', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      createJsonResponse({
        data: [
          {
            id: 'team-1',
            name: 'Team A',
            colorHex: '#8BFF3D',
            description: null,
          },
        ],
        meta: {
          total: 1,
          offset: 2,
          limit: 5,
        },
      }),
    );
    const repository = createHttpTeamRepository(
      createHttpClient({
        baseUrl: 'http://example.com/api',
        fetch: fetchMock,
      }),
    );

    const response = await repository.list({
      search: 'team',
      offset: 2,
      limit: 5,
    });

    expect(fetchMock).toHaveBeenCalledWith('http://example.com/api/teams?search=team&offset=2&limit=5', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    expect(response.data[0]?.description).toBeUndefined();
  });
});
