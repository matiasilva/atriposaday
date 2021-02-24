'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answerable extends Model {
    static associate(models) {
      // Many-to-many topic <-> question
      Answerable.belongsToMany(models["Topic"], { through: models["AnswerablesTopics"] });

      // One-to-Many paper -> questions
      Answerable.belongsTo(models["Paper"], {
        foreignKey: {
          name: 'paperId',
          allowNull: false
        }
      });
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
  }, {
    sequelize,
    modelName: 'Answerable',
    tableName: 'Answerables',
  });
  return Answerable;
};