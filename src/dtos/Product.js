
export default function ProductDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }
    
    return {
        clientSideUUID: entity.client_side_uuid,
        name: entity.name,
        description: entity.description,
        price: entity.price,
        thumbnail_source: entity.thumbnail_source,
        created_at: entity.createdAt,
        updated_at: entity.updatedAt
    }
}
 