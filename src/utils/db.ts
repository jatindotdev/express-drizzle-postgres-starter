import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const connection = postgres(process.env.DB_URL);
export const db = drizzle(connection);
