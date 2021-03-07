'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('topics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        unique: 'topicCompositeIndex',
        allowNull: false
      },
      prettyName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      parentId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'topics',
          key: 'id'
        },
        unique: 'topicCompositeIndex',
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

    await queryInterface.addConstraint('topics', {
      type: 'unique',
      fields: ['name', 'parentId'],
      name: 'topic_name_parent_constraint'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('topics');
  }
};