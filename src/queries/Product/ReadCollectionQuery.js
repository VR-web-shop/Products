import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductDTO from "../../dtos/Product.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            ProductDTO, 
            "Product", 
            "ProductDescription", 
            "ProductRemoved"
        );
    }
}
