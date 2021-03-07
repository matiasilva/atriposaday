'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    static associate({ AnswerablesTopics, Answerable, Subscription, Topic }) {
      // Many-to-many topic <-> question
      this.belongsToMany(Answerable, {
        through: AnswerablesTopics,
        as: 'answerables',
        foreignKey: 'topicId'
      });

      // One-to-Many topic -> subs
      this.hasMany(Subscription, { foreignKey: 'topicId', as: 'subscriptions' });

      this.hasOne(Topic, { foreignKey: 'parentId', as: 'parent' });
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
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'topics',
        key: 'id'
      },
    },
  }, {
    sequelize,
    modelName: 'Topic',
    tableName: 'topics',
  });
  return Topic;
};