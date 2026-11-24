import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load backend environment variables explicitly from backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config(); // fallback

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import { isCloudinaryConfigured } from './config/cloudinary.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import portfolioRoutes from './routes/portfolio.js';
import enquiryRoutes from './routes/enquiry.js';
import uploadRoutes from './routes/upload.js';
import settingsRoutes from './routes/settings.js';
import homeRoutes from './routes/home.js';
import aboutRoutes from './routes/about.js';
import headersRoutes from './routes/headers.js';
import servicesRoutes from './routes/services.js';
import processRoutes from './routes/process.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite development
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure DB is connected for requests (Vercel Serverless / Services lifecycle)
app.use('/api', async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
    } catch (err) {
      console.warn('[MongoDB] Auto-connect attempt warning:', err.message);
    }
  }
  next();
});

// Health Check API
app.get('/api/health', (req, res) => {
  const mongoStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const mongoState = mongoose.connection.readyState;

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    frontendUrl: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
    services: {
      mongodb: {
        status: mongoStatusMap[mongoState] || 'unknown',
        connected: mongoState === 1,
      },
      cloudinary: {
        configured: isCloudinaryConfigured(),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
      },
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/headers', headersRoutes);
app.use('/api/services-content', servicesRoutes);
app.use('/api/process-content', processRoutes);

// Serve static images and public assets
const potentialImagesDirs = [
  path.resolve(__dirname, 'public/images'),
  path.resolve(__dirname, '../public/images'),
];
for (const dir of potentialImagesDirs) {
  if (fs.existsSync(dir)) {
    app.use('/images', express.static(dir));
  }
}
const potentialPublicDirs = [
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, 'public'),
];
for (const dir of potentialPublicDirs) {
  if (fs.existsSync(dir)) {
    app.use(express.static(dir));
  }
}

// Serve compiled React build assets
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Route /admin to the React Admin Application (SPA)
app.use('/admin', (req, res) => {
  const reactIndex = path.join(distPath, 'index.html');
  if (fs.existsSync(reactIndex)) {
    res.sendFile(reactIndex);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Admin Portal | My Rare Aesthetics</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:50px;background:#F6F2F5;color:#2B1830;">
          <h2>React Admin Portal (MERN Stack)</h2>
          <p>Please run <code>npm run build</code> to compile the React SPA for production, or run <code>npm run dev</code> to access <a href="http://localhost:5173/admin">http://localhost:5173/admin</a>.</p>
        </body>
      </html>
    `);
  }
});

// Fallback 404 handler for unmatched routes
app.use((req, res) => {
  if (req.accepts('html') && fs.existsSync(path.join(distPath, 'index.html'))) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Start server
async function startServer() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Linked Frontend: ${process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });

  // Connect to MongoDB asynchronously
  connectDB();
}

startServer();

export default app;
