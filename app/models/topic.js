'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    static associate(models) {
      // Many-to-many topic <-> question
      Topic.belongsToMany(models["Answerable"], { through: models["AnswerablesTopics"] });

      // One-to-Many topic -> subs
      Topic.hasMany(models["Subscription"]);
    }
  }
  Topic.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subLevel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Topic',
    tableName: 'Topics',
  });
  return Topic;
};