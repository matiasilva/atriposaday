'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Answerables_Topics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AnswerableId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: "Answerables",
          key: 'id'
        }
      },
      TopicId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: "Topics",
          key: 'id'
        }
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
    await queryInterface.dropTable('Answerables_Topics');
  }
};