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
      ProductOrder.belongsTo(models.DeliverOption, { foreignKey: 'deliver_option_name', targetKey: 'name', as: 'DeliverOption' });
      ProductOrder.belongsTo(models.PaymentOption, { foreignKey: 'payment_option_name', targetKey: 'name', as: 'PaymentOption' });
      ProductOrder.belongsTo(models.ProductOrderState, { foreignKey: 'product_order_state_name', targetKey: 'name' });
      ProductOrder.belongsToMany(models.ProductEntity, { through: models.ProductOrderEntity });
      ProductOrder.hasMany(models.ProductOrderEntity);
    }
  }
  ProductOrder.init({
    uuid: DataTypes.UUID,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    deliver_option_name: DataTypes.STRING,
    payment_option_name: DataTypes.STRING,
    product_order_state_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductOrder',
    paranoid: true,
    underscored: true
  });
  return ProductOrder;
};
