'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductEntity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductEntity.belongsTo(models.Product, { foreignKey: 'product_uuid', sourceKey: 'uuid', as: 'ProductEntity' });
      ProductEntity.belongsTo(models.ProductEntityState, { foreignKey: 'product_entity_state_name', targetKey: 'name' });
      ProductEntity.belongsToMany(models.ProductOrder, { through: models.ProductOrderEntity });
      ProductEntity.hasMany(models.ProductOrderEntity);
    }
  }
  ProductEntity.init({
    uuid: DataTypes.UUID,
    product_entity_state_name: DataTypes.STRING,
    product_uuid: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'ProductEntity',
    paranoid: true,
    underscored: true
  });
  return ProductEntity;
};