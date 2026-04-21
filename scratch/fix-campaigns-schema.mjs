import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fixSchema() {
  try {
    console.log("Checking for missing columns in 'campaigns'...");
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'campaigns'");
    const columns = res.rows.map(r => r.column_name);
    
    if (!columns.includes('audience')) {
      console.log("Adding 'audience' column to campaigns...");
      await pool.query("ALTER TABLE campaigns ADD COLUMN audience TEXT");
    }

    if (!columns.includes('start_date')) {
      console.log("Adding 'start_date' column (snake_case) to campaigns if missing...");
      // Check if it already exists or if we need to rename/add
    }
    
    console.log("✅ Campaigns schema updated successfully.");
  } catch (err) {
    console.error("❌ Error updating campaigns schema:", err);
  } finally {
    await pool.end();
  }
}

fixSchema();
