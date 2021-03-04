'use strict';
module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    await queryInterface.createTable('user_answerable_stats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      answerableId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'answerables',
          key: 'id'
        },
        // this doesn't really do anything
        unique: 'compositeIndex',
        onDelete: 'CASCADE'
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        unique: 'compositeIndex',
        onDelete: 'CASCADE'
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

    await queryInterface.addConstraint('user_answerable_stats', {
      type: 'unique',
      fields: ['answerableId', 'userId'],
      name: 'user_answerable_id_constraint'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_answerable_stats');
  }
};