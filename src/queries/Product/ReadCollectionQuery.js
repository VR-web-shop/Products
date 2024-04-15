import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import PaymentOptionDTO from "../../dtos/PaymentOption.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            PaymentOptionDTO, 
            "PaymentOption", 
            "PaymentOptionDescription", 
            "PaymentOptionRemoved"
        );
    }
}
