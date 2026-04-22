import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables (fallback to .env.example for generation if needed)
dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.example' });
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
