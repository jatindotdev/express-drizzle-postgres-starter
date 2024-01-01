import { z } from 'zod';
import 'dotenv/config';

const configSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d{4,5}$/)
    .optional()
    .default('3000'),
  API_BASE_URL: z.string().url().default('/api'),
  DB_URL: z
    .string()
    .url()
    .refine(
      url => url.startsWith('postgres://') || url.startsWith('postgresql://'),
      'DB_URL must be a valid postgresql url'
    ),
  FROM_NAME: z.string().default('Verify'),
  FROM_EMAIL: z.string().email(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  JWT_SECRET: z.string(),
});

configSchema.parse(process.env);

export type Env = z.infer<typeof configSchema>;
