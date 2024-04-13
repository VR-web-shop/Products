import productorderentity from "../../db/models/productorderentity.cjs";
import db from "../../db/models/index.cjs";

const Model = productorderentity(db.sequelize, db.Sequelize.DataTypes);

const find = async (uuid) => {
    const productOrderEntity = await Model.findOne({ where: { uuid } });
    if (!productOrderEntity) {
        throw new Error('Product Order Entity not found');
    }
    return productOrderEntity;
}

const findAll = async (limit=10, offset=0) => {
    return await Model.findAll({ limit, offset });
}

const create = async (product_order_uuid, product_entity_uuid) => {
    return await Model.create({ product_order_uuid, product_entity_uuid });
}

const update = async (uuid, product_order_uuid, product_entity_uuid) => {
    const productOrderEntity = await find(uuid);
    await productOrderEntity.update({ product_order_uuid, product_entity_uuid })
    return productOrderEntity;
}

const remove = async (uuid) => {
    const productOrderEntity = await find(uuid);
    await productOrderEntity.destroy();
}

export default {
    find,
    findAll,
    create,
    update,
    remove
};
