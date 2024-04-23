import _PutCommand from "../abstractions/PutCommand.js";

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "product_client_side_uuid", 
            ["name", "description", "price", "thumbnail_source", "transaction_state_name", "transaction_message"],
            "Product",
            "ProductDescription",
            "ProductRemoved"
        );
    }
}
