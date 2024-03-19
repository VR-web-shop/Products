import { DataTypes } from 'sequelize';
import Database from './Database.js';
import ProductEntityState from './ProductEntityState.js';

const ProductEntity = Database.define("ProductEntity", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

ProductEntity.belongsTo(ProductEntityState);
ProductEntityState.hasMany(ProductEntity);

export default ProductEntity;
