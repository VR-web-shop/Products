import Sagas from "@vr-web-shop/sagas";
import Saga from "../../../../saga-v2/SagaHandler.js";
import IdempotentMessageHandler from "../../../../idempotent-message-handler/IdempotentMessageHandler.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/ProductOrder/PutCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Put_Products_Product_Order";
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
        console.log("Put Products Product Order, message_uuid already processed: ", message_uuid);
        return;
    }
    
    await cmdService.invoke(new PutCommand(params.client_side_uuid, {
        name: params.name,
        email: params.email,
        address: params.address,
        city: params.city,
        country: params.country,
        postal_code: params.postal_code,
        product_order_state_name: params.product_order_state_name,
        deliver_option_client_side_uuid: params.deliver_option_client_side_uuid,
        payment_option_client_side_uuid: params.payment_option_client_side_uuid,
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
        "Send message to Put Products Product Order"
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
        "Put Products Product Order completed"
    );
});

handler.onReduceEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {
    await update({
            client_side_uuid: response.params.client_side_uuid,
            name: params.name,
            email: params.email,
            address: params.address,
            city: params.city,
            country: params.country,
            postal_code: params.postal_code,
            product_order_state_name: 'SYSTEM_FAILURE',
            deliver_option_client_side_uuid: params.deliver_option_client_side_uuid,
            payment_option_client_side_uuid: params.payment_option_client_side_uuid,
        },
        response.message_uuid,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name,
        response.error
    );
});

export default handler.start;
