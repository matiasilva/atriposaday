'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAnswerableStat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserAnswerableStat.init({
    answerableId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'answerables',
        key: 'id'
      },
      unique: 'compositeIndex'
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: 'compositeIndex'
    },
    hasAnswered: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    hasBookmarked: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'UserAnswerableStat',
    tableName: 'user_answerable_stats'
  });
  return UserAnswerableStat;
};