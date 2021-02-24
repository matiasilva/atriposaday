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
    AnswerableId: {
      type: DataTypes.INTEGER,
      references: {
        model: "answerables",
        key: 'id'
      }
    },
    TopicId: {
      type: DataTypes.INTEGER,
      references: {
        model: "topics",
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