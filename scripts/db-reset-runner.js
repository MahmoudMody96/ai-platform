// Supabase DB Reset & Re-apply runner.
// Connects to the Shared Pooler (IPv4-compatible) and runs the
// three migration files in order: reset -> schema -> seed.
//
// ⚠️ SECURITY: do NOT hardcode the DB password. The runner reads
// it from `SUPABASE_DB_PASSWORD` (env var). Pass it via:
//   $env:SUPABASE_DB_PASSWORD='your-password'      (PowerShell)
//   SUPABASE_DB_PASSWORD=your-password node ...     (bash/zsh)
//
// Run from the project root:
//   node scripts/db-reset-runner.js

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const PASSWORD = process.env.SUPABASE_DB_PASSWORD;
if (!PASSWORD) {
  console.error('❌ SUPABASE_DB_PASSWORD env var is required.');
  console.error('   PowerShell:  $env:SUPABASE_DB_PASSWORD = "your-password"');
  console.error('   bash/zsh:    SUPABASE_DB_PASSWORD="your-password" node scripts/db-reset-runner.js');
  console.error('   ⚠️  DO NOT hardcode the password in this file.');
  process.exit(1);
}

const CONFIG = {
  host: 'aws-1-eu-central-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.qchnindfczaulufazivy',
  password: PASSWORD,
  ssl: { rejectUnauthorized: false },
  statement_timeout: 120000,  // 2 min per statement
};

const MIGRATIONS = [
  'supabase/migrations/000_reset_all.sql',
  'supabase/schema.sql',
  'supabase/migrations/003_arabic_seed_data.sql',
];

const VERIFY = [
  ['SELECT count(*) FROM tools',      'tools'],
  ['SELECT count(*) FROM categories', 'categories'],
  ['SELECT count(*) FROM articles',   'articles'],
  ['SELECT count(*) FROM plans',      'plans'],
  ['SELECT count(*) FROM profiles',   'profiles'],
];

(async () => {
  const client = new Client(CONFIG);
  await client.connect();
  console.log('✅ Connected to', CONFIG.host + ':' + CONFIG.port);

  // Make sure uuid-ossp is in the search_path for DDL statements
  // (DEFAULT uuid_generate_v4() in CREATE TABLE needs it).
  await client.query("SET search_path TO public, extensions;");
  console.log('✅ search_path set to: public, extensions');

  for (const path of MIGRATIONS) {
    const sql = fs.readFileSync(path, 'utf8');
    console.log(`\n▶ Running ${path}  (${sql.length} bytes)`);
    try {
      await client.query(sql);
      console.log(`✅ ${path} done.`);
    } catch (e) {
      console.error(`❌ ${path} FAILED: ${e.message}`);
      await client.end();
      process.exit(1);
    }
  }

  console.log('\n=== Verification ===');
  for (const [sql, label] of VERIFY) {
    try {
      const { rows } = await client.query(sql);
      console.log(`  ${label.padEnd(12)}: ${rows[0].count}`);
    } catch (e) {
      console.error(`  ${label}: ❌ ${e.message}`);
    }
  }

  console.log('\n=== Public schema tables ===');
  const { rows: tables } = await client.query(
    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
  );
  console.log(' ', tables.map(t => t.tablename).join(', '));

  console.log('\n=== Categories (Arabic seed check) ===');
  const { rows: cats } = await client.query(
    "SELECT slug, name FROM categories ORDER BY sort_order"
  );
  for (const c of cats) console.log(`  ${c.slug.padEnd(20)} ${c.name}`);

  console.log('\n=== Sample tools (first 5) ===');
  const { rows: tools } = await client.query(
    "SELECT slug, name, rating_avg FROM tools ORDER BY is_featured DESC, name LIMIT 5"
  );
  for (const t of tools) console.log(`  ${t.slug.padEnd(20)} ${t.name}  ⭐ ${t.rating_avg}`);

  await client.end();
  console.log('\n✅ Reset + re-apply + seed complete.');
})().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
