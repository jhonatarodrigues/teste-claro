import { httpTaskRepository } from './http/http-task-repository';
import { httpTeamRepository } from './http/http-team-repository';

export const repositories = {
  teams: httpTeamRepository,
  tasks: httpTaskRepository,
};
