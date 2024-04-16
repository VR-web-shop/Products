
export default function ProductOrderEntityDTO(description, entity) {
    if (!description || typeof description !== "object") {
        throw new Error("description is required and must be an object");
    }

    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        clientSideUUID: entity.client_side_uuid,
        product_order_client_side_uuid: description.product_order_client_side_uuid,
        product_entity_client_side_uuid: description.product_entity_client_side_uuid,
        created_at: entity.createdAt,
        updated_at: description.createdAt
    }
}
