import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { join } from 'path';

import * as schema from './schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Create a singleton
let db: ReturnType<typeof createDrizzleClient>;

export function createDrizzleClient() {
  const sqlite = new Database(join(process.cwd(), 'sqlite.db'));
  return drizzle(sqlite, { schema });
}

export function getDb() {
  if (!db) {
    db = createDrizzleClient();
  }
  return db;
}

// Export a function to run migrations
export function runMigrations() {
  const sqlite = new Database(join(process.cwd(), 'sqlite.db'));
  const db = drizzle(sqlite);
  migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') });
  return db;
}

// Zod schemas for validation
export const insertBoardSchema = createInsertSchema(schema.boards);
export const selectBoardSchema = createSelectSchema(schema.boards);

export const insertListSchema = createInsertSchema(schema.lists);
export const selectListSchema = createSelectSchema(schema.lists);

export const insertCardSchema = createInsertSchema(schema.cards);
export const selectCardSchema = createSelectSchema(schema.cards);

export { schema };
