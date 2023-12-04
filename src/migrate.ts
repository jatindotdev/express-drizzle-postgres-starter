import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import drizzleConfig from "../drizzle.config";
import { connection, db } from "./utils/db";

const main = async () => {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: drizzleConfig.out });

  // Don't forget to close the connection, otherwise the script will hang
  await connection.end();
};

main();
