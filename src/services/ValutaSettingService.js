import valutasetting from "../../db/models/valutasetting.cjs";
import db from "../../db/models/index.cjs";

const Model = valutasetting(db.sequelize, db.Sequelize.DataTypes);

const find = async (name) => {
    const valutaSetting = await Model.findOne({ where: { name } });
    if (!valutaSetting) {
        throw new Error('Valuta Setting not found');
    }
    return valutaSetting;
}

const findAll = async (limit=10, offset=0) => {
    return await Model.findAll({ limit, offset });
}

const create = async (name, short, symbol, active=false) => {
    const valutaSetting = await Model.findOne({ where: { name } });
    if (valutaSetting) {
        throw new Error('Valuta Setting with ' + name + ' already exists');
    } 
    
    return await Model.create({ name, short, symbol, active });
}

const update = async (name, short, symbol, active=false) => {
    const valutaSetting = await find(name);
    await valutaSetting.update({ short, symbol, active })
    return valutaSetting;
}

const remove = async (name) => {
    const valutaSetting = await find(name);
    await valutaSetting.destroy();
}

export default {
    find,
    findAll,
    create,
    update,
    remove
};
