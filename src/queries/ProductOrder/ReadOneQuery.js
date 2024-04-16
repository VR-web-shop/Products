import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductOrderDTO from "../../dtos/ProductOrder.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ProductOrderDTO, 
            "ProductOrder", 
            "ProductOrderDescription", 
            "ProductOrderRemoved"
        );
    }
}
