import { describe, expect, it } from 'vitest';

import { buildTaskOrderBy } from './prisma-filters';

describe('buildTaskOrderBy', () => {
  it('adds stable tie-breakers to the default status ordering', () => {
    expect(buildTaskOrderBy()).toEqual([{ status: 'asc' }, { createdAt: 'desc' }, { id: 'desc' }]);
  });

  it('adds stable tie-breakers to the title ordering', () => {
    expect(buildTaskOrderBy('title')).toEqual([{ title: 'asc' }, { createdAt: 'desc' }, { id: 'desc' }]);
  });

  it('adds stable tie-breakers to the due date ordering', () => {
    expect(buildTaskOrderBy('dueDate')).toEqual([
      { dueDate: 'asc' },
      { createdAt: 'desc' },
      { id: 'desc' },
    ]);
  });
});
