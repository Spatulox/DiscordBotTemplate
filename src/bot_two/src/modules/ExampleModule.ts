import {Module, ModuleEventsMap} from "@spatulox/discord-module";
import {Bot} from "@spatulox/simplediscordbot";
import {Events, GuildMember} from "discord.js";

/**
 * Bot-specific module : lives in this bot's folder because only this bot needs
 * it. Anything two bots would both want belongs in src/share/modules/ instead.
 */
export class ExampleModule extends Module {

    name: string = "Welcome New Members"
    description: string = "Logs a line when someone joins the server"

    get events(): ModuleEventsMap {
        return {
            [Events.GuildMemberAdd]: (member: GuildMember) => this.onJoin(member)
        }
    }

    private onJoin(member: GuildMember) {
        Bot.log.info(`Welcome ${member.user.username} !`)
    }
}
