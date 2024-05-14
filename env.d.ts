import type { Env } from '@/utils/env';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
