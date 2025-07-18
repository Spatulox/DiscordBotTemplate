import { log } from "../log.js";
import path from 'path'
import fs from 'fs'
import { createErrorEmbed, returnToSendEmbed } from "../messages/embeds.js";
import { TextChannel } from "discord.js";

//----------------------------------------------------------------------------//

export function readJsonFile(fileName: string): any | string {
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        log(`ERROR : Erreur de lecture du fichier JSON ${fileName}: ${error}`);
        return 'Error';
    }
}

export async function listDirectory(directoryPath: string): Promise<string[] | boolean> {
    try {
        const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });
        const directories = files.filter(file => file.isDirectory()).map(dir => dir.name);
        return directories;
    } catch (error) {
        console.log(`ERROR: Impossible de lire le dossier : ${directoryPath} : ${error}`);
        return false;
    }
}


//----------------------------------------------------------------------------//

export async function listJsonFile(directoryPath: string): Promise<string[] | false> {
    try {
        const files = await fs.promises.readdir(directoryPath);
        return files.filter(file => path.extname(file) === '.json');
    } catch (err) {
        log('ERROR : impossible to read the directory: '+err);
        return false;
    }
}

//----------------------------------------------------------------------------//

export async function listFile(directoryPath: string, type: string): Promise<string[] | string> {
    
    if(typeof(type) !== 'string' || typeof(directoryPath) !== 'string'){
        return 'Type and path must me string'
    }

    try {
        if(type.includes(".")){
            type = type.split('.')[1]!
        }
        const files = await fs.promises.readdir(directoryPath);
        return files.filter(file => path.extname(file) === '.' + type);
    } catch (err) {
        log('ERROR : impossible to read the directory: '+err);
        return 'Error';
    }
}