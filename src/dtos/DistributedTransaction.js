
export default function DistributedTransactionDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("entity is required and must be an object");
    }

    return {
        transactionUUID: entity.transaction_uuid,
        distributed_transaction_state_name: entity.distributed_transaction_state_name,
        transaction_message: entity.transaction_message,
        created_at: entity.created_at,
        updated_at: entity.updated_at
    }
}
