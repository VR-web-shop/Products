import Sagas from "@vr-web-shop/sagas";
import CreateDistributedTransactionCommand from "../../commands/DistributedTransaction/CreateCommand.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductOrderEntity/ReadOneQuery.js";
import PutCommand from "../../commands/ProductOrderEntity/PutCommand.js";
import DeleteCommand from "../../commands/ProductOrderEntity/DeleteCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Delete_Products_Product_Order_Entity";
const type = Sagas.SagaHandler.types.START;

const cmdService = ModelCommandService();
const queryService = ModelQueryService();

const idempotentMessageHandler = new Sagas.IdempotentMessageHandler( eventName, db );
const handler = new Sagas.SagaHandler.handler({ eventName, type });

const update = async (
    params,
    message_uuid,
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
) => {
    const lastDescription = await queryService.invoke(new ReadOneQuery(params.client_side_uuid));

    await db.sequelize.transaction(async (transaction) => {
        if (message_uuid && await idempotentMessageHandler.existOrCreate(message_uuid, transaction)) {
            console.error(`${eventName}, message_uuid already processed: `, message_uuid);
            return;
        }

        await cmdService.invoke(new CreateDistributedTransactionCommand(
            distributed_transaction_transaction_uuid, 
            { 
                distributed_transaction_state_name,
                transaction_message: JSON.stringify({ 
                    eventName, type, params, message_uuid 
                })
            }
        ), { transaction });
    
        await cmdService.invoke(new PutCommand(params.client_side_uuid, {
            product_order_client_side_uuid: lastDescription.product_order_client_side_uuid,
            product_entity_client_side_uuid: lastDescription.product_entity_client_side_uuid,
            distributed_transaction_transaction_uuid
        }), { transaction });
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
    );

    return {
        ...params,
        product_order_client_side_uuid: lastDesc.product_order_client_side_uuid,
        product_entity_client_side_uuid: lastDesc.product_entity_client_side_uuid,
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
    await update(
        {...response.params, ...response.error},
        response.message_uuid,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name,
    );
});

export default handler.start;
