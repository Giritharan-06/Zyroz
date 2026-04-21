import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fixSchema() {
  try {
    console.log("Checking for missing columns...");
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'leads'");
    const columns = res.rows.map(r => r.column_name);
    
    if (!columns.includes('source')) {
      console.log("Adding 'source' column...");
      await pool.query("ALTER TABLE leads ADD COLUMN source VARCHAR(100)");
    }
    
    if (!columns.includes('score')) {
      console.log("Adding 'score' column...");
      await pool.query("ALTER TABLE leads ADD COLUMN score INTEGER DEFAULT 80");
    }
    
    console.log("✅ Schema updated successfully.");
  } catch (err) {
    console.error("❌ Error updating schema:", err);
  } finally {
    await pool.end();
  }
}

fixSchema();
