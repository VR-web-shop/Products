import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductOrderEntityDTO from "../../dtos/ProductOrderEntity.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ProductOrderEntityDTO, 
            "ProductOrderEntity", 
            "ProductOrderEntityDescription", 
            "ProductOrderEntityRemoved"
        );
    }
}
