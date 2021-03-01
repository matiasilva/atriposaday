'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate({ User, Topic }) {
      // One-to-Many user -> subs
      this.belongsTo(User, {
        foreignKey: {
          name: 'userId',
          allowNull: true
        }
      });

      // One-to-Many topic -> subs
      this.belongsTo(Topic, {
        foreignKey: {
          name: 'topicId',
          allowNull: false
        },
        as: 'topic'
      });
    }
  }
  Subscription.init({
    // unique id
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
    nextActioned: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // how many questions?
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
  });
  return Subscription;
};