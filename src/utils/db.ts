import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DB_URL } from './config';

export const connection = postgres(DB_URL);
export const db = drizzle(connection);
