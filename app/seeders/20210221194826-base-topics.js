'use strict';

const { PAPERS } = require('../enums');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Topics', Object.entries(PAPERS).map(paper_obj => {
      return {
        name: paper_obj[1],
        description: `All questions in ${paper_obj[1]}`,
        uuid: uuidv4(),
        isRootLevel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }));

    await queryInterface.bulkInsert('Topics', [{
      name: "NO_TOPIC",
      description: "For any question that has no base topic",
      uuid: uuidv4(),
      isRootLevel: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Topics', null, {});
  }
};
