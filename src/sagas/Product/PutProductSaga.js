import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/Product/PutCommand.js";

const cmdService = ModelCommandService();

const PutProductSaga = new Sagas.SagaBuilder()
    .on('Put Scene Product', {
        action: async (params) => {
            const cmd = new PutCommand(params.client_side_uuid, params);
            await cmdService.invoke(cmd);
            return params;
        },
        reducer: async (reply) => {
            await cmdService.invoke(new PutCommand(reply.client_side_uuid, {
                transaction_state_name: 'FAILED',
                transaction_message: reply.error
            }));   
        }
    })
    .on('Put Cart Product', {
        action: async (params) => {
            return params;
        },
        reducer: async (reply) => {
            return reply;
        }
    })
    .build();

export default PutProductSaga;


