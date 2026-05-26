import {
  formatDueDateInput,
  formatDueDateLabel,
  isAcceptedDueDateInput,
  normalizeDueDateInput,
} from '../due-date';

describe('due-date utils', () => {
  it('accepts empty due dates, ISO datetimes, and date-only values', () => {
    expect(isAcceptedDueDateInput('')).toBe(true);
    expect(isAcceptedDueDateInput('2026-05-26')).toBe(true);
    expect(isAcceptedDueDateInput('2026-05-26T00:00:00.000Z')).toBe(true);
    expect(isAcceptedDueDateInput('not-a-date')).toBe(false);
  });

  it('normalizes date-only values to ISO datetimes', () => {
    expect(normalizeDueDateInput('2026-05-26')).toBe('2026-05-26T00:00:00.000Z');
  });

  it('formats ISO values back to the form input format', () => {
    expect(formatDueDateInput('2026-05-26T00:00:00.000Z')).toBe('2026-05-26');
  });

  it('formats labels for pt-BR display', () => {
    expect(formatDueDateLabel('2026-05-26T00:00:00.000Z')).toBe('26/05/2026');
  });
});
