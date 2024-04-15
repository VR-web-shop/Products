import MiddlewareJWT from "../jwt/MiddlewareJWT.js";
import deliveroption from "../../db/models/deliveroption.cjs";
import db from "../../db/models/index.cjs";

const DeliverOptionService = (
    context = null,
    permission = null,
    contextHandler = MiddlewareJWT.AuthorizeContextHandler,
    Model = deliveroption(db.sequelize, db.Sequelize.DataTypes),
) => {
    if (context) contextHandler(context, permission)

    const find = async (name) => {
        const deliverOption = await Model.findOne({ where: { name } });
        if (!deliverOption) {
            throw new Error('Deliver option not found');
        }

        return deliverOption;
    }

    const findAll = async (limit = 10, offset = 0) => {
        return await Model.findAll({ limit, offset });
    }

    const findAllWhere = async (where) => {
        return await Model.findAll({ where });
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

    return {
        find,
        findAll,
        findAllWhere,
        create,
        update,
        remove
    }
}

export default DeliverOptionService;