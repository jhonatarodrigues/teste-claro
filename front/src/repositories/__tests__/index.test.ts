describe('repositories index', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('always uses HTTP repositories', () => {
    const { repositories } = require('../index');
    const { httpTeamRepository } = require('../http/http-team-repository');
    const { httpTaskRepository } = require('../http/http-task-repository');

    expect(repositories.teams).toBe(httpTeamRepository);
    expect(repositories.tasks).toBe(httpTaskRepository);
  });
});
