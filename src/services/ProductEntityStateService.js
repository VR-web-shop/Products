import productentitystate from "../../db/models/productentitystate.cjs";
import db from "../../db/models/index.cjs";

const Model = productentitystate(db.sequelize, db.Sequelize.DataTypes);

const find = async (name) => {
    const productEntityState = await Model.findOne({ where: { name } });
    if (!productEntityState) {
        throw new Error('Product Entity State not found');
    }
    return productEntityState;
}

const findAll = async (limit=10, offset=0) => {
    return await Model.findAll({ limit, offset });
}

const create = async (name) => {
    const productEntityState = await Model.findOne({ where: { name } });
    if (productEntityState) {
        throw new Error('Product Entity State with ' + name + ' already exists');
    }

    return await Model.create({ name });
}

const remove = async (name) => {
    const productEntityState = await find(name);
    await productEntityState.destroy();
}

export default {
    find,
    findAll,
    create,
    //update, Not needed for this service
    remove
};
