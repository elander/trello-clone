import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { join } from 'path';

import * as schema from './schema';

// For Node.js environments (API routes, etc.)
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

export { schema };
