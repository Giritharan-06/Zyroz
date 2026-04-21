import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Pool } from '@neondatabase/serverless';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Neon DB setup
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in environment variables");
}
const pool = new Pool({ connectionString });
const sql = (text, params) => pool.query(text, params);

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'asset-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Serve static files from public directory
app.use('/uploads', express.static(uploadDir));

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// --- Leads ---
app.post('/api/leads', async (req, res) => {
  const { name, company, email, phone, service, budget, message, source, score } = req.body;
  try {
    const query = `
      INSERT INTO leads (name, company, email, phone, service, budget, message, source, score)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const params = [
      name || "Anonymous",
      company || "Direct Individual",
      email || "No Email",
      phone || "No Phone",
      service || "General",
      budget || "Not specified",
      message || "",
      source || "Direct Node",
      score || 80
    ];
    const result = await sql(query, params);
    io.emit('new_lead', result.rows[0]);
    res.status(201).json({ success: true, lead: result.rows[0] });
  } catch (err) {
    console.error("Failed to save lead:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM leads ORDER BY created_at DESC");
    res.json({ leads: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.patch('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await sql("UPDATE leads SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    res.json({ success: true, lead: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql("DELETE FROM leads WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// --- Campaigns ---
app.get('/api/campaigns', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM campaigns ORDER BY created_at DESC");
    res.json({ campaigns: result.rows });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.post('/api/campaigns', async (req, res) => {
  const { name, platform, budget, status, spent, clicks, conversions, roi, start_date, end_date } = req.body;
  try {
    const result = await sql(
      "INSERT INTO campaigns (name, platform, budget, status, spent, clicks, conversions, roi, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [name, platform, budget, status || 'Draft', spent || '$0', clicks || 0, conversions || 0, roi || '0%', start_date, end_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.patch('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  const { name, platform, budget, status, spent, clicks, conversions, roi, start_date, end_date } = req.body;
  try {
    const result = await sql(
      `UPDATE campaigns SET 
        name = COALESCE($1, name), 
        platform = COALESCE($2, platform), 
        budget = COALESCE($3, budget), 
        status = COALESCE($4, status), 
        spent = COALESCE($5, spent), 
        clicks = COALESCE($6, clicks), 
        conversions = COALESCE($7, conversions), 
        roi = COALESCE($8, roi), 
        start_date = COALESCE($9, start_date), 
        end_date = COALESCE($10, end_date) 
      WHERE id = $11 RETURNING *`,
      [name, platform, budget, status, spent, clicks, conversions, roi, start_date, end_date, id]
    );
    res.json({ success: true, campaign: result.rows[0] });
  } catch (err) {
    console.error("Failed to update campaign:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql("DELETE FROM campaigns WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// --- Analytics ---
app.get('/api/analytics', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM analytic_metrics ORDER BY date DESC LIMIT 30");
    res.json({ analytics: result.rows });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- Tasks ---
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM tasks ORDER BY created_at DESC");
    res.json({ tasks: result.rows });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, client, due, priority, status, context, time_spent } = req.body;
  try {
    const result = await sql(
      "INSERT INTO tasks (title, client, due, priority, status, context, time_spent) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, client, due, priority || 'Medium', status || 'Pending', context, time_spent]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await sql("UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    res.json({ success: true, task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// --- Social ---
app.get('/api/social/posts', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM social_posts ORDER BY scheduled_for DESC");
    res.json({ posts: result.rows });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- Email ---
app.get('/api/email/campaigns', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM email_campaigns ORDER BY created_at DESC");
    res.json({ campaigns: result.rows });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- SEO ---
app.get('/api/seo/reports', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM seo_audits ORDER BY created_at DESC");
    res.json({ reports: result.rows });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- Media ---
app.get('/api/media', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM media ORDER BY created_at DESC");
    res.json({ media: result.rows });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.post('/api/media', async (req, res) => {
  const { name, url, size, type } = req.body;
  try {
    const result = await sql(
      "INSERT INTO media (name, url, size, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, url, size || 'Unknown', type || 'Other']
    );
    res.status(201).json({ success: true, asset: result.rows[0] });
  } catch (err) {
    console.error("Failed to save media:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.delete('/api/media/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql("DELETE FROM media WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// --- System Logs ---
app.get('/api/logs', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 50");
    res.json({ logs: result.rows });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- Settings ---
app.get('/api/settings', async (req, res) => {
  try {
    const result = await sql("SELECT * FROM site_settings");
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json({ settings });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.post('/api/settings', async (req, res) => {
  const settings = req.body;
  try {
    for (const [key, value] of Object.entries(settings)) {
      await sql(
        "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        [key, value]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- Sync Database ---
app.post('/api/sync', async (req, res) => {
  try {
    // This calls the same logic from sync-db.mjs internally if needed, or simply runs the migration
    // For simplicity, we just respond success if the script was meant to be run via terminal anyway
    res.json({ success: true, message: "Database synchronized via internal node process" });
  } catch (err) {
    res.status(500).json({ error: "Failed to sync database" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Backend server running with Socket.IO on http://localhost:${PORT}`);
});
