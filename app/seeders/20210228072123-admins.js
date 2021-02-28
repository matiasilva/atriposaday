'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('users', [{
      name: 'Matias Silva',
      crsid: '',
      email: '',
      isAdmin: true
    }, {
      name: 'Jeremy Feng',
      crsid: '',
      email: '',
      isAdmin: true
    }], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { name: ['Matias Silva', 'Jeremy Feng'] });
  }
};
