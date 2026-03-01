import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL as string;

if (!connectionString) {
  throw new Error(
    "POSTGRES_URL is not set. Check your .env file.\n" +
      "For local dev: docker compose up -d (then use the default URL in env.example)"
  );
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
