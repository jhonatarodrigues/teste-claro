import { describe, expect, it } from 'vitest';

import { createTaskBodySchema } from './tasks.schema';

describe('createTaskBodySchema', () => {
  it('rejects task fields above the database varchar limit', () => {
    const result = createTaskBodySchema.safeParse({
      title: 'T'.repeat(192),
      description: 'D'.repeat(192),
      teamIds: ['team-1'],
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors).toMatchObject({
      title: expect.arrayContaining(['Too big: expected string to have <=191 characters']),
      description: expect.arrayContaining(['Too big: expected string to have <=191 characters']),
    });
  });
});
