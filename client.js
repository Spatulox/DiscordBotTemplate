import { Client, GatewayIntentBits, Events, Partials} from 'discord.js';
import { searchClientChannel } from './utils/functions.js';
import config from './config.json' with { type: 'json' };

export const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessages
    ],
});



export let owner

export async function initOwner(){

    if(config.sendToOwnerOrChannel === "0"){
        try{
            owner = await client.users.fetch(config.owner);
            owner.send('Bot online');
        } catch (e){
            owner = null
            log(`ERROR : Something went wrong when searching for the owner : ${e}`)
        }
    }
    else if(config.sendToOwnerOrChannel === "1"){
        try{
            const channelLogin = await searchClientChannel(client, config.channelPingLogin)
            if(channelLogin){
                channelLogin.send(`<@${config.owner}>, Bot is online!`);
            }
        } catch (e){
            log(`ERROR : Something went wrong when searching for the channel to send the online message : ${e}`)
        }

    }
}