'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('users', [{
      name: 'Matias Silva',
      crsid: '',
      email: '',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Jeremy Feng',
      crsid: '',
      email: '',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { name: ['Matias Silva', 'Jeremy Feng'] });
  }
};
