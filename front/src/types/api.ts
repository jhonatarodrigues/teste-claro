export type ApiMeta = {
  total: number;
  limit: number;
  offset: number;
};

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiListResponse<T> = {
  data: T[];
  meta: ApiMeta;
};

export type ApiItemResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  error: ApiError;
};
