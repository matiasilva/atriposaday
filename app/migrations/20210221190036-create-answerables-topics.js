'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('answerables_topics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AnswerableId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: "answerables",
          key: 'id'
        }
      },
      TopicId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: "topics",
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
    await queryInterface.dropTable('answerables_topics');
  }
};