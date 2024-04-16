import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductEntityDTO from "../../dtos/ProductEntity.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ProductEntityDTO, 
            "ProductEntity", 
            "ProductEntityDescription", 
            "ProductEntityRemoved"
        );
    }
}
