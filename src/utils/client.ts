import { Client, GatewayIntentBits, Partials, User} from 'discord.js';
import { searchClientChannel } from './guilds/channels.js';
import { log } from './log.js';
import config from '../config.js';

export const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});



export let owner: User | null

export async function initOwner(): Promise<boolean>{

    if(config.sendToOwnerOrChannel === "0"){
        try{
            owner = await client.users.fetch(config.owner);
            owner.send('Bot online');
            return true
        } catch (e){
            owner = null
            log(`ERROR : Something went wrong when searching for the owner : ${e}`)
            return false
        }
    }
    else if(config.sendToOwnerOrChannel === "1"){
        try{
            const channelLogin = await searchClientChannel(client, config.logChannelId)
            if(channelLogin){
                channelLogin.send(`<@${config.owner}>, Bot is online!`);
                return true
            }
            return false
        } catch (e){
            log(`ERROR : Something went wrong when searching for the channel to send the online message : ${e}`)
            return false
        }
    }
    return false
}