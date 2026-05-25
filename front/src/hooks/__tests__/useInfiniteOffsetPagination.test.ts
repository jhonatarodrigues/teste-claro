import { getNextOffsetFromPages } from '../useInfiniteTasks';

describe('getNextOffsetFromPages', () => {
  it('returns the next offset when there are still items left to fetch', () => {
    expect(
      getNextOffsetFromPages([
        {
          data: [{ id: '1' }, { id: '2' }],
          meta: {
            total: 5,
            offset: 0,
            limit: 2,
          },
        },
      ]),
    ).toBe(2);
  });

  it('returns undefined when all items were already fetched', () => {
    expect(
      getNextOffsetFromPages([
        {
          data: [{ id: '1' }, { id: '2' }],
          meta: {
            total: 2,
            offset: 0,
            limit: 2,
          },
        },
      ]),
    ).toBeUndefined();
  });
});
