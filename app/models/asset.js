'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Answerable }) {
      // one -> many between asset and answerable
      // One-to-Many topic -> subs
      this.belongsTo(Answerable, {
        foreignKey: {
          name: 'answerableId',
          allowNull: false
        },
        as: 'answerable'
      });
    }
  }
  Asset.init({
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isMainAsset: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    answerableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'answerables',
        key: 'id'
      },
    },
  }, {
    sequelize,
    modelName: 'Asset',
    tableName: 'assets'
  });
  return Asset;
};