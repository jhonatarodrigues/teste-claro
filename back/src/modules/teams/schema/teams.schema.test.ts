import { describe, expect, it } from 'vitest';

import { createTeamBodySchema } from './teams.schema';

describe('createTeamBodySchema', () => {
  it('rejects team fields above the database varchar limit', () => {
    const result = createTeamBodySchema.safeParse({
      name: 'N'.repeat(192),
      colorHex: '#8BFF3D',
      description: 'D'.repeat(192),
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors).toMatchObject({
      name: expect.arrayContaining(['Too big: expected string to have <=191 characters']),
      description: expect.arrayContaining(['Too big: expected string to have <=191 characters']),
    });
  });
});
