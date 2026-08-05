import type * as schema from "@repo/db-schema";
import type { PostgresJsDatabase, PostgresJsTransaction } from "drizzle-orm/postgres-js";

export type DatabaseSchema = typeof schema;

export type DbConnection = PostgresJsDatabase<DatabaseSchema>;

export type DbExecutor =
  | DbConnection
  | PostgresJsTransaction<DatabaseSchema, Record<string, never>>;
