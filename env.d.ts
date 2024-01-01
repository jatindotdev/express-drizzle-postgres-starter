import { Env } from '@/utils/env';
import type { Response } from 'express';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
