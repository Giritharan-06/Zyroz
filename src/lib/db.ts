import { Pool } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn("DATABASE_URL is missing from environment variables. Using fallback for development.");
}

let pool: Pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({ connectionString });
} else {
  if (!(global as any).pool) {
    (global as any).pool = new Pool({ connectionString });
  }
  pool = (global as any).pool;
}

export const query = async (text: string, params?: any[]) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    return { rows: [] }; 
  }
};

export async function setupDatabase() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      company VARCHAR(255),
      service VARCHAR(100),
      budget VARCHAR(50),
      message TEXT,
      status VARCHAR(50) DEFAULT 'New',
      source VARCHAR(100),
      score INTEGER DEFAULT 80,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      platform VARCHAR(100),
      status VARCHAR(50) DEFAULT 'Draft',
      budget VARCHAR(100),
      spent VARCHAR(100) DEFAULT '$0',
      clicks INTEGER DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      roi VARCHAR(50) DEFAULT '0%',
      start_date VARCHAR(50),
      end_date VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      client VARCHAR(255),
      due VARCHAR(100),
      priority VARCHAR(50) DEFAULT 'Medium',
      status VARCHAR(50) DEFAULT 'Pending',
      context TEXT,
      time_spent VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS media (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50),
      size VARCHAR(50),
      resolution VARCHAR(50),
      campaigns_used INTEGER DEFAULT 0,
      url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS analytic_metrics (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      visitors INTEGER DEFAULT 0,
      sessions INTEGER DEFAULT 0,
      bounce_rate DECIMAL(5,2),
      avg_session_duration VARCHAR(50),
      device_mobile INTEGER DEFAULT 0,
      device_desktop INTEGER DEFAULT 0,
      device_tablet INTEGER DEFAULT 0,
      geo_data JSONB
    );`,
    `CREATE TABLE IF NOT EXISTS social_posts (
      id SERIAL PRIMARY KEY,
      platform VARCHAR(100) NOT NULL,
      content TEXT,
      status VARCHAR(50) DEFAULT 'Scheduled',
      scheduled_for TIMESTAMP,
      media_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS email_campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      subject VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Draft',
      sent_count INTEGER DEFAULT 0,
      open_rate DECIMAL(5,2) DEFAULT 0.00,
      click_rate DECIMAL(5,2) DEFAULT 0.00,
      scheduled_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS seo_audits (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      performance_score INTEGER,
      seo_score INTEGER,
      accessibility_score INTEGER,
      best_practices_score INTEGER,
      issues_found JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS system_logs (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(100),
      actor VARCHAR(255),
      details TEXT,
      severity VARCHAR(50) DEFAULT 'Info',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT
    );`
  ];

  try {
    for (const q of queries) {
      await pool.query(q);
    }
    console.log("Database schema initialized successfully.");
  } catch (err) {
    console.error("Schema init error:", err);
  }
}

// Automatically try to setup schema (only use in dev/temp setup)
setupDatabase();
