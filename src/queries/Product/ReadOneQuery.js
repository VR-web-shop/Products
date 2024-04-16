import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductDTO from "../../dtos/Product.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ProductDTO, 
            "Product", 
            "ProductDescription", 
            "ProductRemoved"
        );
    }
}
