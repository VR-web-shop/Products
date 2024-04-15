import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductOrderEntityDTO from "../../dtos/ProductOrderEntity.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            ProductOrderEntityDTO, 
            "ProductOrderEntity", 
            "ProductOrderEntityDescription", 
            "ProductOrderEntityRemoved"
        );
    }
}
