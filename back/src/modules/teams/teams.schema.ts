import { z } from 'zod';

const colorHex = z.string().regex(/^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/i, 'colorHex must be a valid HEX color');

export const listTeamsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  search: z.string().trim().optional(),
});

export const teamParamsSchema = z.object({
  id: z.string().min(1),
});

export const createTeamBodySchema = z.object({
  name: z.string().trim().min(3),
  colorHex,
  description: z.string().trim().optional(),
});

export const updateTeamBodySchema = createTeamBodySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided',
);

export type ListTeamsQuery = z.infer<typeof listTeamsQuerySchema>;
export type CreateTeamBody = z.infer<typeof createTeamBodySchema>;
export type UpdateTeamBody = z.infer<typeof updateTeamBodySchema>;
