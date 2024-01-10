import { Router, type NextFunction, type Request, type Response } from 'express';

export const createRouter = (callback: (router: Router) => void) => {
  const router = Router();
  callback(router);
  return router;
};

export const createHandler = (
  callback: ({
    req,
    res,
    next,
  }: {
    req: Request;
    res: Response;
    next: NextFunction;
  }) => Promise<void> | void
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback({ req, res, next });
    } catch (err) {
      next(err);
    }
  };
};
