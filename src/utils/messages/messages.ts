import config from '../../config.json'
import { log } from "../log";
import { searchClientChannel } from "../guilds/channels";
import {createErrorEmbed, sendEmbed, sendEmbedErrorMessage} from "./embeds";
import { client } from '../client';
import { Client, DMChannel, TextChannel, ThreadChannel } from 'discord.js';

//----------------------------------------------------------------------------//

export async function crosspostMessage(client: Client, sentence: string, channelId: string, reactions = "default"): Promise<boolean> {

    try{
        let targetChannel = await searchClientChannel(client, channelId)
        if(!targetChannel){
            return false
        }
        try{
            const message = await targetChannel.send(sentence)
            log(`INFO : Message posted : ${sentence.split('\n')[0]}`)

            try{
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                log("WARNING : Problème lors de la promise d'attente d'une secondes (postMessage)")
            }

            try{
                await message.crosspost()
                log(`INFO : Crossposted message : ${sentence.split('\n')[0]}`)
                return true
            } catch(error){
                sendEmbedErrorMessage('ERROR when posting message : '+error+`\n> - Message : ${message}\n> - TargetChannel : ${targetChannel}`, targetChannel)
                log('ERROR : Error when posting message : '+error)
                return false
            }

        } catch(error){
            log('ERROR : Error when posting message : '+error)
        }
            return true
    } catch (e){
        let msg = `ERROR : Impossible to find the channel to send the message : \n> ${sentence}\n\n> ${e}`
        log(msg)
        try{
            const errorChannel = await searchClientChannel(client, config.errorChannel)
            if(errorChannel){
                sendEmbed(createErrorEmbed(msg), errorChannel)
            } else {
                log("ERROR : Impossible to execute the postMessage function, channel is false")
            }
        } catch (err){
            log(`ERROR : [postMessage() - second try catch] : ${err}`)
        }
        return false
    }
}

//----------------------------------------------------------------------------//

export async function sendMessage(messageContent: string, targetChannel: TextChannel | DMChannel | ThreadChannel | string | null = "") {
    log("INFO : "+messageContent)
    let channelId: string = config.logChannelId
    let channel: TextChannel | DMChannel | ThreadChannel | null

    if(targetChannel){
        if(typeof(targetChannel) === "string"){
            channel = await searchClientChannel(client, channelId)    
        } else {
            channel = targetChannel
        }
    } else {
        channel = await searchClientChannel(client, channelId)
    }

    try {
        if (!channel) {
            console.error(`Canal introuvable : ${targetChannel}`);
            return;
        }
        await channel.send(messageContent);

    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
    }
}

export async function sendMessageToInfoChannel(message: string){
    sendMessage(message, config.logChannelId)
}

//----------------------------------------------------------------------------//

export async function sendMessageToOwner(message: string){
    try {
        const user = await client.users.fetch(config.owner);
        await user.send(`${message}`);
        log(`${message}`);
        return;
    } catch (error) {
        const user = await client.users.fetch(config.owner);
        await user.send(`${message}`);
        log(`${message}`);
    }
}

//----------------------------------------------------------------------------//