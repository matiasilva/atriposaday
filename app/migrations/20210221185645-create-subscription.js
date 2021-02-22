'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // unique id
      uuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
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
      lastActioned: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      // how many questions?
      count: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('Subscriptions');
  }
};