'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductEntityState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductEntityState.hasMany(models.ProductEntity);
    }
  }
  ProductEntityState.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductEntityState',
    paranoid: true,
    underscored: true
  });
  return ProductEntityState;
};