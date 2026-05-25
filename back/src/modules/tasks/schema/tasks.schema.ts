import { z } from 'zod';

const taskStatusSchema = z.enum(['Pendente', 'Em Progresso', 'Concluida']);

export const listTasksQuerySchema = z.object({
  teamId: z.string().optional(),
  status: taskStatusSchema.optional(),
  search: z.string().trim().optional(),
  sort: z.enum(['title', 'dueDate', 'status']).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const taskParamsSchema = z.object({
  id: z.string().min(1),
});

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().optional(),
  status: taskStatusSchema.optional(),
  dueDate: z.string().datetime().optional(),
  teamIds: z.array(z.string()).optional(),
});

export const updateTaskBodySchema = createTaskBodySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided',
);

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type TaskApiStatus = z.infer<typeof taskStatusSchema>;
