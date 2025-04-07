import {sendInteractionError} from "../utils/messages.js";

export async function executeModalSubmit(interaction, client){
    if (!interaction.isModalSubmit()) return;

    switch (interaction.customId) {
        default:
            await sendInteractionError(interaction, "Hmmm, what are you doing here ?? (executeSlashCommand)", true)
            break;
    }
}