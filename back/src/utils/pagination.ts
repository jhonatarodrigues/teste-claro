export function normalizePagination(input: { limit?: number; offset?: number }) {
  const limit = Number.isFinite(input.limit) ? Math.min(Math.max(input.limit ?? 20, 1), 100) : 20;
  const offset = Number.isFinite(input.offset) ? Math.max(input.offset ?? 0, 0) : 0;

  return { limit, offset };
}
