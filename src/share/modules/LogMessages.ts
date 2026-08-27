import {Module, ModuleEventsMap} from "@spatulox/discord-module";
import {Bot} from "@spatulox/simplediscordbot";
import {Events, Message} from "discord.js";
import {BotType} from "../BotType";

/**
 * Shared module : the same feature, registered by several bots.
 *
 * The owning bot is passed in so the shared code can behave differently per
 * bot without importing anything from a bot folder — share/ must never depend
 * on bot_one/ or bot_two/, only the other way around.
 */
export class LogMessages extends Module {

    name: string = "Log Messages"
    description: string = "Logs every message sent by a human"

    private readonly bot: BotType

    constructor(bot: BotType) {
        super()
        this.bot = bot
    }

    get events(): ModuleEventsMap {
        return {
            [Events.MessageCreate]: (message: Message) => this.onMessage(message)
        }
    }

    private onMessage(message: Message) {
        if (message.author.bot) return
        Bot.log.debug(`[${this.bot}] ${message.author.username} : ${message.content}`)
    }
}
