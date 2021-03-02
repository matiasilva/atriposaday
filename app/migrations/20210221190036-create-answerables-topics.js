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
      answerableId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'answerables',
          key: 'id'
        }
      },
      topicId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'topics',
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

    await queryInterface.addConstraint('answerables_topics',  ['answerableId', 'topicId'], {
      type: 'unique',
      name: 'user_topic_id_constraint'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('answerables_topics');
  }
};