import ModelQuery from "./ModelQuery.js";

export default class ReadCollectionQuery extends ModelQuery {
    constructor(options = {}, dto, modelName, snapshotName = null, tombstoneName = null) {
        super();
        if (typeof options !== "object") {
            throw new Error("Options must be an object");
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

        this.options = options;
        this.dto = dto;
        this.modelName = modelName;
        this.snapshotName = snapshotName;
        this.tombstoneName = tombstoneName;
    }

    async execute(db) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const options = this.options;
        const dto = this.dto;
        const modelName = this.modelName;
        const snapshotName = this.snapshotName;
        const tombstoneName = this.tombstoneName;

        const limit = options.limit || 10;
        const page = options.page || 1;
        const offset = (page - 1) * limit;

        const where = options.where || {};
        const params = { limit, offset, where, include: [] };

        const countAll = await db[modelName].count({ where });
        let countTombstones = 0;

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

            countTombstones = await db[tombstoneName].count({ where });
        }
        
        const entities = await db[modelName].findAll(params);
        const rows = [];
        entities.forEach(entity => {
            if (tombstoneName) {
                const hasTombstone = entity[`${tombstoneName}s`] && entity[`${tombstoneName}s`].length > 0;
                if (hasTombstone) return;
            }
            
            if (snapshotName) {
                const snapshot = entity[`${snapshotName}s`][0];
                rows.push(dto(snapshot, entity));
            } else {
                rows.push(dto(entity));
            }
        });

        const count = countAll - countTombstones;
        const pages = Math.ceil(count / limit);

        return { rows, pages, count };
    }
}
