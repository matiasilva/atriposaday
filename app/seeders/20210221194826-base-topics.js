'use strict';

const { PAPERS } = require('../enums');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Topics', PAPERS.map(paper => {
      return {
        name: paper,
        description: `All questions in ${paper}`,
        subLevel: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Topics', null, {});
  }
};
