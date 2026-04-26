const { Client } = require('pg');

const regions = [
  'us-east-1', 'eu-central-1', 'ap-southeast-1', 'us-west-1', 'eu-west-1'
];

async function checkConnection() {
  const projectRef = 'hqzkxbwtvcmkrvflkwzq';
  const password = 'WTngLy3OmFnTJudp';
  
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:5432/postgres`;
    
    console.log(`Testing ${region}...`);
    const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
    try {
      await client.connect();
      console.log(`✅ Success! Region is ${region}`);
      await client.end();
      return region;
    } catch (e) {
      console.log(`❌ Failed ${region}: ${e.message}`);
    }
  }
}

checkConnection();
