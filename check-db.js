const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://orwdvpfyusyrzxnvuimb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yd2R2cGZ5dXN5cnp4bnZ1aW1iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY2MDkyOCwiZXhwIjoyMDk1MjM2OTI4fQ.eRcYRH_8Hl3YbLw9GwMKtbj3cRt0FzfBnk9uryUwvtA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStructure() {
  console.log('🔍 Checking database structure...\n');

  // Check what columns exist in each table
  const tables = ['profiles', 'tools', 'articles', 'categories', 'comments'];

  for (const table of tables) {
    try {
      // Try to insert a record with minimal data to test the structure
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: exists`);
        console.log(`   Columns: ${data ? Object.keys(data[0] || {}).join(', ') : 'unknown'}`);
      }
    } catch (e) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }

  console.log('\n--- Checking if schema.sql was applied ---');
  console.log('To verify, please run this in Supabase SQL Editor:');
  console.log('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\';');
}

checkDatabaseStructure().catch(console.error);