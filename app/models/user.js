'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Subscription, UserAnswerableStat }) {
      // One-to-Many user -> subs
      this.hasMany(Subscription, { foreignKey: 'userId', as: 'user' });

      // Many-to-many user <-> question
      this.belongsToMany(User, {
        through: UserAnswerableStat,
        as: 'answerableStats',
        foreignKey: 'userId',
        otherKey: 'answerableId'
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