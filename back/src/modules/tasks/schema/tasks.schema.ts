import { z } from 'zod';

const taskStatusSchema = z.enum(['Pendente', 'Em Progresso', 'Concluída']);
const dbVarcharMax = 191;
const taskIdSchema = z.string().trim().min(1).max(dbVarcharMax);
const taskDescriptionSchema = z.string().trim().max(dbVarcharMax);
const taskTeamIdSchema = z.string().trim().max(dbVarcharMax);

export const listTasksQuerySchema = z.object({
  teamId: taskIdSchema.optional(),
  status: taskStatusSchema.optional(),
  search: z.string().trim().max(dbVarcharMax).optional(),
  sort: z.enum(['title', 'dueDate', 'status']).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const taskParamsSchema = z.object({
  id: taskIdSchema,
});

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(3).max(dbVarcharMax),
  description: taskDescriptionSchema.optional(),
  status: taskStatusSchema.optional(),
  dueDate: z.string().datetime().optional(),
  teamIds: z.array(taskTeamIdSchema).optional(),
});

export const updateTaskBodySchema = createTaskBodySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided',
);

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type TaskApiStatus = z.infer<typeof taskStatusSchema>;
