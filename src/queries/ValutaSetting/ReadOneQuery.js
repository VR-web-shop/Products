import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ValutaSettingDTO from "../../dtos/ValutaSetting.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ValutaSettingDTO, 
            "ValutaSetting", 
            "ValutaSettingDescription", 
            "ValutaSettingRemoved"
        );
    }
}
