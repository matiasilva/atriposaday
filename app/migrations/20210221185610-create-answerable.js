'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Answerables', {
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
      image: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      examYear: {
        // 1999, 2001, etc
        type: Sequelize.DataTypes.DATE,
        allowNull: true
      },
      cohortYear: {
        // 1A, 1B, 2A, 2B
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      paper: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('Answerables');
  }
};