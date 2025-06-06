import type { Config } from 'drizzle-kit';
import { join } from 'path';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dialect: 'sqlite',
  dbCredentials: {
    url: join(process.cwd(), 'sqlite.db'),
  },
} satisfies Config;
