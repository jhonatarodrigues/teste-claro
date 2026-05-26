const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function isAcceptedDueDateInput(value?: string) {
  if (value === undefined) {
    return true;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return true;
  }

  if (dateOnlyPattern.test(trimmed)) {
    return !Number.isNaN(Date.parse(`${trimmed}T00:00:00.000Z`));
  }

  return !Number.isNaN(Date.parse(trimmed)) && trimmed.includes('T');
}

export function normalizeDueDateInput(value?: string) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (dateOnlyPattern.test(trimmed)) {
    return `${trimmed}T00:00:00.000Z`;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? trimmed : parsed.toISOString();
}

export function formatDueDateInput(value?: string) {
  if (!value) {
    return '';
  }

  const trimmed = value.trim();

  if (dateOnlyPattern.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  return parsed.toISOString().slice(0, 10);
}

export function formatDueDateLabel(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(parsed);
}
