import dotenv from 'dotenv';
import configJson from './config.json' with { type: 'json' };

dotenv.config();

const { DISCORD_TOKEN } = process.env;

for (const [key, value] of Object.entries({ DISCORD_TOKEN })) {
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
}

if (!DISCORD_TOKEN) {
  throw new Error('Missing environment variables: DISCORD_TOKEN, MUSIC_PATH');
}

const config = parseConfig(configJson);
export default config;



function parseConfig(json: typeof configJson): Config {
  if (json.sendChannelErrors !== "yes" && json.sendChannelErrors !== "no") {
    throw new Error('sendChannelErrors must be "yes" or "no"');
  }

  return {
    ...json,
    token: DISCORD_TOKEN || '',
    sendChannelErrors: json.sendChannelErrors,
  };
}


type Config = {
    clientId: string,
    channelPingLogin:string,
    owner: string,
    sendToOwnerOrChannel: string,

    logChannelId: string,
    errorChannel: string,
    sendChannelErrors:"yes" | "no",
    token: string,
    excludedInvites: string[]
}














/*
function expandPath(path: string): string {
  if (!path) return path;
  return path.replace(/^\$HOME/, process.env.HOME || '');
}
*/