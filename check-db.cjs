const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://dahomey_gang_db_user:bx6mozvxZ61e6oAEh5WBm5vF68TaRGtw@dpg-d08etrndiees7399mphg-a.oregon-postgres.render.com/dahomey_gang_db',
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
