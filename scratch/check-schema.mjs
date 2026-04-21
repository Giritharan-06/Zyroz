import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkSchema() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'leads'");
    console.log("Columns in 'leads' table:");
    console.log(res.rows.map(r => r.column_name));
  } catch (err) {
    console.error("Error checking schema:", err);
  } finally {
    await pool.end();
  }
}

checkSchema();
