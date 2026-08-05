import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "@repo/db-schema";

import { getEnv } from "./integrations/env";

const { DATABASE_URL } = getEnv();

const client = postgres(DATABASE_URL);

export const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });
