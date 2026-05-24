import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

type Schemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export function validate(schemas: Schemas) {
  return (request: Request, _response: Response, next: NextFunction) => {
    try {
      request.validated = {};

      if (schemas.body) {
        request.validated.body = schemas.body.parse(request.body);
      }

      if (schemas.query) {
        request.validated.query = schemas.query.parse(request.query);
      }

      if (schemas.params) {
        request.validated.params = schemas.params.parse(request.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }

      next(error);
    }
  };
}
