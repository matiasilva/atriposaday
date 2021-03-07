'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const folderPath = path.join(__dirname, '../../', 'splicer', 'data', 'json');

    const files = fs.readdirSync(folderPath);

    for (let i = 0; i < files.length; i++) {
      const topicFile = fs.readFileSync(path.join(folderPath, files[i]));
      const json = JSON.parse(topicFile);

      const parentTopic = await queryInterface.rawSelect('topics', {
        where:
        {
          parentId: null,
          name: json['parent']
        }
      }, ['id']);

      const arr = Object.values(json["topics"]);
      arr.forEach(t => {
        // should be parentTopic.id
        t.parentId = parentTopic;
        t.createdAt = new Date();
        t.updatedAt = new Date();
      }
      );
      await queryInterface.bulkInsert('topics', arr, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('topics', {
      parentId:
        { [Sequelize.Op.not]: null }
    }, {});
  }
};
