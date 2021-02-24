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
        let subj_enums = Object.keys(SUBJECTS[part]);
        if (!subj_enums) continue;
        subj_enums.map(subject => {
          return {
            type: "EXAM",
            subject,
            triposPart: part,
            year, 
            uuid: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        await queryInterface.bulkInsert('Papers', subj_enums);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Papers', null, {});
  }
};
