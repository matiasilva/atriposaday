'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('answerables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      difficulty: {
        // value from 1-5
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      isHidden: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      paperId: {
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
    await queryInterface.dropTable('answerables');
  }
};