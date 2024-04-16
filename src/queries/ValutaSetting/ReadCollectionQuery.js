import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ValutaSettingDTO from "../../dtos/ValutaSetting.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            ValutaSettingDTO, 
            "ValutaSetting", 
            "ValutaSettingDescription", 
            "ValutaSettingRemoved"
        );
    }
}
