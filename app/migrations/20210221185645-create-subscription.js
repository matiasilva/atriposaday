'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // unique id
      uuid: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      // every how many days?
      repeatDayFrequency: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      // at what time?
      repeatTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      nextActioned: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      // how many questions?
      count: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
      },
      topicId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'topics',
          key: 'id'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('subscriptions');
  }
};