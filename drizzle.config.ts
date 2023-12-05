import { DB_URL } from "@/utils/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: DB_URL,
  },
} satisfies Config;
