'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answerable extends Model {
    static associate(models) {
      // Many-to-many topic <-> question
      Answerable.belongsToMany(models["Topic"], { through: models["AnswerablesTopics"] });
    }
  }
  Answerable.init({
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    difficulty: {
      // value from 1-5
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    examYear: {
      // 1999, 2001, etc
      type: DataTypes.DATE,
      allowNull: true
    },
    cohortYear: {
      // 1A, 1B, 2A, 2B
      type: DataTypes.DATE,
      allowNull: false
    },
    paper: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Answerable',
    tableName: 'Answerables',
  });
  return Answerable;
};