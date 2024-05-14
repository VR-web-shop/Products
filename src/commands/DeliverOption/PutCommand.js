import _PutCommand from "../abstractions/PutCommand.js";

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "deliver_option_client_side_uuid", 
            ["name", "price", "distributed_transaction_transaction_uuid"],
            "DeliverOption",
            "DeliverOptionDescription",
            "DeliverOptionRemoved"
        );
    }
}
