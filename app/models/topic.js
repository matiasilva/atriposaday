'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    static associate({ AnswerablesTopics, Answerable, Subscription }) {
      // Many-to-many topic <-> question
      this.belongsToMany(Answerable, {
        through: AnswerablesTopics,
        as: "answerables",
        foreignKey: "topicId"
      });

      // One-to-Many topic -> subs
      this.hasMany(Subscription, { foreignKey: 'topicId', as: 'subscriptions' });
    }
  }
  Topic.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prettyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    isRootLevel: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Topic',
    tableName: 'topics',
  });
  return Topic;
};