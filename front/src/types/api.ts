export type ApiMeta = {
  total: number;
  limit: number;
  offset: number;
};

export type ApiListResponse<T> = {
  data: T[];
  meta: ApiMeta;
};

export type ApiItemResponse<T> = {
  data: T;
};
