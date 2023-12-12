import consola from 'consola';
import { NextFunction, Request, Response } from 'express';
import { PostgresError } from 'postgres';
import { ZodError } from 'zod';

export const handleValidationError = (err: ZodError): string => {
  const [firstError] = err.errors;
  if (firstError.message.includes('Required')) {
    const missingParams = err.errors.map(error => error.path).join(', ');
    return `Missing required params: ${missingParams}`;
  }

  if (firstError.message.includes('Invalid')) {
    const [first] = err.errors;
    return `Invalid params: ${first.path}`;
  }

  return err.errors[0].message;
};

export class BackendError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const url = req.originalUrl;
  const method = req.method;
  let resMessage: string | undefined;
  let message: string | undefined;
  let code: number | undefined;
  const ip = req.ip;

  if (error instanceof BackendError) {
    message = error.message;
    resMessage = error.message;
    code = error.code;
  }

  if (error instanceof PostgresError) {
    message = error.message;
    resMessage = 'Something went wrong and we are working on it';
    code = 500;
  }

  if (error instanceof ZodError) {
    message = handleValidationError(error);
    resMessage = message;
    code = 400;
  }

  if (!message || !code) {
    message = error instanceof Error ? error.message : 'Something went wrong';
    resMessage = 'Something went wrong and we are working on it';
    code = 500;
  }

  consola.error(`${ip} [${method}] ${url} ${code} - ${message}`);

  res.status(code).json({
    success: false,
    message: resMessage,
  });
};

export const handle404Error = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
