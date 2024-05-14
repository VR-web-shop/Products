import Sagas from "@vr-web-shop/sagas";
import Saga from "../../../../saga-v2/SagaHandler.js";
import IdempotentMessageHandler from "../../../../idempotent-message-handler/IdempotentMessageHandler.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductOrder/ReadOneQuery.js";
import PutCommand from "../../commands/ProductOrder/PutCommand.js";
import DeleteCommand from "../../commands/ProductOrder/DeleteCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Delete_Products_Product_Order";
const cmdService = ModelCommandService();
const queryService = ModelQueryService();

const idempotentMessageHandler = new IdempotentMessageHandler(
    eventName, 
    db
);

const handler = new Saga.handler({ 
    eventName, 
    type: Saga.types.START,
    defaultParams: {
        product_order_state_name: 'DISCARDED_BY_EMPLOYEE'
    }
}, Sagas.BrokerService);

const update = async (
    params,
    message_uuid,
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    transaction_message,
) => {
    if (message_uuid && await idempotentMessageHandler.existOrCreate(message_uuid)) {
        console.log("Delete Products Product Order, message_uuid already processed: ", message_uuid);
        return;
    }

    const lastDescription = await queryService.invoke(new ReadOneQuery(params.client_side_uuid));

    await cmdService.invoke(new PutCommand(params.client_side_uuid, {
        name: lastDescription.name,
        email: lastDescription.email,
        address: lastDescription.address,
        city: lastDescription.city,
        country: lastDescription.country,
        postal_code: lastDescription.postal_code,
        product_order_state_name: params.product_order_state_name,
        deliver_option_client_side_uuid: lastDescription.deliver_option_client_side_uuid,
        payment_option_client_side_uuid: lastDescription.payment_option_client_side_uuid,
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

    return lastDescription;
}

handler.initiateEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    params,
) => {
    const lastDesc = await update(
        params, 
        null,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name,
        "Send message to Delete Products Product Order"
    );

    return {
        ...params,
        product_client_side_uuid: lastDesc.product_client_side_uuid
    };
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
        "Delete Products Product Order completed"
    );

    await cmdService.invoke(new DeleteCommand(
        response.params.client_side_uuid
    ));
});

handler.onReduceEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {
    await update({
            client_side_uuid: response.params.client_side_uuid,
            product_order_state_name: 'SYSTEM_FAILURE',
        },
        response.message_uuid,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name,
        response.error
    );
});

export default handler.start;
