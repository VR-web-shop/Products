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
      models.ValutaSetting.hasMany(models.ValutaSettingDescription, {
        foreignKey: 'valuta_setting_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.ValutaSetting.hasMany(models.ValutaSettingRemoved, {
        foreignKey: 'valuta_setting_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  ValutaSetting.init({
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
    modelName: 'ValutaSetting'
  });
  return ValutaSetting;
};