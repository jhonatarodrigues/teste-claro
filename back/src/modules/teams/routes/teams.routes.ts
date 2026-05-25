import { Router } from 'express';

import { validate } from '../../../middlewares/validate';
import {
  createTeamController,
  deleteTeamController,
  getTeamByIdController,
  listTeamsController,
  updateTeamController,
} from '../controller/teams.controller';
import { createTeamBodySchema, listTeamsQuerySchema, teamParamsSchema, updateTeamBodySchema } from '../schema/teams.schema';

export const teamsRouter = Router();

teamsRouter.get('/', validate({ query: listTeamsQuerySchema }), listTeamsController);
teamsRouter.get('/:id', validate({ params: teamParamsSchema }), getTeamByIdController);
teamsRouter.post('/', validate({ body: createTeamBodySchema }), createTeamController);
teamsRouter.put('/:id', validate({ params: teamParamsSchema, body: updateTeamBodySchema }), updateTeamController);
teamsRouter.delete('/:id', validate({ params: teamParamsSchema }), deleteTeamController);
