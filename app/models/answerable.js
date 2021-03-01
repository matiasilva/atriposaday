'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answerable extends Model {
    static associate({ Topic, Paper, AnswerablesTopics, Asset, UserAnswerableStat, User }) {
      // Many-to-many topic <-> question
      this.belongsToMany(Topic, {
        through: AnswerablesTopics,
        as: 'topics',
        foreignKey: 'answerableId'
      });

      // Many-to-many user <-> question
      this.belongsToMany(User, {
        through: UserAnswerableStat,
        as: 'userStats',
        foreignKey: 'answerableId',
        otherKey:'userId'
      });

      // One-to-Many paper -> questions
      this.belongsTo(Paper, {
        foreignKey: {
          name: 'paperId',
          allowNull: false,
        },
        as: 'paper'
      });

      // One-to-Many answerable -> assets
      this.hasMany(Asset, {
        foreignKey: 'answerableId', as: 'assets'
      });
    }

  }
  Answerable.init({
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
  }, {
    sequelize,
    modelName: 'Answerable',
    tableName: 'answerables',
  });
  return Answerable;
};