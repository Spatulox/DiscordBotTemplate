import {ModuleManager} from "@spatulox/discord-module";
import {Bot} from "@spatulox/simplediscordbot";
import {BotType} from "../../../share/BotType";
import {LogMessages} from "../../../share/modules/LogMessages";
import {ExampleModule} from "../modules/ExampleModule";

/**
 * Registers every module of this bot and enables them.
 *
 * Build it with `await RegisterModules.create()` so modules exist before
 * the interactions that may depend on them are registered.
 */
export class RegisterModules {

    private static readonly BOT = BotType.BOT_TWO

    private manager: ModuleManager

    private constructor() {
        this.manager = ModuleManager.createOrGetInstance(Bot.client)
    }

    static async create(): Promise<RegisterModules> {
        const instance = new RegisterModules()
        await instance.init()
        return instance
    }

    private async init() {
        this.manager.register(new LogMessages(RegisterModules.BOT))   // shared, see src/share/
        this.manager.register(new ExampleModule())

        if (Bot.client && Bot.client.user) {
            this.manager.enableAll()
        }
    }
}
