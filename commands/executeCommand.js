// Slashes command in alphabetical order...
import {sendInteractionError, sendInteractionReply} from "../utils/messages.js";

export async function executeSlashCommand(interaction, client){
    if (!interaction.isCommand()) return;

    switch (interaction.commandName) {
        default:
            await sendInteractionError(interaction, "Hmmm, what are you doing here ?? (executeSlashCommand)")
            break;
    }
}