import PaymentOptionRead from "../models/PaymentOptionRead.js";
import ModelQueryService from "./ModelQueryService.js";

const service = ModelQueryService(PaymentOptionRead());

const find = async (name) => {
    const paymentOption = await Model.findOne({ where: { name } });
    if (!paymentOption) {
        throw new Error('Payment option not found');
    }
    return paymentOption;
}

const findAll = async (limit=10, offset=0) => {
    return await Model.findAll({ limit, offset });
}

const findAllWhere = async (where) => {
    return await Model.findAll({ where });
}

const create = async (name, price) => {
    const paymentOption = await Model.findOne({ where: { name } });
    if (paymentOption) {
        throw new Error('Payment option with ' + name + ' already exists');
    }

    return await Model.create({ name, price });
}

const update = async (name, price) => {
    const paymentOption = await find(name);
    await paymentOption.update({ price })
    return paymentOption;
}

const remove = async (name) => {
    const paymentOption = await find(name);
    await paymentOption.destroy();
}

export default {
    find,
    findAll,
    findAllWhere,
    create,
    update,
    remove
};
