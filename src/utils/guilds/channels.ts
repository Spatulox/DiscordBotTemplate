import {Client, DMChannel, GuildBasedChannel, Message, TextChannel, ThreadChannel } from 'discord.js';

//----------------------------------------------------------------------------//

export async function searchClientChannel(client: Client, channelId: string): Promise<TextChannel | DMChannel | ThreadChannel | null>{
    try{
      const channel = client.channels.cache.get(channelId) || (await client.channels.fetch(channelId));
  
      if (channel?.isTextBased() && 'send' in channel) {
        return channel as TextChannel | DMChannel | ThreadChannel;
      }
      return null
    } catch (e) {
      (`ERROR : Impossible to fetch the channel : ${channelId}\n> ${e}`)
      return null
    }
  }
  
  export async function searchMessageChannel(message: Message, channelId: string): Promise<GuildBasedChannel | null>{
    try{
      if (!message.guild) {
        console.log("ERROR : Message n'est pas dans un serveur ????? WTH");
        return null;
      }
  
      if (channelId && typeof channelId !== 'string') {
        console.log(`ERROR : channelId invalide : ${channelId}`);
        return null;
      }
  
      return message.guild.channels.cache.get(channelId) || (await message.guild.channels.fetch(channelId))// || message.channel
    } catch (e) {
      console.log(`ERROR : Impossible to fetch the channel : ${channelId}\n> ${e}`)
      return null
    }
  }
  