
export default function ProductOrderStateDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        name: entity.name,
        created_at: entity.createdAt,
        updated_at: entity.createdAt
    }
}
