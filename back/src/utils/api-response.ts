import { Response } from 'express';

type Meta = {
  total: number;
  limit: number;
  offset: number;
};

export function ok<T>(response: Response, data: T, statusCode = 200) {
  return response.status(statusCode).json({ data });
}

export function withMeta<T>(response: Response, data: T, meta: Meta, statusCode = 200) {
  return response.status(statusCode).json({ data, meta });
}
