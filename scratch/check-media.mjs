import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkMedia() {
  try {
    const res = await pool.query("SELECT * FROM media ORDER BY created_at DESC LIMIT 5");
    console.log("Latest Media entries:");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("Error checking media:", err);
  } finally {
    await pool.end();
  }
}

checkMedia();
