'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductEntityDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductEntityDescription.belongsTo(models.Product, {
        foreignKey: 'product_client_side_uuid',
        targetKey: 'client_side_uuid'
      });
      ProductEntityDescription.belongsTo(models.ProductEntityState, {
        foreignKey: 'product_entity_state_name',
        targetKey: 'name'
      });
      models.ProductEntityDescription.belongsTo(models.ProductEntity, { 
        foreignKey: 'product_entity_client_side_uuid', 
        targetKey: 'client_side_uuid'
      });
      models.ProductEntityDescription.hasMany(models.ProductOrderEntity);
    }
  }
  ProductEntityDescription.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    product_entity_state_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_entity_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ProductEntityDescription',
  });
  return ProductEntityDescription;
};