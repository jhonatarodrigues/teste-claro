import { apiBaseUrl } from '../../config/api';
import { ApiErrorResponse } from '../../types/api';

type QueryValue = string | number | boolean | null | undefined;

type QueryParams = Record<string, QueryValue>;

type RequestOptions = {
  query?: QueryParams;
  body?: unknown;
};

type FetchImplementation = typeof fetch;

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams) {
  const normalizedPath = path.replace(/^\/+/, '');
  const url = new URL(normalizedPath, `${baseUrl.replace(/\/+$/, '')}/`);

  if (!query) {
    return url.toString();
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

function createHeaders(hasBody: boolean) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === 'object' && value !== null && 'error' in value;
}

async function readJson<T>(response: Response): Promise<T | undefined> {
  const contentType = response.headers.get('content-type') ?? response.headers.get('Content-Type') ?? '';

  if (!contentType.includes('application/json')) {
    return undefined;
  }

  return (await response.json()) as T;
}

export function createHttpClient({
  baseUrl = apiBaseUrl,
  fetch: fetchImplementation = globalThis.fetch,
}: {
  baseUrl?: string;
  fetch?: FetchImplementation;
} = {}) {
  if (!fetchImplementation) {
    throw new Error('Fetch API is not available in this runtime');
  }

  async function request<T>(method: string, path: string, options: RequestOptions = {}) {
    const hasBody = options.body !== undefined;
    const response = await fetchImplementation(buildUrl(baseUrl, path, options.query), {
      method,
      headers: createHeaders(hasBody),
      ...(hasBody ? { body: JSON.stringify(options.body) } : {}),
    });

    if (!response.ok) {
      const errorBody = await readJson<ApiErrorResponse>(response);

      if (errorBody && isApiErrorResponse(errorBody)) {
        throw new HttpError(
          errorBody.error.message,
          response.status,
          errorBody.error.code,
          errorBody.error.details,
        );
      }

      throw new HttpError(`HTTP ${response.status}`, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await readJson<T>(response)) as T;
  }

  return {
    get<T>(path: string, query?: QueryParams) {
      return request<T>('GET', path, { query });
    },
    post<T>(path: string, body?: unknown) {
      return request<T>('POST', path, { body });
    },
    put<T>(path: string, body?: unknown) {
      return request<T>('PUT', path, { body });
    },
    delete(path: string) {
      return request<void>('DELETE', path);
    },
  };
}

export type HttpClient = ReturnType<typeof createHttpClient>;
