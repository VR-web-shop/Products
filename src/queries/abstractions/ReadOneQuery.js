import ModelQuery from "./ModelQuery.js";
import RequestError from "../../schemas/RequestError/RequestError.js";

export default class ReadOneQuery extends ModelQuery {
    constructor(pk, pkName, dto, modelName, snapshotName, tombstoneName) {
        super();
        if (!pk || typeof pk !== "string") {
            throw new Error("pk is required and must be a string");
        }

        if (!pkName || typeof pkName !== "string") {
            throw new Error("pkName is required and must be a string");
        }

        if (!dto || typeof dto !== "function") {
            throw new Error("dto is required and must be a function");
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
        this.pkName = pkName;
        this.dto = dto;
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
        const dto = this.dto;
        const modelName = this.modelName;
        const snapshotName = this.snapshotName;
        const tombstoneName = this.tombstoneName;

        const entity = await db[modelName].findOne({ 
                where: { [pkName]: pk },
                include: [
                    { 
                        model: db[snapshotName],
                        required: false,
                        order: [["created_at", "DESC"]],
                        limit: 1
                    },
                    {
                        model: db[tombstoneName],
                        required: false,
                        order: [["created_at", "DESC"]],
                        limit: 1
                    }
                ]
        });
        
        if (!entity || entity[`${tombstoneName}s`] && entity[`${tombstoneName}s`].length > 0) {
            throw new RequestError(404, "No Entity found");
        }

        const snapshot = entity[`${snapshotName}s`][0];

        return dto(snapshot, entity);
    }
}
