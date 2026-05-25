import { Team } from '@prisma/client';

export function toTeamResponse(team: Team) {
  return {
    id: team.id,
    name: team.name,
    colorHex: team.colorHex,
    description: team.description,
  };
}
