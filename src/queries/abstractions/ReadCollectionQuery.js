import ModelQuery from "./ModelQuery.js";

export default class ReadCollectionQuery extends ModelQuery {
    constructor(options={}, dto, modelName, snapshotName, tombstoneName) {
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

        if (!snapshotName || typeof snapshotName !== "string") {
            throw new Error("snapshotName is required and must be a string");
        }

        if (!tombstoneName || typeof tombstoneName !== "string") {
            throw new Error("tombstoneName is required and must be a string");
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
        const params = { limit, offset, where };

        const count = await db[modelName].count({ where: params.where });
        const pages = Math.ceil(count / limit);
        const entities = await db[modelName].findAll({
            ...params,
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

        const rows = [];
        entities.forEach(entity => {
            const hasTombstone = entity[`${tombstoneName}s`] && entity[`${tombstoneName}s`].length > 0;
            if (hasTombstone) return;

            const snapshot = entity[`${snapshotName}s`][0];

            rows.push(dto(snapshot, entity));
        });
        
        return { rows, pages, count };
    }
}
