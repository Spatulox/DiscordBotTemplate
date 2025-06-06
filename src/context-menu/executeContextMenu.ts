import { Client, ContextMenuCommandInteraction, ModalSubmitInteraction } from "discord.js";
import { createEmbed, createErrorEmbed, sendInteractionEmbed } from "../utils/messages/embeds";

export async function executeContextMenu(interaction: ContextMenuCommandInteraction){
    if (!interaction.isContextMenuCommand()) return;

    switch (interaction.commandName) {
        default:
            await sendInteractionEmbed(interaction, createErrorEmbed("Hmmm, what are you doing here ?? (executeContextMenu)"), true)
            break;
    }
}