// Plik server/config/database.js
const path = require('path');

// Ładujemy zmienne środowiskowe z pliku .env w katalogu server
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const commonConfig = {
  dialect: 'postgres',
  // Użyj `snake_case` dla wszystkich automatycznie generowanych nazw (np. kluczy obcych)
  // To zapewni spójność z nazewnictwem w Twoim pliku init.js
  define: {
    underscored: true,
  },
};

module.exports = {
  development: {
    ...commonConfig,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'tms_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
  },
  production: {
    ...commonConfig,
    use_env_variable: 'DATABASE_URL', // Sequelize-CLI automatycznie użyje tej zmiennej
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
