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
        as: 'subscriptions'
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

    async sendMail(transporter) {
        await transporter.sendMail({
            from: '"A Tripos a Day" <atriposaday@srcf.net>',
            to: this.user.email,
            subject: `A Tripos a Day: ${this.name} question`,
            text: 'Hello world?',
        }, (err, info) => { if (err) console.error(err.message); });
    
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