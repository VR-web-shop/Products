
export default function ProductOrderDTO(description, entity) {
    if (!description || typeof description !== "object") {
        throw new Error("description is required and must be an object");
    }

    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        clientSideUUID: entity.client_side_uuid,
        name: description.name,
        email: description.email,
        address: description.address,
        city: description.city,
        country: description.country,
        postal_code: description.postal_code,
        product_order_state_name: description.product_order_state_name,
        deliver_option_client_side_uuid: description.deliver_option_client_side_uuid,
        payment_option_client_side_uuid: description.payment_option_client_side_uuid,
        created_at: entity.createdAt,
        updated_at: description.createdAt
    }
}
