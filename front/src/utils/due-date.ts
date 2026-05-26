const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function dateToDateOnlyInput(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseDueDateInput(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (dateOnlyPattern.test(trimmed)) {
    const [year, month, day] = trimmed.split('-').map(Number);
    return new Date(year, (month ?? 1) - 1, day ?? 1);
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

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
