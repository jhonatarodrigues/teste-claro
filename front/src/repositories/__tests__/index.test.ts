describe('repositories index', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.resetModules();
  });

  it('uses mock repositories during tests', () => {
    process.env.NODE_ENV = 'test';

    const { repositories } = require('../index');
    const { mockTeamRepository } = require('../mocks/mock-team-repository');
    const { mockTaskRepository } = require('../mocks/mock-task-repository');

    expect(repositories.teams).toBe(mockTeamRepository);
    expect(repositories.tasks).toBe(mockTaskRepository);
  });

  it('uses HTTP repositories during app runtime', () => {
    process.env.NODE_ENV = 'development';

    const { repositories } = require('../index');
    const { httpTeamRepository } = require('../http/http-team-repository');
    const { httpTaskRepository } = require('../http/http-task-repository');

    expect(repositories.teams).toBe(httpTeamRepository);
    expect(repositories.tasks).toBe(httpTaskRepository);
  });
});
