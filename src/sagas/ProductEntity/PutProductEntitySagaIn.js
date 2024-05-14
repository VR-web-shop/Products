import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/ProductEntity/PutCommand.js";
import CreateDistributedTransactionCommand from "../../commands/DistributedTransaction/CreateCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Put_Scenes_Shopping_Cart_Product_Entity";
const type = Sagas.SagaHandler.types.COMPLETE;
const cmdService = ModelCommandService();

const idempotentMessageHandler = new Sagas.IdempotentMessageHandler( eventName, db );
const handler = new Sagas.SagaHandler.handler({ eventName, type });

const update = async (
    params,
    message_uuid,
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
) => {
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
            product_entity_state_name: params.product_entity_state_name,
            product_client_side_uuid: params.product_client_side_uuid,
            distributed_transaction_transaction_uuid
        }), { transaction });
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
    );

    return response.params;
});


export default handler.start;
