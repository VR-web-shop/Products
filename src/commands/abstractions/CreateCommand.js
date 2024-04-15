import ModelCommand from "../abstractions/ModelCommand.js";
import RequestError from "../../schemas/RequestError/RequestError.js";

export default class CreateCommand extends ModelCommand {
    constructor(pk, params, pkName, modelName) {
        super();
        if (!pk || typeof pk !== "string") {
            throw new Error("pk is required and must be a string");
        }

        if (!params || typeof params !== "object") {
            throw new Error("Params is required and must be an object");
        }

        if (!pkName || typeof pkName !== "string") {
            throw new Error("pkName is required and must be a string");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        this.pk = pk;
        this.params = params;
        this.pkName = pkName;
        this.modelName = modelName;
    }

    async execute(db) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const pk = this.pk;
        const pkName = this.pkName;
        const params = this.params;
        const modelName = this.modelName;

        try {
            await db.sequelize.transaction(async t => {
                const entity = await db[modelName].findOne(
                    { where: { [pkName]: pk } },
                    { transaction: t }
                );

                if (entity) {
                    throw new RequestError(400, `Entity with ${pkName} ${pk} already exists`);
                }

                await db[modelName].create(
                    { [pkName]: pk, ...params }, 
                    { transaction: t }
                );
            });
        } catch (error) {
            console.log(error)
            throw new Error("Error in create");
        }
    }
}
