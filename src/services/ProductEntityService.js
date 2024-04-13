import productentity from "../../db/models/productentity.cjs";
import db from "../../db/models/index.cjs";

const Model = productentity(db.sequelize, db.Sequelize.DataTypes);

const find = async (uuid) => {
    const productEntity = await Model.findOne({ where: { uuid } });
    if (!productEntity) {
        throw new Error('Product Entity not found');
    }
    return productEntity;
}

const findAll = async (limit=10, offset=0) => {
    return await Model.findAll({ limit, offset });
}

const findAllWhere = async (where) => {
    return await Model.findAll({ where });
}

const create = async (product_entity_state_name, product_uuid) => {
    return await Model.create({ product_entity_state_name, product_uuid });
}

const update = async (uuid, product_entity_state_name, product_uuid) => {
    const productEntity = await find(uuid);
    await productEntity.update({ product_entity_state_name, product_uuid })
    return productEntity;
}

const remove = async (uuid) => {
    const productEntity = await find(uuid);
    await productEntity.destroy();
}

export default {
    find,
    findAll,
    findAllWhere,
    create,
    update,
    remove
};
