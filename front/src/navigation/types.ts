import { TaskStatus } from '../types/task';

export type RootStackParamList = {
  Teams: undefined;
  Tasks: { teamId?: string; teamName?: string } | undefined;
  TaskDetails: { taskId: string };
  TaskForm: { taskId?: string; teamId?: string } | undefined;
  TeamForm: { teamId?: string } | undefined;
};

export type TaskFormValues = {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  teamIds: string[];
};
