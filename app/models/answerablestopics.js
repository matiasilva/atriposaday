'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnswerablesTopics extends Model {
    static associate(models) {
      // define association here
    }
  }
  // junction table
  AnswerablesTopics.init({
    answerableId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'answerables',
        key: 'id'
      }
    },
    topicId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'topics',
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'AnswerablesTopics',
    tableName: 'answerables_topics',
  });
  return AnswerablesTopics;
};