
export default function ProductOrderEntityDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        clientSideUUID: entity.client_side_uuid,
        product_order_client_side_uuid: entity.product_order_client_side_uuid,
        product_entity_client_side_uuid: entity.product_entity_client_side_uuid,
        created_at: entity.created_at,
        updated_at: entity.updated_at
    }
}
