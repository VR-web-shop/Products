import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const PRODUCT_ENTITY_STATES = {
    WAITING_FOR_EMPLOYEE_COMPLETION: 'WAITING_FOR_EMPLOYEE_COMPLETION',
    AVAILABLE_FOR_PURCHASE: 'AVAILABLE_FOR_PURCHASE',
    RESERVERED_BY_CUSTOMER_CART: 'RESERVERED_BY_CUSTOMER_CART',
    RESERVERED_BY_CUSTOMER_ORDER: 'RESERVERED_BT_CUSTOMER_ORDER',
    SHIPPED_TO_CUSTOMER: 'SHIPPED_TO_CUSTOMER',
    DELIVERED_TO_CUSTOMER: 'DELIVERED_TO_CUSTOMER',
    RETURNED_BY_CUSTOMER: 'RETURNED_BY_CUSTOMER',
    DISCARDED_BY_EMPLOYEE: 'DISCARDED_BY_EMPLOYEE',
};

const ProductEntityState = Database.define("Product_Entity_State", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,  
    }
});

export default ProductEntityState;
