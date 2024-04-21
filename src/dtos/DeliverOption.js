
export default function DeliverOptionDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        clientSideUUID: entity.client_side_uuid,
        name: entity.name,
        price: entity.price,
        created_at: entity.created_at,
        updated_at: entity.updated_at
    }
}
 