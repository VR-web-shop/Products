import { DataTypes } from 'sequelize';
import Database from '../config/DatabaseConfig.js';
import ProductEntityState from './ProductEntityState.js';

const ProductEntity = Database.define("ProductEntity", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
}, {
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

ProductEntity.belongsTo(ProductEntityState, { foreignKey: 'product_entity_state_name', targetKey: 'name' });
ProductEntityState.hasMany(ProductEntity);

export default ProductEntity;
