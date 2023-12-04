import { z } from "zod";
import "dotenv/config";

const configSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d{4,5}$/)
    .optional()
    .default("3000"),
  API_BASE_URL: z.string().url().default("/api"),
  DB_URL: z.string().url().startsWith("postgres://"),
  FROM_NAME: z.string().default("Verify"),
  FROM_EMAIL: z.string().email(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  JWT_SECRET: z.string(),
});

export const {
  PORT,
  API_BASE_URL,
  DB_URL,
  FROM_NAME,
  FROM_EMAIL,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  JWT_SECRET,
} = configSchema.parse(process.env);
