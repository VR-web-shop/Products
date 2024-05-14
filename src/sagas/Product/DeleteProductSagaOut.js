import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/Product/ReadOneQuery.js";
import PutCommand from "../../commands/Product/PutCommand.js";
import DeleteCommand from "../../commands/Product/DeleteCommand.js";
import CreateDistributedTransactionCommand from "../../commands/DistributedTransaction/CreateCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Delete_Products_Product";
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
            name: lastDescription.name,
            description: lastDescription.description,
            price: lastDescription.price,
            thumbnail_source: lastDescription.thumbnail_source,
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
        name: lastDesc.name,
        description: lastDesc.description,
        price: lastDesc.price,
        thumbnail_source: lastDesc.thumbnail_source,
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
