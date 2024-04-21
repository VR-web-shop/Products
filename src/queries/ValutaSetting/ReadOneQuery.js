import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ValutaSettingDTO from "../../dtos/ValutaSetting.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ValutaSettingDTO, 
            "ValutaSettings", 
            "ValutaSettingDescription", 
            "ValutaSettingRemoved",
            "valuta_setting_client_side_uuid",
            additionalParams
        );
    }
}
