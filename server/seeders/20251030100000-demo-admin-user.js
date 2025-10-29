// Plik: server/seeders/YYYYMMDDHHMMSS-demo-admin-user.js
'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Haszujemy hasło przed wstawieniem go do bazy danych
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Password123!', 10);

    await queryInterface.bulkInsert('users', [{
      first_name: 'Admin',
      last_name: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password_hash: passwordHash,
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    // Usuwa tylko tego konkretnego użytkownika
    await queryInterface.bulkDelete('users', {
      email: process.env.ADMIN_EMAIL || 'admin@example.com'
    }, {});
  }
};