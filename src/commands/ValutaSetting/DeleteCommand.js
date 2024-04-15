import _DeleteCommand from "../abstractions/DeleteCommand.js";

export default class DeleteCommand extends _DeleteCommand {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            "valuta_setting_client_side_uuid",
            "ValutaSetting",
            "ValutaSettingRemoved"
        );
    }
}
