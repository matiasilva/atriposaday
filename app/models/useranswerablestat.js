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
    static associate({ Answerable }) {
      this.belongsTo(Answerable, { foreignKey: 'answerableId'});
    }

  }
  UserAnswerableStat.init({
    answerableId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'answerables',
        key: 'id'
      },
      unique: 'compositeIndex',
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: 'compositeIndex',
      onDelete: 'CASCADE'
    },
    hasAnswered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    dateAnswered: {
      type: DataTypes.DATE,
      allowNull: true
    },
    hasBookmarked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    dateBookmarked: {
      type: DataTypes.DATE,
      allowNull: true
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'UserAnswerableStat',
    tableName: 'user_answerable_stats',
    hooks: {
      beforeUpdate: (stat, options) => {
        const hasBookmarkedChanged = stat.previous('hasBookmarked') !== stat.getDataValue('hasBookmarked');
        if (hasBookmarkedChanged) stat.dateBookmarked = Date.now();

        const hasAnsweredChanged = stat.previous('hasAnswered') !== stat.getDataValue('hasAnswered');
        if (hasAnsweredChanged) stat.dateAnswered = Date.now();
      }
    },
  });
  return UserAnswerableStat;
};