'use strict';
module.exports = {
  up: async (queryInterface, {DataTypes}) => {
    await queryInterface.createTable('user_answerable_stats', {
      answerableId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'answerables',
          key: 'id'
        },
        unique: 'compositeIndex'
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        unique: 'compositeIndex'
      },
      hasAnswered: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      hasBookmarked: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      difficulty: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_answerable_stats');
  }
};