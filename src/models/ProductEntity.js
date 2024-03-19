import { DataTypes } from 'sequelize';
import Database from './Database.js';
import ProductEntityState from './ProductEntityState.js';

const ProductEntity = Database.define("Product_Entity", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});

ProductEntity.belongsTo(ProductEntityState);
ProductEntityState.hasMany(ProductEntity);

export default ProductEntity;
