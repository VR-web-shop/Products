import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductOrderDTO from "../../dtos/ProductOrder.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            ProductOrderDTO, 
            "ProductOrder", 
            "ProductOrderDescription", 
            "ProductOrderRemoved"
        );
    }
}
