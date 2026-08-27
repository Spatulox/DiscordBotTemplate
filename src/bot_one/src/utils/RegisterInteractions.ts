import {InteractionsManager} from "@spatulox/discord-module";
import {Bot} from "@spatulox/simplediscordbot";
import {Handlers} from "../../../share/HandlersPath";
import {BotType} from "../../../share/BotType";
import {ping} from "../../../share/interactions/commands/ping";
import {example} from "../interactions/commands/example";

/**
 * Wires every interaction handler to its Discord name.
 *
 * Build it with `await RegisterInteraction.create()` so registration is done
 * before the bot starts receiving interactions.
 */
export class RegisterInteraction {

    private static readonly BOT = BotType.BOT_ONE

    private manager: InteractionsManager

    private constructor() {
        this.manager = InteractionsManager.createOrGetInstance(Bot.client)
    }

    static async create(): Promise<RegisterInteraction> {
        const instance = new RegisterInteraction()
        await instance.slash()
        await instance.button()
        await instance.context_menu()
        await instance.modal()
        await instance.select_menu()
        return instance
    }

    private async slash() {
        const exampleJson = await Handlers.load(RegisterInteraction.BOT, 'commands', 'example');
        const sharedJson = await Handlers.load(RegisterInteraction.BOT, 'commands', 'shared_example');

        this.manager.registerSlash(exampleJson.name, example)
        this.manager.registerSlash(sharedJson.name, ping)   // shared, see src/share/
    }

    private async button() {
        // this.manager.registerButton("my_button_id", myButtonHandler)
    }

    private async context_menu() {
        // const json = await Handlers.load(RegisterInteraction.BOT, 'context_menu', 'example');
        // this.manager.registerMessageContextMenus(json.name, myContextMenuHandler)
    }

    private async modal() {
        // this.manager.registerModal("my_modal_title", myModalHandler)
    }

    private async select_menu() {
        // this.manager.registerSelectMenu("my_select_id", mySelectMenuHandler)
    }
}
