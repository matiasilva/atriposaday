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
      },
      allowNull: false,
      onDelete: 'CASCADE'
    },
    topicId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'topics',
        key: 'id'
      },
      allowNull: false,
      onDelete: 'CASCADE'
    },
  }, {
    sequelize,
    modelName: 'AnswerablesTopics',
    tableName: 'answerables_topics',
  });
  return AnswerablesTopics;
};