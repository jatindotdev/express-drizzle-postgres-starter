import consola from 'consola';
import type { NextFunction, Request, Response } from 'express';

export function logger(req: Request, _res: Response, next: NextFunction) {
  const ip = req.ip;
  const method = req.method;
  const url = req.url;
  const version = req.httpVersion;
  const userAgent = req.headers['user-agent'];

  const message = `${ip} [${method}] ${url} HTTP/${version} ${userAgent}`;

  consola.log(message);

  next();
}
