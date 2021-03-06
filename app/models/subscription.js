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
        },
        as: 'user'
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

    static getNextTime(freq, time) {
      // push back current time by freq
      const newDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * freq));
      newDate.setHours(time.getHours(), time.getMinutes());
      return newDate;
    }

    getNextTime() {
      // instance method when the instance is fully formed
      // push back current time by freq
      const nextTime = Subscription.getNextTime(this.repeatDayFrequency, this.repeatTime);
      return nextTime;
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
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'topics',
        key: 'id'
      },
    }
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
  });
  return Subscription;
};