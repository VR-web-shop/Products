import Sagas from "@vr-web-shop/sagas";
import Saga from "../../../../saga-v2/SagaHandler.js";
import IdempotentMessageHandler from "../../../../idempotent-message-handler/IdempotentMessageHandler.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/Product/PutCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Put_Products_Product";
const cmdService = ModelCommandService();

const idempotentMessageHandler = new IdempotentMessageHandler(
    eventName, 
    db
);

const handler = new Saga.handler({ 
    eventName, 
    type: Saga.types.START
}, Sagas.BrokerService);

const update = async (
    params,
    message_uuid,
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    transaction_message
) => {
    if (message_uuid && await idempotentMessageHandler.existOrCreate(message_uuid)) {
        console.log("Put Products Product, message_uuid already processed: ", message_uuid);
        return;
    }
    
    await cmdService.invoke(new PutCommand(params.client_side_uuid, {
        name: params.name,
        description: params.description,
        price: params.price,
        thumbnail_source: params.thumbnail_source,
        distributed_transaction_transaction_uuid
    }), {
        beforeTransactions: [
            async (db, t, pk, params) => {
                await db["DistributedTransaction"].create(
                    { 
                        transactionUUID: distributed_transaction_transaction_uuid,
                        distributed_transaction_state_name,
                        transaction_message
                    },
                    { transaction: t }
                );
            }
        ]
    });
}


handler.initiateEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    params,
) => {
    await update(
        params, 
        null,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name,
        "Send message to Put Products Product"
    );

    return params;
});

handler.onCompleteEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {
    await update(
        response.params,
        response.message_uuid,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name,
        "Put Products Product completed"
    );
});

handler.onReduceEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {
    await update({
            client_side_uuid: response.params.client_side_uuid,
            product_entity_state_name: 'SYSTEM_FAILURE',
            product_client_side_uuid: response.params.product_client_side_uuid
        },
        response.message_uuid,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name,
        response.error
    );
});

export default handler.start;
