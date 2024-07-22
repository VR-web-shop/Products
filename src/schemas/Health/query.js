
import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/DeliverOption/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/DeliverOption/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";
import Sagas from "@vr-web-shop/sagas";

const service = ModelQueryService();

const resolvers = {
    Query: {
        health: async () => {
            try {
                let mysql_connected = false;
                try {
                    await service.invoke(new ReadCollectionQuery({ limit: 10, page: 1 }));
                    mysql_connected = true;
                } catch (error) {
                    mysql_connected = false;
                }

                let broker_connected = false;
                try {
                    broker_connected = Sagas.BrokerService.isConnected();
                } catch (error) {
                    broker_connected = false;
                }
                
                return { 
                    __typename: 'Health',
                    mysql_connected, 
                    broker_connected,
                    api_type: 'GraphQL',
                    exception_handler: 'Rollbar',
                };
            } catch (error) {
                if (error instanceof RequestError) {
                    rollbar.info('RequestError', { code: error.code, message: error.message })
                    return error.toResponse();
                }
                
                rollbar.error(error);
                console.log('error', error);
                throw new Error('Failed to get deliver option');
            }
        }
    }
};

export default resolvers;
