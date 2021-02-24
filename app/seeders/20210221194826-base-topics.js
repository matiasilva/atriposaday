'use strict';

const { SUBJECTS, TRIPOS_PARTS } = require('../enums');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for(const part of Object.keys(TRIPOS_PARTS)){
      let subj_enums = Object.keys(SUBJECTS[part]);
      if (!subj_enums) continue;
      subj_enums.map(subj_key => {
        return {
          name: subj_key,
          description: `All questions in ${SUBJECTS[part][subj_key]}`,
          uuid: uuidv4(),
          isRootLevel: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      await queryInterface.bulkInsert('Topics', subj_enums);
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
