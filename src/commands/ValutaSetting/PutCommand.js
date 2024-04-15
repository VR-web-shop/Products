import _PutCommand from "../abstractions/PutCommand.js";

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "valuta_setting_client_side_uuid", 
            ["name", "short", "symbol", "active"],
            "ValutaSetting",
            "ValutaSettingDescription",
            "ValutaSettingRemoved"
        );
    }
}
