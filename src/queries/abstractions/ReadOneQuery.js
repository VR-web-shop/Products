import ModelQuery from "./ModelQuery.js";
import RequestError from "../../schemas/RequestError/RequestError.js";

export default class ReadOneQuery extends ModelQuery {
    constructor(pk, pkName, dto, modelName, snapshotName = null, tombstoneName = null) {
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

        if (snapshotName && typeof snapshotName !== "string") {
            throw new Error("if using snapshots, snapshotName is required and must be a string");
        }

        if (tombstoneName && typeof tombstoneName !== "string") {
            throw new Error("if using tombstones, tombstoneName is required and must be a string");
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
        const params = { where: { [pkName]: pk }, include: [] };

        if (snapshotName) {
            params.include.push({
                model: db[snapshotName],
                order: [["created_at", "DESC"]],
                limit: 1
            });
        }

        if (tombstoneName) {
            params.include.push({
                model: db[tombstoneName],
                order: [["created_at", "DESC"]],
                limit: 1
            });
        }

        const entity = await db[modelName].findOne(params);

        if (!entity) {
            throw new RequestError(404, "No Entity found");
        }

        if (tombstoneName) {
            const hasTombstone = entity[`${tombstoneName}s`] && entity[`${tombstoneName}s`].length > 0;
            if (hasTombstone) {
                throw new RequestError(404, "No Entity found");
            }
        }

        if (snapshotName) {
            const snapshot = entity[`${snapshotName}s`][0];
            return dto(snapshot, entity);
        } else {
            return dto(entity);
        }
    }
}
