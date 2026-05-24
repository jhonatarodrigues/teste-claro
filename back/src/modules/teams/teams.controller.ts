import { Request, Response } from 'express';

import { ok, withMeta } from '../../utils/api-response';
import { createTeam, deleteTeam, getTeamById, listTeams, updateTeam } from './teams.service';
import { CreateTeamBody, ListTeamsQuery, UpdateTeamBody } from './teams.schema';

export async function listTeamsController(request: Request, response: Response) {
  const result = await listTeams((request.validated?.query ?? request.query) as ListTeamsQuery);
  return withMeta(response, result.data, result.meta);
}

export async function getTeamByIdController(request: Request, response: Response) {
  const { id } = (request.validated?.params ?? request.params) as { id: string };
  const team = await getTeamById(id);
  return ok(response, team);
}

export async function createTeamController(request: Request, response: Response) {
  const team = await createTeam((request.validated?.body ?? request.body) as CreateTeamBody);
  return ok(response, team, 201);
}

export async function updateTeamController(request: Request, response: Response) {
  const { id } = (request.validated?.params ?? request.params) as { id: string };
  const team = await updateTeam(id, (request.validated?.body ?? request.body) as UpdateTeamBody);
  return ok(response, team);
}

export async function deleteTeamController(request: Request, response: Response) {
  const { id } = (request.validated?.params ?? request.params) as { id: string };
  await deleteTeam(id);
  return response.status(204).send();
}
