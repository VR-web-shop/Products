import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import DeleteCommand from "../../commands/Product/DeleteCommand.js";

const cmdService = ModelCommandService();

const PutProductSaga = new Sagas.SagaBuilder()
    .on('Delete Scene Product', {
        action: async (params) => {
            const cmd = new DeleteCommand(params.client_side_uuid);
            await cmdService.invoke(cmd);
            return params;
        },
        reducer: async (reply) => {
            const cmd = new PutCommand(reply.client_side_uuid, reply);
            await cmdService.invoke(cmd);   
        }
    })
    .on('Delete Cart Product', {
        action: async (params) => {
            return params;
        },
        reducer: async (reply) => {
            const cmd = new PutCommand(reply.client_side_uuid, reply);
            await cmdService.invoke(cmd);
        }
    })
    .build();

export default PutProductSaga;
