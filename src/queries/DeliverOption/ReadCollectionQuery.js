import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import DeliverOptionDTO from "../../dtos/DeliverOption.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            DeliverOptionDTO, 
            "DeliverOption", 
            "DeliverOptionDescription", 
            "DeliverOptionRemoved"
        );
    }
}
