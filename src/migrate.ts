import process from 'node:process';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import drizzleConfig from '../drizzle.config';
import 'dotenv/config';

async function main() {
  const connection = postgres(process.env.DB_URL, { max: 1 });

  // This will run migrations on the database, skipping the ones already applied
  await migrate(drizzle(connection), { migrationsFolder: drizzleConfig.out });

  // Don't forget to close the connection, otherwise the script will hang
  await connection.end();
}

main();
