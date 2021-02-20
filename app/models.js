const { DataTypes, Model, Sequelize } = require('sequelize');
const { db } = require('./database');
const { PAPERS } = require('./enums');

class Answerable extends Model { }

Answerable.init({
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    difficulty: {
        // value from 1-5
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isHidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    examYear: {
        // 1999, 2001, etc
        type: DataTypes.DATE,
        allowNull: true
    },
    cohortYear: {
        // 1A, 1B, 2A, 2B
        type: DataTypes.DATE,
        allowNull: false
    },
    paper: {
        type: DataType.ENUM,
        values: PAPERS,
        allowNull: true,
    },
}, {
    sequelize: db,
    modelName: 'Answerable',
    tableName: 'answerables',
});

class Topic extends Model { }

Topic.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subLevel: {
        type: DataTypes.INTEGER,
        allowNull: false 
    }
}, {
    sequelize: db,
    modelName: 'Topic',
    tableName: 'topics',
});

// Junction table
const AnswerablesTopics = sequelize.define('AnswerablesTopics', {
    AnswerableId: {
      type: DataTypes.INTEGER,
      references: {
        model: Answerable,
        key: 'id'
      }
    },
    TopicId: {
      type: DataTypes.INTEGER,
      references: {
        model: Topic,
        key: 'id'
      }
    }
  });
  Answerable.belongsToMany(Topic, { through: AnswerablesTopics });
  Topic.belongsToMany(Answerable, { through: AnswerablesTopics });

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    crsid: {
        type: DataTypes.STRING,
        allowNull: true 
    },
}, {
    sequelize: db,
    modelName: 'User',
    tableName: 'users',
});

Subscription.init({
    // every how many days?
    repeatDayFrequency: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // at what time?
    repeatTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    lastActioned: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    // how many questions?
    count: {
        type: DataTypes.INTEGER,
        allowNull: false 
    }
}, {
    sequelize: db,
    modelName: 'Subscription',
    tableName: 'subscriptions',
});

// One-to-Many user -> subs
User.hasMany(Subscription);
Subscription.belongsTo(User);

// One-to-Many topic -> subs
Topic.hasMany(Subscription);
Subscription.belongsTo(Topic, {
    foreignKey: {
      name: 'topicId',
      allowNull: false
    }
  });

