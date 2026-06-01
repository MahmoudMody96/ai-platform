// Supabase DB Reset & Re-apply runner.
// Connects to the Shared Pooler (IPv4-compatible) and runs the
// three migration files in order: reset -> schema -> seed.
//
// Run from the project root:
//   node scripts/db-reset-runner.js

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  host: 'aws-1-eu-central-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.qchnindfczaulufazivy',
  password: 'Kemo_prompt@2026',  // ⚠️  Hardcoded by user request, must be rotated
  ssl: { rejectUnauthorized: false },
  // The pooler needs this for the session to find the right tenant
  options: '-c search_path=public',
  statement_timeout: 60000,  // 60s per statement
};

const MIGRATIONS = [
  'supabase/migrations/000_reset_all.sql',
  'supabase/schema.sql',
  'supabase/migrations/003_arabic_seed_data.sql',
];

const VERIFY = [
  ['SELECT count(*) AS tools     FROM tools'],
  ['SELECT count(*) AS categories FROM categories'],
  ['SELECT count(*) AS articles   FROM articles'],
  ['SELECT count(*) AS plans      FROM plans'],
  ['SELECT count(*) AS profiles   FROM profiles'],
  ["SELECT typname FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname='public' AND t.typtype='e' ORDER BY typname"],
];

(async () => {
  const client = new Client(CONFIG);
  await client.connect();
  console.log('✅ Connected to', CONFIG.host + ':' + CONFIG.port);

  for (const path of MIGRATIONS) {
    const sql = fs.readFileSync(path, 'utf8');
    console.log(`\n▶ Running ${path}  (${sql.length} bytes)`);
    try {
      await client.query(sql);
      console.log(`✅ ${path} done.`);
    } catch (e) {
      console.error(`❌ ${path} FAILED:`);
      console.error('   ', e.message);
      await client.end();
      process.exit(1);
    }
  }

  console.log('\n=== Verification ===');
  for (const [sql] of VERIFY) {
    try {
      const { rows } = await client.query(sql);
      const value = rows[0] && Object.values(rows[0])[0];
      console.log(' ', sql);
      console.log('  →', value !== undefined ? value : JSON.stringify(rows));
    } catch (e) {
      console.error('  ❌', e.message);
    }
  }

  await client.end();
  console.log('\n✅ Reset + re-apply + seed complete.');
})().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
