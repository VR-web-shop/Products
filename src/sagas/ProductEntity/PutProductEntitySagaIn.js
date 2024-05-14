import Sagas from "@vr-web-shop/sagas";
import Saga from "../../../../saga-v2/SagaHandler.js";
import IdempotentMessageHandler from "../../../../idempotent-message-handler/IdempotentMessageHandler.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/ProductEntity/PutCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Put_Scenes_Shopping_Cart_Product_Entity";
const cmdService = ModelCommandService();

const idempotentMessageHandler = new IdempotentMessageHandler(
    eventName, 
    db
);

const handler = new Saga.handler({ 
    eventName, 
    type: Saga.types.COMPLETE
}, Sagas.BrokerService);

const update = async (
    params,
    message_uuid,
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    transaction_message
) => {
    if (message_uuid && await idempotentMessageHandler.existOrCreate(message_uuid)) {
        console.log("Put Scenes Shopping Cart Product Entity completed, message_uuid already processed: ", message_uuid);
        return;
    }

    await cmdService.invoke(new PutCommand(params.client_side_uuid, {
        product_entity_state_name: params.product_entity_state_name,
        product_client_side_uuid: params.product_client_side_uuid,
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
    response,
) => {
    await update(
        response.params, 
        response.message_uuid,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name,
        "Send message to Put Scenes Shopping Cart Product Entity completed"
    );

    return response.params;
});


export default handler.start;
