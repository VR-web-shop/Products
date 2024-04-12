import { DataTypes } from 'sequelize';
import Database from '../config/DatabaseConfig.js';

const ProductOrderEntity = Database.define("ProductOrderEntity", {
    uuid: {
        type: DataTypes.UUID,
        primaryKey: true
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default ProductOrderEntity;
