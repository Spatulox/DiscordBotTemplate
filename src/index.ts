//Librairies
import {version, ActivityType, ModalSubmitInteraction, CommandInteraction, StringSelectMenuInteraction, ContextMenuCommandInteraction } from 'discord.js'

// functions
import {log} from './utils/log'
import { checkInternetCo } from './utils/server/checkInternetCo'
import { executeSlashCommand } from './commands/executeCommand';
import { executeModalSubmit } from "./form/executeModalSubmit";
import { executeSelectMenu } from "./selectmenu/executeSelectmenu";
import { loginBot, setActivity } from './utils/login';
import { client } from './utils/client';
import { loadScheduledJobs } from './jobs/jobs';
import { executeContextMenu } from './context-menu/executeContextMenu';

async function main(){

	log('INFO : ----------------------------------------------------')
	log('INFO : Starting Program');

	await checkInternetCo()

	log(`INFO : Using discord.js version: ${version}`);
	log('INFO : Trying to connect to Discord Servers')
	
	if(!loginBot(client)){
		log('INFO : Stopping program')
		process.exit()
	}

	client.on('ready', async () => {
		loadScheduledJobs()
		if(client && client.user){
			log(`INFO : ${client.user.username} has logged in, waiting...`)
		}
		setActivity(client, 'La Démocratie', ActivityType.Watching)
	});
	
	client.on('interactionCreate', async (interaction) => {
		/*console.log({
			type: interaction.type,
			isChatInputCommand: interaction.isChatInputCommand(),
			isModalSubmit: interaction.isModalSubmit(),
			isStringSelectMenu: interaction.isStringSelectMenu(),
			isContextMenuCommand: interaction.isContextMenuCommand(),
			commandType: interaction.isContextMenuCommand() ? interaction.commandType : null,
			commandName: "commandName" in interaction ? interaction.commandName : "Unknown",
			commandId: "commandId" in interaction ? interaction.commandId : "No ID"
		});*/
		try {
			if (interaction.isChatInputCommand()) {
				executeSlashCommand(interaction as CommandInteraction);
			} else if (interaction.isModalSubmit()) {
				executeModalSubmit(interaction as ModalSubmitInteraction);
			} else if (interaction.isStringSelectMenu()) {
				executeSelectMenu(interaction as StringSelectMenuInteraction);
			} else if (interaction.isContextMenuCommand()) {
				executeContextMenu(interaction as ContextMenuCommandInteraction);
			} else {
				console.warn(`WARN : Type d'interaction non pris en charge (${interaction.type})`);
			}
		} catch (error) {
			console.error(`ERROR : Une erreur s'est produite lors du traitement de l'interaction`, error);
		}
	});
}

main()

