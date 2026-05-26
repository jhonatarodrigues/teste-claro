import { z } from 'zod';

const dbVarcharMax = 191;
const colorHex = z
  .string()
  .max(dbVarcharMax)
  .regex(/^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/i, 'colorHex must be a valid HEX color');
const teamIdSchema = z.string().trim().min(1).max(dbVarcharMax);
const teamDescriptionSchema = z.string().trim().max(dbVarcharMax);

export const listTeamsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  search: z.string().trim().max(dbVarcharMax).optional(),
});

export const teamParamsSchema = z.object({
  id: teamIdSchema,
});

export const createTeamBodySchema = z.object({
  name: z.string().trim().min(3).max(dbVarcharMax),
  colorHex,
  description: teamDescriptionSchema.optional(),
});

export const updateTeamBodySchema = createTeamBodySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided',
);

export type ListTeamsQuery = z.infer<typeof listTeamsQuerySchema>;
export type CreateTeamBody = z.infer<typeof createTeamBodySchema>;
export type UpdateTeamBody = z.infer<typeof updateTeamBodySchema>;
