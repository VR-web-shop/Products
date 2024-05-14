import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/DeliverOption/PutCommand.js";
import CreateDistributedTransactionCommand from "../../commands/DistributedTransaction/CreateCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Put_Products_Deliver_Option";
const type = Sagas.SagaHandler.types.START;
const cmdService = ModelCommandService();

const idempotentMessageHandler = new Sagas.IdempotentMessageHandler(eventName, db);
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
            name: params.name,
            price: params.price,
            distributed_transaction_transaction_uuid
        }), { transaction });
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
    );
});

handler.onReduceEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {
    await update(
        {
            ...response.params,
            ...response.error
        },
        response.message_uuid,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name,
        
    );
});

export default handler.start;
