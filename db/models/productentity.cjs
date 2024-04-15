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
      //ProductEntity.belongsTo(models.Product, { foreignKey: 'product_uuid', sourceKey: 'uuid', as: 'ProductEntity' });
      //ProductEntity.belongsTo(models.ProductEntityState, { foreignKey: 'product_entity_state_name', targetKey: 'name' });
      //ProductEntity.belongsToMany(models.ProductOrder, { through: models.ProductOrderEntity });
      //ProductEntity.hasMany(models.ProductOrderEntity);

      models.ProductEntity.hasMany(models.ProductEntityDescription, {
        foreignKey: 'product_entity_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.ProductEntity.hasMany(models.ProductEntityRemoved, {
        foreignKey: 'product_entity_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  ProductEntity.init({
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
    modelName: 'ProductEntity'
  });
  return ProductEntity;
};