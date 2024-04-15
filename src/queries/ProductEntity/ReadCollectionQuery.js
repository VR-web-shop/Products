import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductEntityDTO from "../../dtos/ProductEntity.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            ProductEntityDTO, 
            "ProductEntity", 
            "ProductEntityDescription", 
            "ProductEntityRemoved"
        );
    }
}
