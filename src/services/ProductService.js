import product from "../../db/models/product.cjs";
import db from "../../db/models/index.cjs";

const Model = product(db.sequelize, db.Sequelize.DataTypes);

const find = async (uuid) => {
    const product = await Model.findOne({ where: { uuid } });
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
}

const findAll = async (limit=10, offset=0) => {
    return await Model.findAll({ limit, offset });
}

const create = async (name, description, thumbnail_source, price) => {
    return await Model.create({ name, description, thumbnail_source, price });
}

const update = async (uuid, name, description, thumbnail_source, price) => {
    const product = await find(uuid);
    await product.update({ name, description, thumbnail_source, price })
    return product;
}

const remove = async (uuid) => {
    const product = await find(uuid);
    await product.destroy();
}

export default {
    find,
    findAll,
    create,
    update,
    remove
};
