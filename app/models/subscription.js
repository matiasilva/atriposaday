'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      // One-to-Many user -> subs
      Subscription.belongsTo(models["User"]);

      // One-to-Many topic -> subs
      Subscription.belongsTo(models["Topic"], {
        foreignKey: {
          name: 'topicId',
          allowNull: false
        }
      });
    }
  }
  Subscription.init({
    // unique id
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // every how many days?
    repeatDayFrequency: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // at what time?
    repeatTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lastActioned: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    // how many questions?
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'Subscriptions',
  });
  return Subscription;
};