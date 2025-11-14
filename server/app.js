// server/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const hpp = require('hpp');
const logger = require('./config/logger.js');

const authRoutes = require('./routes/authRoutes.js');
const driverRoutes = require('./routes/driverRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const truckRoutes = require('./routes/truckRoutes.js');
const trailerRoutes = require('./routes/trailerRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const assignmentRoutes = require('./routes/assignmentRoutes.js');
const runRoutes = require('./routes/runRoutes.js');
const customerRoutes = require('./routes/customerRoutes.js');
const postcodeZoneRoutes = require('./routes/postcodeZoneRoutes.js');
const rateCardRoutes = require('./routes/rateCardRoutes.js');
const surchargeTypeRoutes = require('./routes/surchargeTypeRoutes.js');
const feedbackRoutes = require('./routes/feedbackRoutes.js');
const invoiceRoutes = require('./routes/invoiceRoutes.js');

const errorMiddleware = require('./middleware/errorMiddleware.js');
const { sequelize } = require('./models');

const app = express();

// Render & proxies
app.set('trust proxy', 1);

// Core middlewares
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use(hpp());

// CORS (Vercel frontend + local dev + wildcard *.vercel.app)
app.use(cors({
  origin: [
    /\.vercel\.app$/,
    'https://my-tms-project-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

// Global rate limit (auth has its own limiter)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 2000 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Forbid caching API responses
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  const stream = { write: (msg) => logger.info(msg.trim()) };
  app.use(morgan('combined', { stream }));
}

// Health check endpoint (Render uses it)
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'OK',
      db: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ status: 'ERROR', db: 'disconnected' });
  }
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/trailers', trailerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/zones', postcodeZoneRoutes);
app.use('/api/rate-cards', rateCardRoutes);
app.use('/api/surcharge-types', surchargeTypeRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/feedback', feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Resource not found: ${req.originalUrl}` });
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
