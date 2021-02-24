'use strict';

const { SUBJECTS, TRIPOS_PARTS } = require('../enums');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for(const part of Object.keys(TRIPOS_PARTS)){
      let subjectsForPart = SUBJECTS[part];
      if (!subjectsForPart ) continue;
      let subjectKeys = Object.keys(subjectsForPart);
      let topicsToInsert = subjectKeys.map(key => {
        return {
          name: key,
          description: `All questions in ${SUBJECTS[part][key]}`,
          uuid: uuidv4(),
          isRootLevel: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      await queryInterface.bulkInsert('Topics', topicsToInsert);
    }

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
