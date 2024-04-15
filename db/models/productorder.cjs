'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /*
      ProductOrder.belongsTo(models.DeliverOption, { foreignKey: 'deliver_option_name', targetKey: 'client_side_uuid', as: 'DeliverOption' });
      ProductOrder.belongsTo(models.PaymentOption, { foreignKey: 'payment_option_name', targetKey: 'name', as: 'PaymentOption' });
      ProductOrder.belongsTo(models.ProductOrderState, { foreignKey: 'product_order_state_name', targetKey: 'name' });
      ProductOrder.belongsToMany(models.ProductEntity, { through: models.ProductOrderEntity });
      ProductOrder.hasMany(models.ProductOrderEntity);
      */
      models.ProductOrder.hasMany(models.ProductEntityDescription, {
        foreignKey: 'product_order_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.ProductOrder.hasMany(models.ProductEntityRemoved, {
        foreignKey: 'product_order_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  ProductOrder.init({
    client_side_uuid: {
      type: DataTypes.STRING,
      field: 'client_side_uuid',
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    }
  }, {
    sequelize,
    modelName: 'ProductOrder'
  });
  return ProductOrder;
};
