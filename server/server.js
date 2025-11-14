// server/server.js — Główny plik startowy backendu

// Ładujemy .env tylko lokalnie (Render ustawia zmienne środowiskowe sam)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./app.js');
const { sequelize } = require('./models');
const userService = require('./services/userService.js');

// Render dostarcza PORT — musimy go użyć.
const PORT = process.env.PORT || process.env.API_PORT || 3000;

let server;

const startServer = async () => {
  try {
    console.log('🔵 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection OK.');

    // Create default admin user if missing
    await userService.createDefaultAdminUser();

    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        process.exit(1);
      }
      throw error;
    });

  } catch (error) {
    console.error('🔥 SERVER START FAILED:', error.message);
    process.exit(1);
  }
};

startServer();

// --- Graceful shutdown for Render ---
const gracefulShutdown = () => {
  console.log('🟡 Closing server...');
  server.close(() => {
    console.log('🟢 Server closed.');
    sequelize.close().then(() => {
      console.log('🐘 DB connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
