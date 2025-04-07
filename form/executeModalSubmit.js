import {addReminder} from "../commands/commandsFunctions/reminder.js";
import {createErrorEmbed, returnToSendEmbed} from "../utils/embeds.js";
import {sendInteractionError} from "../utils/messages.js";

export async function executeModalSubmit(interaction, client){
    if (!interaction.isModalSubmit()) return;

    switch (interaction.customId) {
        case 'add_reminder':
            addReminder(client, interaction)
            break;
        default:
            await sendInteractionError(interaction, "Hmmm, what are you doing here ?? (executeSlashCommand)", true)
            //interaction.reply(returnToSendEmbed(createErrorEmbed("Hmmm, what are you doing here ?? (executeSlashCommand)")))
            break;
    }
}