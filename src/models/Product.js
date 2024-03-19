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
});

Product.hasMany(ProductEntity);
ProductEntity.belongsTo(Product);

export default Product;
