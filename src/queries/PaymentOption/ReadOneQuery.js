import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import PaymentOptionDTO from "../../dtos/PaymentOption.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            PaymentOptionDTO, 
            "PaymentOption", 
            "PaymentOptionDescription", 
            "PaymentOptionRemoved"
        );
    }
}
