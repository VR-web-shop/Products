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
    thumbnail_source: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
}, {
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Product.hasMany(ProductEntity);
ProductEntity.belongsTo(Product, { foreignKey: 'product_uuid', sourceKey: 'uuid', as: 'ProductEntity' });

export default Product;
