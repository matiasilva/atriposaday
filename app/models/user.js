'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Subscription, Answerable, UserAnswerableStat }) {
      // One-to-Many user -> subs
      this.hasMany(Subscription, {
        foreignKey: 'userId',
        as: 'subscriptions',
        onDelete: 'CASCADE'
      });

      // Many-to-many user <-> question
      this.belongsToMany(Answerable, {
        through: UserAnswerableStat,
        as: 'answerableStats',
        foreignKey: 'userId',
        otherKey: 'answerableId'
      });

      this.hasMany(UserAnswerableStat, {
        foreignKey: 'userId',
        as: 'stats',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    crsid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });
  return User;
};