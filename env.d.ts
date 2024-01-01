import { Env } from '@/utils/config';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
