import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ValutaSettingDTO from "../../dtos/ValutaSetting.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            ValutaSettingDTO, 
            "ValutaSettings", 
            "ValutaSettingDescription", 
            "ValutaSettingRemoved",
            snapshotOptions,
            "valuta_setting_client_side_uuid",
            "client_side_uuid"
        );
    }
}
