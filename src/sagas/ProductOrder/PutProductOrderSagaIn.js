import Sagas from "@vr-web-shop/sagas";
import Saga from "../../../../saga-v2/SagaHandler.js";
import IdempotentMessageHandler from "../../../../idempotent-message-handler/IdempotentMessageHandler.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/ProductOrder/PutCommand.js";
import PutProductOrderEntityCommand from "../../commands/ProductOrderEntity/PutCommand.js";
import CreateDistristributedTransactionCommand from "../../commands/DistributedTransaction/CreateCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Put_Shopping_Cart_Product_Order";
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
    

    
}


handler.initiateEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {
    const { message_uuid, params } = response;
    const { product_order, product_order_entities } = params;
    const transaction_message = "Send message to Put_Shopping_Cart_Product_Order completed";

    if (message_uuid && await idempotentMessageHandler.existOrCreate(message_uuid)) {
        console.log(`${eventName}, message_uuid already processed: `, message_uuid);
        return;
    }
    console.log("Put_Shopping_Cart_Product_Order: ", params);
    await db.sequelize.transaction(async (transaction) => {
        await cmdService.invoke(new CreateDistristributedTransactionCommand(distributed_transaction_transaction_uuid, {
            distributed_transaction_state_name,
            transaction_message
        }), { transaction });
    
        await cmdService.invoke(new PutCommand(product_order.client_side_uuid, {
            name: product_order.name,
            email: product_order.email,
            address: product_order.address,
            city: product_order.city,
            country: product_order.country,
            postal_code: product_order.postal_code,
            product_order_state_name: product_order.product_order_state_name,
            deliver_option_client_side_uuid: product_order.deliver_option_client_side_uuid,
            payment_option_client_side_uuid: product_order.payment_option_client_side_uuid,
            distributed_transaction_transaction_uuid
        }), { transaction });

        for (const productOrderEntity of product_order_entities) {
            await cmdService.invoke(new PutProductOrderEntityCommand(productOrderEntity.client_side_uuid, {
                product_order_client_side_uuid: productOrderEntity.product_order_client_side_uuid,
                product_entity_client_side_uuid: productOrderEntity.product_entity_client_side_uuid,
                distributed_transaction_transaction_uuid
            }), { transaction });
        }
    });

    return params;
});

export default async (params) => {}