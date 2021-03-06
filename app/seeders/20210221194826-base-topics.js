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
          prettyName: SUBJECTS[part][key],
          description: `All questions in ${SUBJECTS[part][key]}`,
          uuid: uuidv4(),
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
      await queryInterface.bulkInsert('topics', topicsToInsert);
    }

    await queryInterface.bulkInsert('topics', [{
      name: 'NO_TOPIC',
      prettyName: 'No topic',
      description: 'For any question that has no base topic',
      uuid: uuidv4(),
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('topics', null, {});
  }
};
