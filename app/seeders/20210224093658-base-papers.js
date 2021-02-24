'use strict';

const { SUBJECTS, TRIPOS_PARTS } = require('../enums');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const yearCount = new Date().getFullYear() - 1996 + 1;
    const years = new Array(yearCount).fill().map((elt, i) => 1996 + i);
    for (let i = 0; i < yearCount; i++) {
      const year = years[i];
      for (const part of Object.keys(TRIPOS_PARTS)) {
        let keysForPart = SUBJECTS[part];
        if (!keysForPart ) continue;
        let subjectKeys = Object.keys(keysForPart);
        if (!subjectKeys) continue;
        let papersToInsert = subjectKeys.map(key => {
          return {
            type: "EXAM",
            subject: key,
            triposPart: part,
            year, 
            uuid: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        await queryInterface.bulkInsert('papers', papersToInsert);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('papers', null, {});
  }
};
