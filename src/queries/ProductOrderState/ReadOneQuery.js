import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductOrderStateDTO from "../../dtos/ProductOrderState.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(name) {
        super(
            name, 
            "name",
            ProductOrderStateDTO, 
            "ProductOrderState"
        );
    }
}
