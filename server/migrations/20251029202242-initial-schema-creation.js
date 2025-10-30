'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Dodajemy kolumnę 'refresh_token' do tabeli 'users'
    await queryInterface.addColumn('users', 'refresh_token', {
      type: Sequelize.STRING(512),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Usuwamy kolumnę 'refresh_token' w przypadku cofania migracji
    await queryInterface.removeColumn('users', 'refresh_token');
  }
};
