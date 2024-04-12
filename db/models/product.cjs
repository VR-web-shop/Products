'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.ProductEntity);
    }
  }
  Product.init({
    uuid: DataTypes.UUID,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    thumbnail_source: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Product',
    paranoid: true,
    underscored: true
  });
  return Product;
};