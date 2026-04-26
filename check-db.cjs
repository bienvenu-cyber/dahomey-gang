
const { Client } = require('pg');

const connectionString = process.env.SUPABASE_DB_URL || process.env.RENDER_DB_URL;
console.log('Connecting to:', connectionString ? connectionString.split('@')[1] : 'NONE');

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});



async function checkDB() {
  try {
    await client.connect();
    console.log('✓ Connexion réussie\n');

    // Liste des tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('=== TABLES ===');
    for (const row of tables.rows) {
      console.log(`- ${row.table_name}`);
      
      // Compte des lignes
      const count = await client.query(`SELECT COUNT(*) FROM ${row.table_name}`);
      console.log(`  → ${count.rows[0].count} lignes\n`);
    }

  } catch (err) {
    console.error('Erreur:', err.message);
  } finally {
    await client.end();
  }
}

checkDB();
