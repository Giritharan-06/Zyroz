import dotenv from 'dotenv';
import { Pool } from '@neondatabase/serverless';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_OVW2IfjPpTw3@ep-restless-cake-a1hoyft3-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

if (!connectionString) {
  console.error("❌ DATABASE_URL is not defined in .env.local");
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function sync() {
  console.log("🚀 Starting Global Database Sync to Neon...");

  try {
    // 1. Create Tables
    console.log("Creating/Validating tables with robust schemas for all pages...");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
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
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
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
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        client VARCHAR(255),
        due VARCHAR(100),
        priority VARCHAR(50) DEFAULT 'Medium',
        status VARCHAR(50) DEFAULT 'Pending',
        context TEXT,
        time_spent VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        size VARCHAR(50),
        resolution VARCHAR(50),
        campaigns_used INTEGER DEFAULT 0,
        url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytic_metrics (
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
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_posts (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(100) NOT NULL,
        content TEXT,
        status VARCHAR(50) DEFAULT 'Scheduled',
        scheduled_for TIMESTAMP,
        media_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Draft',
        sent_count INTEGER DEFAULT 0,
        open_rate DECIMAL(5,2) DEFAULT 0.00,
        click_rate DECIMAL(5,2) DEFAULT 0.00,
        scheduled_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS seo_audits (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        performance_score INTEGER,
        seo_score INTEGER,
        accessibility_score INTEGER,
        best_practices_score INTEGER,
        issues_found JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100),
        actor VARCHAR(255),
        details TEXT,
        severity VARCHAR(50) DEFAULT 'Info',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT
      );
    `);

    console.log("✅ Tables created/validated successfully.");

    // 2. Seed Data
    console.log("Seeding initial data...");

    // Settings
    const settings = [
      ['social_facebook', 'https://facebook.com'],
      ['social_instagram', 'https://instagram.com'],
      ['social_twitter', 'https://twitter.com'],
      ['social_linkedin', 'https://linkedin.com'],
      ['admin_first_name', 'Nexus'],
      ['admin_last_name', 'Admin'],
      ['admin_display_email', 'admin@digipulse.agency']
    ];
    for (const [key, value] of settings) {
      await pool.query("INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING", [key, value]);
    }

    // Analytics
    const analyticsCount = await pool.query("SELECT COUNT(*) FROM analytic_metrics");
    if (parseInt(analyticsCount.rows[0].count) === 0) {
      console.log("Seeding analytics...");
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        await pool.query(`
          INSERT INTO analytic_metrics (date, visitors, sessions, bounce_rate, avg_session_duration, device_mobile, device_desktop, device_tablet)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          date, 
          Math.floor(Math.random() * 500) + 100, 
          Math.floor(Math.random() * 700) + 150, 
          (Math.random() * 20 + 30).toFixed(2), 
          "2m 14s", 
          Math.floor(Math.random() * 300), 
          Math.floor(Math.random() * 400), 
          Math.floor(Math.random() * 50)
        ]);
      }
    }

    // Social Posts
    const socialCount = await pool.query("SELECT COUNT(*) FROM social_posts");
    if (parseInt(socialCount.rows[0].count) === 0) {
      console.log("Seeding social posts...");
      await pool.query(`
        INSERT INTO social_posts (platform, content, status, scheduled_for)
        VALUES 
        ('Instagram', 'Unlocking the power of AI in 2026. #DigitalMarketing', 'Scheduled', NOW() + INTERVAL '1 day'),
        ('LinkedIn', 'Excited to announce our new expansion into global markets.', 'Scheduled', NOW() + INTERVAL '2 days'),
        ('Twitter', 'Quick tip: SEO is not dead, it is evolving. Read more on our blog.', 'Posted', NOW() - INTERVAL '4 hours')
      `);
    }

    // Email Campaigns
    const emailCount = await pool.query("SELECT COUNT(*) FROM email_campaigns");
    if (parseInt(emailCount.rows[0].count) === 0) {
      console.log("Seeding email campaigns...");
      await pool.query(`
        INSERT INTO email_campaigns (name, subject, status, sent_count, open_rate, click_rate)
        VALUES 
        ('Welcome Series', 'Welcome to Digi Pulse!', 'Active', 1240, 42.5, 12.8),
        ('Monthly Newsletter', 'October Marketing Insights', 'Sent', 5400, 31.2, 8.4),
        ('Flash Sale Alert', 'Limited Time Offer: 50% Off Agency Plans', 'Draft', 0, 0, 0)
      `);
    }

    // SEO Audits
    const seoCount = await pool.query("SELECT COUNT(*) FROM seo_audits");
    if (parseInt(seoCount.rows[0].count) === 0) {
      console.log("Seeding SEO audits...");
      await pool.query(`
        INSERT INTO seo_audits (url, performance_score, seo_score, accessibility_score, best_practices_score, issues_found)
        VALUES 
        ('https://digipulse.agency', 94, 98, 92, 100, '{"critical": 0, "warning": 2, "info": 5}'),
        ('https://digipulse.agency/blog', 88, 95, 90, 96, '{"critical": 1, "warning": 4, "info": 8}')
      `);
    }

    // System Logs
    const logCount = await pool.query("SELECT COUNT(*) FROM system_logs");
    if (parseInt(logCount.rows[0].count) === 0) {
      console.log("Seeding system logs...");
      await pool.query(`
        INSERT INTO system_logs (event_type, actor, details, severity)
        VALUES 
        ('IDENTITY_SYNC', 'System Agent', 'Profile asset signature updated successfully.', 'Info'),
        ('SECURITY_AUDIT', 'Shield v2', 'Unauthorized bypass attempt blocked at node 0x42.', 'Warning'),
        ('DATABASE_SYNC', 'Nexus Admin', 'Global schema migration completed.', 'Info')
      `);
    }

    console.log("✅ All dashboard sections successfully pushed and synced with Neon Database!");
  } catch (error) {
    console.error("❌ Sync Error:", error);
  } finally {
    await pool.end();
  }
}

sync();
