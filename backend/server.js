import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';

import { checkDbConnection } from './middleware/dbCheck.js';

// ROUTES
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import generationRoutes from './routes/generations.js';

// LOAD ENV VARIABLES
dotenv.config();

// CONNECT DATABASE
connectDB();

const app = express();

// CORS CONFIG
app.use(
  cors({
   origin: [
  'http://localhost:5173',
  'https://lumina-ai-suite-nine.vercel.app',
],
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// BODY PARSER
app.use(express.json());

// HEALTH CHECK ROUTE
app.get('/api/health', (req, res) => {

  res.json({
    status: 'OK',

    dbConnected:
      global.dbConnected,

    message:
      global.dbConnected
        ? 'Lumina AI Backend is fully healthy & online'
        : 'Server is active, but MongoDB connection is currently offline.',

    time: new Date(),
  });
});

// ROUTES
app.use(
  '/api/auth',
  checkDbConnection,
  authRoutes
);

app.use(
  '/api/ai',
  checkDbConnection,
  aiRoutes
);

app.use(
  '/api/generations',
  checkDbConnection,
  generationRoutes
);

// 404 HANDLER
app.use((req, res) => {

  res.status(404).json({
    message: `Route not found - ${req.originalUrl}`,
  });
});

// GLOBAL ERROR HANDLER
app.use(
  (err, req, res, next) => {

    console.error(
      'Unhandled Server Error:',
      err.stack
    );

    const statusCode =
      res.statusCode === 200
        ? 500
        : res.statusCode;

    res.status(statusCode).json({
      message:
        err.message ||
        'Internal Server Error',

      stack:
        process.env.NODE_ENV ===
        'production'
          ? null
          : err.stack,
    });
  }
);

const PORT =
  process.env.PORT || 5000;

// START SERVER
app.listen(PORT, () => {

  console.log(
    `Lumina AI server running in ${
      process.env.NODE_ENV ||
      'development'
    } mode on port ${PORT}`
  );
});