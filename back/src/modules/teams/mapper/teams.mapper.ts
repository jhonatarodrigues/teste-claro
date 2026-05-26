import { Team } from '@prisma/client';

type TeamWithTaskCount = Team & {
  _count?: {
    taskLinks?: number;
  };
};

export function toTeamResponse(team: TeamWithTaskCount) {
  return {
    id: team.id,
    name: team.name,
    colorHex: team.colorHex,
    description: team.description,
    taskCount: team._count?.taskLinks,
  };
}
