import { type NextFunction, type Request, type Response, Router } from 'express';
import type { z } from 'zod';

export function createRouter(callback: (router: Router) => void) {
  const router = Router();
  callback(router);
  return router;
}

export function createHandler<T extends z.ZodType>(
  schema: T,
  handler: (
    req: Omit<Request, keyof z.output<T>> & z.output<T>,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>
): (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function createHandler(
  handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>
): (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function createHandler<T extends z.ZodType>(
  schemaOrHandler:
    | T
    | ((req: Request, res: Response, next: NextFunction) => void | Promise<void>),
  handler?: (
    req: Omit<Request, keyof z.output<T>> & z.output<T>,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (handler) {
        const schema = schemaOrHandler as T;
        schema.parse(req);
        await handler(req, res, next);
      }
      else {
        const handler = schemaOrHandler as (
          req: Request,
          res: Response,
          next: NextFunction
        ) => void | Promise<void>;
        await handler(req, res, next);
      }
    }
    catch (error) {
      next(error);
    }
  };
}
