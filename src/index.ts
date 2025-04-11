//Librairies
import {version, ActivityType, ModalSubmitInteraction, CommandInteraction, StringSelectMenuInteraction } from 'discord.js'

// functions
import {log} from './utils/log'
import { checkInternetCo } from './utils/server/checkInternetCo'
import { executeSlashCommand } from './commands/executeCommand';
import { executeModalSubmit } from "./form/executeModalSubmit";
import { executeSelectMenu } from "./selectmenu/executeSelectmenu";
import { loginBot, setActivity } from './utils/login';
import { client } from './utils/client';
import { loadScheduledJobs } from './jobs/jobs';
import { checkAndUpdateMembers, handleMemberUpdate, handleNewMember } from './utils/guilds/members';
import { DO_NOT_AFFECT_THIS_USERS, TARGET_GUILD_ID } from './utils/constantes';

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
		//loadScheduledJobs()
		//checkAndUpdateMembers();
		if(client && client.user){
			log(`INFO : ${client.user.username} has logged in, waiting...`)
		}
		setActivity(client, 'La Démocratie', ActivityType.Watching)
	});
	
	client.on('interactionCreate', async (interaction) => {
		try {executeSelectMenu
			if (interaction.isCommand()) {
				// Si l'interaction est une commande slash
				executeSlashCommand(interaction as CommandInteraction);
			} else if (interaction.isModalSubmit()) {
				// Si l'interaction est un modal submit
				executeModalSubmit(interaction as ModalSubmitInteraction);
			} else if (interaction.isStringSelectMenu()) {
				// Si l'interaction est un selectMenu
				executeSelectMenu(interaction as StringSelectMenuInteraction);
			} else {
				console.warn(`WARN : Type d'interaction non pris en charge (${interaction.type})`);
			}
		} catch (error) {
			console.error(`ERROR : Une erreur s'est produite lors du traitement de l'interaction`, error);
		}
	});

	/*client.on('guildMemberUpdate', async (oldMember, newMember) => {
        if (newMember.guild.id === TARGET_GUILD_ID) {

            if(DO_NOT_AFFECT_THIS_USERS.includes(newMember.user.id) || newMember.user.bot){
                console.log(`Skipping user: ${newMember.user.username} (ID: ${newMember.user.id})`);
                return;
            }
			
            await handleMemberUpdate(oldMember, newMember);
        }
    });

    client.on('guildMemberAdd', async (member) => {
        if (member.guild.id === TARGET_GUILD_ID) {

            if(DO_NOT_AFFECT_THIS_USERS.includes(member.user.id) || member.user.bot){
                console.log(`Skipping user: ${member.user.username} (ID: ${member.user.id})`);
                return;
            }

            await handleNewMember(member);
        }
    });*/
}

main()

