import ModelCommand from "../abstractions/ModelCommand.js";


export default class PutCommand extends ModelCommand {
    constructor(pk, params, pkName, fkName, casKeys, modelName, snapshotName, tombstoneName) {
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

        if (!fkName || typeof fkName !== "string") {
            throw new Error("fkName is required and must be a string");
        }

        if (!casKeys || !Array.isArray(casKeys)) {
            throw new Error("casKeys is required and must be an array");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        if (!snapshotName || typeof snapshotName !== "string") {
            throw new Error("snapshotName is required and must be a string");
        }

        if (!tombstoneName || typeof tombstoneName !== "string") {
            throw new Error("tombstoneName is required and must be a string");
        }

        this.pk = pk;
        this.params = params;
        this.pkName = pkName;
        this.fkName = fkName;
        this.casKeys = casKeys;
        this.modelName = modelName;
        this.snapshotName = snapshotName;
        this.tombstoneName = tombstoneName;
    }

    async execute(db) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const pk = this.pk;
        const pkName = this.pkName;
        const fkName = this.fkName;
        const casKeys = this.casKeys;
        const params = this.params;
        const modelName = this.modelName;
        const snapshotName = this.snapshotName;
        const tombstoneName = this.tombstoneName;

        try {
            await db.sequelize.transaction(async t => {
                let entity = await db[modelName].findOne(
                    { 
                        where: { [pkName]: pk },
                        include: [
                            { 
                                model: db[tombstoneName], 
                                limit: 1,
                                order: [["created_at", "DESC"]] 
                            },
                            { 
                                model: db[snapshotName], 
                                limit: 1,
                                order: [["created_at", "DESC"]] 
                            }
                        ]
                    },
                    { transaction: t }
                );

                if (!entity) {
                    entity = await db[modelName].create(
                        { [pkName]: pk }, 
                        { transaction: t }
                    );
                } else if (entity[`${tombstoneName}s`].length > 0) {
                    // Undo remove
                    await db[tombstoneName].destroy(
                        { where: { [fkName]: pk } },
                        { transaction: t }
                    );
                }

                const snapshots = entity[`${snapshotName}s`];
                if (snapshots && snapshots.length > 0) {
                    const description = snapshots[0];
                    const inputString = casKeys.map(key => params[key]).join(", ");
                    const currentString = casKeys.map(key => description[key]).join(", ");
                    const inputCAS = PutCommand.calculateCAS(inputString);
                    const currentCAS = PutCommand.calculateCAS(currentString);
                    if (currentCAS === inputCAS) return; // No changes
                }

                await db[snapshotName].create(
                    { [fkName]: pk, ...params }, 
                    { transaction: t }
                );
            });
        } catch (error) {
            console.log(error)
            throw new Error("Error in put");
        }
    }

    static calculateCAS = (params) => {
        const base64 = Buffer.from(`${params}`).toString("base64");
        return Buffer.from(base64).toString("base64");
    }
}
