//Librairies
import Discord from 'discord.js'
// Files
import config from './config.json' with { type: 'json' };

// functions
import {log, recapBotsErrors} from './utils/functions.js'
import { checkInternetCo } from './utils/checkInternetCo.js'
import { executeSlashCommand } from './commands/executeCommand.js';
import { executeModalSubmit } from "./form/executeModalSubmit.js";
import { loginBot, setActivity } from './utils/login.js';
import { client, initOwner } from './client.js';

function main(){

	process.env.YTDL_NO_UPDATE = '1';

	log('INFO : ----------------------------------------------------')
	log('INFO : Starting Program');

	checkInternetCo()
    .then(() => {

		log(`INFO : Using discord.js version: ${Discord.version}`);
		log('INFO : Creating Client')
		log('INFO : Trying to connect to Discord Servers')
		if(!loginBot(client)){
			log('INFO : Stopping program')
			process.exit()
		}

		client.on('ready', async () => {
			log(`INFO : ${client.user.username} has logged in, waiting...`)
			setActivity(client)
			initOwner()
		});

		client.on('interactionCreate', async (interaction) => {
			executeSlashCommand(interaction, client)
		  });

		client.on('interactionCreate', async interaction => {
			executeModalSubmit(interaction, client)
		});
	});
}

main()

