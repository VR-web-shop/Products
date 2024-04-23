import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/ProductEntity/PutCommand.js";

const cmdService = ModelCommandService();

const PutProductEntitySaga = new Sagas.SagaBuilder()
    .on('Put Scene Product Entity', {
        action: async (params) => {
            await cmdService.invoke(new PutCommand(params.client_side_uuid, params));
            return params;
        },
        reducer: async (reply) => {
            delete reply.product_entity_state_name;
            await cmdService.invoke(new PutCommand(reply.client_side_uuid, {
                product_entity_state_name: 'SYSTEM_FAILURE',
                ...reply
            }));
        }
    })
    .on('Put Cart Product Entity', {
        action: async (params) => {
            return params;
        },
        reducer: async (reply) => {
            return reply;
        }
    })
    .resolve(async (params) => {
        await cmdService.invoke(new PutCommand(params.client_side_uuid, params));
    })
    .build();

export default PutProductEntitySaga;

