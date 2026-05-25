import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { checkDbConnection } from './middleware/dbCheck.js';

// Route files
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import generationRoutes from './routes/generations.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// CORS Middleware configuration - allow requests from any frontend port (e.g. 5173, etc.)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json());

// Basic sanity check health check API route with database indicator
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    dbConnected: global.dbConnected,
    message: global.dbConnected
      ? 'Lumina AI Backend is fully healthy & online'
      : 'Server is active, but MongoDB connection is currently offline.',
    time: new Date(),
  });
});

// Mount router endpoints with DB safety check middleware
app.use('/api/auth', checkDbConnection, authRoutes);
app.use('/api/ai', checkDbConnection, aiRoutes);
app.use('/api/generations', checkDbConnection, generationRoutes);

// Catch-all 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Lumina AI server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
