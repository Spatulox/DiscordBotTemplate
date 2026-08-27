# Discord Bot Template — multi bot

[![discord.js](https://img.shields.io/github/package-json/dependency-version/Spatulox/DiscordBotTemplate/discord.js?branch=feat%2Fmulti-bot&logo=discord&logoColor=white&label=discord.js)](https://discord.js.org/)
[![simplediscordbot](https://img.shields.io/github/package-json/dependency-version/Spatulox/DiscordBotTemplate/@spatulox%2Fsimplediscordbot?branch=feat%2Fmulti-bot&label=simplediscordbot)](https://github.com/Spatulox/SimpleDiscordBot)
[![latest release](https://img.shields.io/github/v/release/Spatulox/DiscordBotTemplate?label=template)](../../releases)

Several Discord bots living in one repository, built on
[SimpleDiscordBot](https://github.com/Spatulox/SimpleDiscordBot), arranged like
[helldivers-FR-bot-dev](https://github.com/Spatulox/helldivers-FR-bot).

Each bot is an independent folder under `src/` with its own token, its own
`Client` and its own entry point; `src/share/` holds everything two bots would
otherwise duplicate. They are started together by `concurrently`.

> **One bot = one process.** `Bot`, `ModuleManager` and `InteractionsManager`
> are process-wide singletons, so two bots cannot share a single Node process.

For the single-bot version of this template, see the `main` branch.

| Package | Role |
|---|---|
| [`@spatulox/simplediscordbot`](https://www.npmjs.com/package/@spatulox/simplediscordbot) | `Bot` (auto-login + logs), `EmbedManager`, `GuildManager`, `Time`, `FileManager`, `DiscordRegex`… |
| [`@spatulox/discord-module`](https://www.npmjs.com/package/@spatulox/discord-module) | `Module` / `ModuleManager` / `ModuleUI` (toggleable features) and `InteractionsManager` |
| `dim` (bundled with the two above) | Interactive CLI that **generates** the `handler/*.json` interactions and deploys them to Discord |

## Compatibility

| Template | discord.js | `@spatulox/simplediscordbot` | Node |
|---|---|---|---|
| current | 14.x | 3.x | >= 18 |

The badges above read `package.json` straight from this branch, so they always
show what it actually depends on — nothing to keep in sync by hand.

A new discord.js major means a new template major. The
[releases](../../releases) say what changed, and each one is tagged:
`git checkout <tag>` gets you back the state that worked with the previous
major.

## Setup

```bash
npm install
cp src/bot_one/.env.bot_one.example src/bot_one/.env.bot_one
cp src/bot_two/.env.bot_two.example src/bot_two/.env.bot_two
```

Fill `DISCORD_BOT_TOKEN` and `DISCORD_BOT_CLIENTID` in each file — **one
Discord application per bot** — then fill the channel and guild ids in each
`src/<bot>/src/constantes.ts`.

## Run

```bash
npm run dev       # both bots, nodemon + ts-node, restart on every .ts change
npm run bot_one   # one bot alone
npm run bot_two
npm start         # build then run both from dist/
```

> Always run from the repository root : the `.env` and `handler/` paths are
> resolved from the current working directory.

## Manage the slash commands / context menus

```bash
# from the repository root, once per bot
env $(grep -vE '^\s*(#|$)' src/bot_one/.env.bot_one | xargs) \
    DISCORD_INTERACTION_FOLDER=./src/bot_one/handler \
    npx dim
```

`dim` ([DiscordInteractionManager](https://github.com/spatulox-discord/DiscordInteractionManager))
is an interactive CLI. **You never have to write the json by hand** — it
generates it for you:

```
💠 Discord Interaction Manager CLI
════════════════════════════════════════
1. Manage Interactions      -> deploy / update / delete / list
2. Generate Files           -> create a slash command or a context menu json
3. Help
4. Exit
```

- **Generate Files** walks you through name, description, options, permissions
  and scope, then writes the json into the right folder.
- **Manage Interactions** deploys it to Discord, and writes the id Discord
  assigned back into the file — commit that, it is what later updates target.
- Listing can also pull the commands already registered on Discord back down
  into json files, under `generated_commands/`.

### Where the files go

`dim` reads and writes `<DISCORD_INTERACTION_FOLDER>/<category>` and appends
`_dev` when `DISCORD_BOT_DEV` is set — exactly the convention
`src/share/HandlersPath.ts` uses to read them back at runtime.

**Run it once per bot.** `dim` is a separate process: it calls
`dotenv.config()` with no argument, so it only ever reads a `.env` at the
repository root — never `src/<bot>/.env.<bot>`. There is no root `.env` here,
which is why the command above feeds it that bot's variables explicitly
(`DISCORD_BOT_TOKEN` and `DISCORD_BOT_CLIENTID` included, not just the folder).

If you prefer, drop a temporary root `.env` holding the variables of the bot
you are working on and just run `npx dim`. Its own default folder is
`./handlers`, which no bot uses here, so `DISCORD_INTERACTION_FOLDER` is always
required.

### The fields it manages

| Field | Who fills it |
|---|---|
| `name`, `description`, `options`, `contexts`… | you, through the generator |
| `command_scope` | you, at generation time — `"global"` or `"guild"` |
| `default_member_permissions_string` | you — an array of discord.js `PermissionFlagsBits` keys, e.g. `["ModerateMembers"]`, empty for everyone |
| `default_member_permissions` | `dim`, computed from the field above |
| `id` | `dim`, after the first deploy — a string when global, a `{guildId: id}` map when guild-scoped |

> Changing the scope of an existing interaction needs **both** `command_scope`
> and `id` edited to the matching shape. A plain update will not do it.

## Layout

```
src/
  share/                     everything used by more than one bot
    BotType.ts               enum : one entry per bot, value = folder name
    HandlersPath.ts          loads handler json for a given bot, dev/prod aware
    modules/                 shared modules      (LogMessages)
    interactions/            shared interactions (ping)
    managers/                shared helpers around discord.js entities
    utils/                   shared utilities    (rateLimiter)
  bot_one/
    .env.bot_one             this bot's token (gitignored)
    handler/                 interaction manifests, deployed by `dim`
      commands/ commands_dev/ context_menu/ context_menu_dev/   (generated by `dim`)
    src/
      index.ts               entry point : builds the Bot and registers everything
      client.ts              this bot's Client and intents
      constantes.ts          this bot's channel / guild ids
      activities.ts          activities randomly displayed
      interactions/          this bot's own interactions
      modules/               this bot's own modules
      utils/
        RegisterInteractions.ts  maps interaction names -> functions
        RegisterModules.ts       registers and enables the modules
  bot_two/                   same structure
```

### The one rule about `src/share/`

**`share/` must never import from a bot folder.** The flow is one way:
`bot_one -> share`, `bot_two -> share`. When shared code needs to know which
bot is running it, pass a `BotType` in — that is what `LogMessages` does:

```ts
this.manager.register(new LogMessages(RegisterModules.BOT))
```

Importing `bot_one/` from `share/` creates a cycle between the library and the
apps, and drags bot-specific code into every bot that touches `share`.

### What the example bots show

- `/example` on bot one and `/example_two` on bot two — a command that belongs
  to a single bot, living in `src/<bot>/src/interactions/commands/`.
- `/ping` on **both** — one implementation in
  `src/share/interactions/commands/ping.ts`, registered twice, each bot loading
  its own `handler/commands/shared_example.json`.
- `LogMessages` — one shared module registered by both bots, told which bot it
  belongs to.
- `ExampleModule` — a module only one bot needs.

## Dev vs prod

`DISCORD_BOT_DEV` drives two things at once:

- `handler/commands_dev/` and `handler/context_menu_dev/` are loaded instead of
  `handler/commands/` and `handler/context_menu/`. The `_dev` files declare a
  different `name`, so your dev bots and your prod bots can live on Discord side
  by side.
- `src/<bot>/src/constantes.ts` returns the DEV ids instead of the PROD ones.

Any non-empty value means dev — set the variable to an **empty** value for
production (`DISCORD_BOT_DEV=false` would still be truthy).

Each bot also sets `CACHE_FOLDER` to its own folder, so the `.utilscache/`
written by `CacheManager` never collides between bots.

## Add a slash command

1. `npx dim` -> **Generate Files** -> slash command, with
   `DISCORD_INTERACTION_FOLDER` pointing at that bot. It writes
   `src/<bot>/handler/commands/mycommand.json` for you. Run it once with
   `DISCORD_BOT_DEV` set and once without to get the `_dev` twin, giving the
   dev one a different `name`.
2. Add `'mycommand'` to `HANDLERS_PATHS.commands` in `src/share/HandlersPath.ts`
   — it is a typed whitelist shared by every bot, `Handlers.load` throws for
   anything missing.
3. Write the handler in `src/<bot>/src/interactions/commands/mycommand.ts`, or
   in `src/share/interactions/commands/` if several bots need it.
4. Register it in that bot's `RegisterInteraction.slash()`:
   ```ts
   const json = await Handlers.load(RegisterInteraction.BOT, 'commands', 'mycommand');
   this.manager.registerSlash(json.name, mycommand)
   ```
5. `npx dim` -> **Manage Interactions** to deploy it to Discord.

Buttons, modals and select menus follow the same pattern, minus the json
(their name is the `customId` you set). `InteractionMatchType.START_WITH`
lets one handler serve every `customId` sharing a prefix.

## Add a module

Extend `Module` (or `ModuleWithCache` for persistent state), declare the
Discord events it listens to, and register it in that bot's
`RegisterModules.init()`. Put it in `src/share/modules/` if more than one bot
needs it. Modules can be enabled/disabled live from the `ModuleUI` panel posted
in the `module_ui` channel.

## Add a third bot

1. Copy `src/bot_one/` to `src/bot_three/`.
2. Add `BOT_THREE = "bot_three"` to `src/share/BotType.ts` — the value must
   match the folder name.
3. In the new folder, update `dotenv.config({path})` in `index.ts`, `botName`,
   the `BOT` constant in both `Register*.ts`, and the `name` of every
   `handler/**/*.json` so it does not clash with another bot on the same server.
4. Create `src/bot_three/.env.bot_three` with its own token and
   `CACHE_FOLDER=./src/bot_three`.
5. Add the scripts to `package.json`:
   ```json
   "dev": "concurrently \"npm run bot_one\" \"npm run bot_two\" \"npm run bot_three\"",
   "bot_three": "nodemon -e ts --exec ts-node src/bot_three/src/index.ts"
   ```
   and add it to `startjs` too.
