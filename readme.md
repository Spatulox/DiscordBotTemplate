# Discord Bot Template

A ready-to-use Discord bot template built on
[SimpleDiscordBot](https://github.com/Spatulox/SimpleDiscordBot).

The framework handles login, logging, modules, interactions and command
deployment, so this repository only contains what is specific to *your* bot.

| Package | Role |
|---|---|
| [`@spatulox/simplediscordbot`](https://www.npmjs.com/package/@spatulox/simplediscordbot) | `Bot` (auto-login + logs), `EmbedManager`, `GuildManager`, `Time`, `FileManager`, `DiscordRegex`… |
| [`@spatulox/discord-module`](https://www.npmjs.com/package/@spatulox/discord-module) | `Module` / `ModuleManager` / `ModuleUI` (toggleable features) and `InteractionsManager` |
| `dim` (bundled with the two above) | CLI deploying the `handler/*.json` interactions to Discord |

## Setup

```bash
npm install
cp .env.example .env   # then fill DISCORD_BOT_TOKEN and DISCORD_BOT_CLIENTID
```

Then fill the channel and guild ids in `src/constantes.ts`.

## Run

```bash
npm run dev     # nodemon + ts-node, restarts on every .ts change
npm start       # build then run dist/
```

> Always run from the repository root : the `.env` and `handler/` paths are
> resolved from the current working directory.

## Deploy the slash commands / context menus

```bash
npx dim
```

The CLI reads `DISCORD_INTERACTION_FOLDER` (`./handler`) and lets you deploy,
update, delete and list your interactions. It writes the Discord-assigned `id`
back into each json file — commit that.

## Dev vs prod

`DISCORD_BOT_DEV` drives two things at once:

- `handler/commands_dev/` and `handler/context_menu_dev/` are loaded instead of
  `handler/commands/` and `handler/context_menu/`. The `_dev` files declare a
  different `name`, so your dev bot and your prod bot can live on Discord side
  by side.
- `src/constantes.ts` returns the DEV ids instead of the PROD ones.

Any non-empty value means dev — set the variable to an **empty** value for
production (`DISCORD_BOT_DEV=false` would still be truthy).

## Layout

```
handler/                  interaction manifests, deployed by `dim`
  commands/               slash commands (prod)
  commands_dev/           slash commands (dev), different `name`
  context_menu/           context menus (prod)
  context_menu_dev/       context menus (dev)
src/
  index.ts                entry point : builds the Bot and registers everything
  client.ts               the discord.js Client and its intents
  constantes.ts           channel / guild ids, switched on DISCORD_BOT_DEV
  activities.ts           activities randomly displayed by the bot
  interactions/           the code behind each interaction
    commands/ context-menu/ modal/ selectmenu/ buttons/
  modules/                toggleable features listening to Discord events
  utils/
    HandlersPath.ts       loads handler json, dev/prod aware
    RegisterInteractions.ts  maps interaction names -> functions
    RegisterModules.ts    registers and enables the modules
    rateLimiter.ts        per-user rate limit helper
```

## Add a slash command

1. Create `handler/commands/mycommand.json` (and its `_dev` twin with a
   different `name`).
2. Add `'mycommand'` to `HANDLERS_PATHS.commands` in `src/utils/HandlersPath.ts`
   — it is a typed whitelist, `Handlers.load` throws for anything missing.
3. Write the handler in `src/interactions/commands/mycommand.ts`.
4. Register it in `RegisterInteraction.slash()`:
   ```ts
   const json = await Handlers.load('commands', 'mycommand');
   this.manager.registerSlash(json.name, mycommand)
   ```
5. `npx dim` to push it to Discord.

Buttons, modals and select menus follow the same pattern, minus the json
(their name is the `customId` you set). `InteractionMatchType.START_WITH`
lets one handler serve every `customId` sharing a prefix.

## Add a module

Extend `Module` (or `ModuleWithCache` for persistent state), declare the
Discord events it listens to, and register it in `RegisterModules.init()`.
Modules can be enabled/disabled live from the `ModuleUI` panel posted in the
`module_ui` channel — see `src/modules/ExampleModule.ts`.

## Multi-bot

The `feat/multi-bot` branch holds the same template arranged for several bots
running side by side from one repository, with a shared `src/share/` folder.
