import {ChatInputCommandInteraction} from "discord.js";
import {RateLimiter} from "discord.js-rate-limiter";
import {Bot, EmbedManager, Time} from "@spatulox/simplediscordbot";
import {isUserRateLimited} from "../../utils/rateLimiter";

const timeToWait = Time.second.SEC_20.toMilliseconds()
const rateLimiter = new RateLimiter(1, timeToWait)

/**
 * Shared interaction : registered by every bot from its own
 * RegisterInteractions, using its own handler json.
 */
export async function ping(interaction: ChatInputCommandInteraction) {
    if (await isUserRateLimited(interaction, rateLimiter, timeToWait)) {
        return
    }

    try {
        const latency = Math.round(interaction.client.ws.ping)
        await interaction.reply({
            embeds: [EmbedManager.success(`Pong ! \`${latency}ms\` — from **${Bot.config.botName}**`)]
        })
    } catch (error) {
        Bot.log.error(`ping command failed : ${error}`)
    }
}
