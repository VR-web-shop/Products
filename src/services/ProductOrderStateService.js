import productorderstate from "../../db/models/productorderstate.cjs";
import db from "../../db/models/index.cjs";

const Model = productorderstate(db.sequelize, db.Sequelize.DataTypes);

const find = async (name) => {
    const productOrderState = await Model.findOne({ where: { name } });
    if (!productOrderState) {
        throw new Error('Product Order State not found');
    }
    return productOrderState;
}

const findAll = async (limit=10, offset=0) => {
    return await Model.findAll({ limit, offset });
}

const findAllWhere = async (where) => {
    return await Model.findAll({ where });
}

const create = async (name) => {
    const productOrderState = await Model.findOne({ where: { name } });
    if (productOrderState) {
        throw new Error('Product Order State with ' + name + ' already exists');
    }

    return await Model.create({ name });
}

const remove = async (name) => {
    const productOrderState = await find(name);
    await productOrderState.destroy();
}

export default {
    find,
    findAll,
    findAllWhere,
    create,
    //update, Not needed for this service
    remove
};
