const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL);
sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'cv_analyses';`.then(res => {
  console.log(res.map(r => r.column_name));
});
