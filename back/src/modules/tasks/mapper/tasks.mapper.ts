import { Task, TaskStatus } from '@prisma/client';

type TaskWithLinks = Task & {
  teamLinks: Array<{
    teamId: string;
  }>;
};

export function prismaStatusToApi(status: TaskStatus) {
  if (status === TaskStatus.Em_Progresso) {
    return 'Em Progresso';
  }

  return status;
}

export function toTaskResponse(task: TaskWithLinks) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: prismaStatusToApi(task.status),
    dueDate: task.dueDate?.toISOString() ?? null,
    teamIds: task.teamLinks.map((link) => link.teamId),
  };
}
