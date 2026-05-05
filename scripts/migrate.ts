/**
 * Run this script once to apply the database schema to Neon.
 * Usage: npx tsx scripts/migrate.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  process.exit(1);
}

async function migrate() {
  const sql = neon(DATABASE_URL as string);

  console.log('📦 Reading migration file...');
  const migrationPath = join(process.cwd(), 'db', 'migrations', '0000_busy_cerise.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');

  const statements = migrationSQL
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter(Boolean);

  console.log(`🚀 Running ${statements.length} SQL statements against Neon...\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.substring(0, 70).replace(/\n/g, ' ');
    process.stdout.write(`  [${i + 1}/${statements.length}] ${preview}...  `);

    try {
      // sql.query() is the correct API for raw SQL strings in @neondatabase/serverless v1+
      await sql.query(statement);
      console.log('✅');
    } catch (err: any) {
      if (err.message?.includes('already exists')) {
        console.log('⏩ already exists');
      } else {
        console.log('❌');
        console.error(`\nFailed on statement:\n${statement}\n`);
        console.error('Error:', err.message);
        process.exit(1);
      }
    }
  }

  console.log('\n✅ Migration complete — all tables and enums are ready in Neon!');
}

migrate().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
