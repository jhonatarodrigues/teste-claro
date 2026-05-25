import { httpTaskRepository } from './http/http-task-repository';
import { httpTeamRepository } from './http/http-team-repository';
import { mockTaskRepository } from './mocks/mock-task-repository';
import { mockTeamRepository } from './mocks/mock-team-repository';

const useMockRepositories = process.env.NODE_ENV === 'test';

export const repositories = {
  teams: useMockRepositories ? mockTeamRepository : httpTeamRepository,
  tasks: useMockRepositories ? mockTaskRepository : httpTaskRepository,
};
