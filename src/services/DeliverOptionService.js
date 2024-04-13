import deliveroption from "../../db/models/deliveroption.cjs";
import db from "../../db/models/index.cjs";

const Model = deliveroption(db.sequelize, db.Sequelize.DataTypes);

const find = async (name) => {
    const deliverOption = await Model.findOne({ where: { name } });
    if (!deliverOption) {
        throw new Error('Deliver option not found');
    }
    return deliverOption;
}

const findAll = async (limit=10, offset=0) => {
    return await Model.findAll({ limit, offset });
}

const create = async (name, price) => {
    const deliverOption = await Model.findOne({ where: { name } });
    if (deliverOption) {
        throw new Error('Deliver option with ' + name + ' already exists');
    }

    return await Model.create({ name, price });
}

const update = async (name, price) => {
    const deliverOption = await find(name);
    await deliverOption.update({ price })
    return deliverOption;
}

const remove = async (name) => {
    const deliverOption = await find(name);
    await deliverOption.destroy();
}

export default {
    find,
    findAll,
    create,
    update,
    remove
};
