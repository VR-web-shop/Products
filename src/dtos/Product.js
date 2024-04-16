
export default function ProductDTO(description, entity) {
    if (!description || typeof description !== "object") {
        throw new Error("description is required and must be an object");
    }

    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        clientSideUUID: entity.client_side_uuid,
        name: description.name,
        description: description.description,
        price: description.price,
        thumbnail_source: description.thumbnail_source,
        created_at: entity.createdAt,
        updated_at: description.createdAt
    }
}
 