import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const VALUTA_SETTINGS = {
    EURO: { name: 'Euro', short: 'EUR', symbol: '€', active: false },
    US_DOLLAR: { name: 'US Dollar', short: 'USD', symbol: '$', active: false },
    BRITISH_POUND: { name: 'British Pound', short: 'GBP', symbol: '£', active: false },
    DANSIH_KRONE: { name: 'Danish Krone', short: 'DKK', symbol: 'kr', active: true },
}

const ValutaSetting = Database.define("ValutaSetting", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    short: {
        type: DataTypes.STRING,
        allowNull: false
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default ValutaSetting;
