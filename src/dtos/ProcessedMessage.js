
export default function ProcessedMessageDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("entity is required and must be an object");
    }

    return {
        subscriber_id: entity.subscriber_id,
        message_uuid: entity.message_uuid,
        created_at: entity.created_at,
        updated_at: entity.created_at
    }
}
