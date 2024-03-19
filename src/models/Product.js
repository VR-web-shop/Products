import { DataTypes } from 'sequelize';
import Database from './Database.js';
import ProductEntity from './ProductEntity.js';

const Product = Database.define("Product", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Product.hasMany(ProductEntity, { foreignKey: 'product_uuid', sourceKey: 'uuid' });
ProductEntity.belongsTo(Product);

export default Product;
