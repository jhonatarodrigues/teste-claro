import { mockTaskRepository } from './mocks/mock-task-repository';
import { mockTeamRepository } from './mocks/mock-team-repository';

export const repositories = {
  teams: mockTeamRepository,
  tasks: mockTaskRepository,
};
