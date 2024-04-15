import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import DeliverOptionDTO from "../../dtos/DeliverOption.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            DeliverOptionDTO, 
            "DeliverOption", 
            "DeliverOptionDescription", 
            "DeliverOptionRemoved"
        );
    }
}
