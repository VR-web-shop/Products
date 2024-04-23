'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.TransactionState.hasMany(models.ProductDescription, {
        foreignKey: 'transaction_state_name',
        sourceKey: 'name'
      });
      models.TransactionState.hasMany(models.ProductEntityDescription, {
        foreignKey: 'transaction_state_name',
        sourceKey: 'name'
      });
    }
  }
  TransactionState.init({
    name: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'TransactionState',
  });
  return TransactionState;
};