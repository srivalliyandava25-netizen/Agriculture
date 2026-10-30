
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import fs from 'fs';

import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { config } from './config/env.js';

import authRoutes from './routes/authRoutes.js';
import soilRoutes from './routes/soilRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import fertilizerRoutes from './routes/fertilizerRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import expertRoutes from './routes/expertRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import sustainabilityRoutes from './routes/sustainabilityRoutes.js';
import insuranceRoutes from './routes/insuranceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        scriptSrc: [
          "'self'",
          'https://translate.google.com',
          'https://translate.googleapis.com'
        ],
        frameSrc: ["'self'", 'https://translate.google.com'],
        connectSrc: [
          "'self'",
          'https://translate.google.com',
          'https://translate.googleapis.com'
        ]
      }
    }
  })
);

// CORS configuration
app.use(
  cors({
    origin: [
      config.clientUrl,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:4174',
      'http://127.0.0.1:4174'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  })
);

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API rate limiter
app.use('/api', apiLimiter);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Mitti Mitra Smart Farming API!'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;

  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'Mitti Mitra Smart Farming API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatusMap[dbState] || 'Unknown',
    environment: config.nodeEnv
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/fertilizers', fertilizerRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/sustainability', sustainabilityRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assistant', assistantRoutes);

// Serve frontend build if it exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api/') ||
      req.path.startsWith('/uploads/')
    ) {
      return next();
    }

    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    requestedPath: req.originalUrl
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
