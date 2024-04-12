'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ValutaSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ValutaSetting.init({
    name: DataTypes.STRING,
    short: DataTypes.STRING,
    symbol: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ValutaSetting',
    paranoid: true,
    underscored: true
  });
  return ValutaSetting;
};