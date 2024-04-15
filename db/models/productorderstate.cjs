'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrderState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ProductOrderState.hasMany(models.ProductOrderDescription);
      models.ProductOrderState.belongsToMany(models.ProductOrder, {
        through: models.ProductOrderDescription,
        foreignKey: 'product_order_state_name',
        otherKey: 'product_client_side_uuid'
      });
    }
  }
  ProductOrderState.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
  }, {
    sequelize,
    modelName: 'ProductOrderState',
    paranoid: true,
    underscored: true
  });
  return ProductOrderState;
};