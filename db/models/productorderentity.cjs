'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrderEntity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductOrderEntity.belongsTo(models.ProductOrder, { foreignKey: 'product_order_uuid', targetKey: 'uuid', as: 'ProductOrder' });
      ProductOrderEntity.belongsTo(models.ProductEntity, { foreignKey: 'product_entity_uuid', targetKey: 'uuid', as: 'ProductEntity' });
    }
  }
  ProductOrderEntity.init({
    uuid: DataTypes.UUID,
    product_order_uuid: DataTypes.UUID,
    product_entity_uuid: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'ProductOrderEntity',
    paranoid: true,
    underscored: true
  });
  return ProductOrderEntity;
};