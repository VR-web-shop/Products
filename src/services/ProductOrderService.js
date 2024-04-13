import productorder from "../../db/models/productorder.cjs";
import db from "../../db/models/index.cjs";

const Model = productorder(db.sequelize, db.Sequelize.DataTypes);

const find = async (uuid) => {
    const productOrder = await Model.findOne({ where: { uuid } });
    if (!productOrder) {
        throw new Error('Product Order not found');
    }
    return productOrder;
}

const findAll = async (limit=10, offset=0) => {
    return await Model.findAll({ limit, offset });
}

const create = async (
    name, 
    email, 
    address, 
    city, 
    country, 
    postal_code, 
    deliver_option_name,
    payment_option_name,
    product_order_state_name
) => {
    return await Model.create({ 
        name, 
        email, 
        address, 
        city, 
        country, 
        postal_code, 
        deliver_option_name,
        payment_option_name,
        product_order_state_name
    });
}

const update = async (
    uuid, 
    name, 
    email, 
    address, 
    city, 
    country, 
    postal_code, 
    deliver_option_name,
    payment_option_name,
    product_order_state_name
) => {

    const productOrder = await find(uuid);
    await productOrder.update({ 
        name, 
        email, 
        address, 
        city, 
        country, 
        postal_code, 
        deliver_option_name,
        payment_option_name,
        product_order_state_name
    })
    return productOrder;
}

const remove = async (uuid) => {
    const productOrder = await find(uuid);
    await productOrder.destroy();
}

export default {
    find,
    findAll,
    create,
    update,
    remove
};
