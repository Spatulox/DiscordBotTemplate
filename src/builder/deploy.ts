import { client } from "../utils/client.js";
import { listJsonFile, readJsonFile } from "../utils/server/files.js";
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { log } from "../utils/log.js";
import { loginBot } from "../utils/login.js";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { setTimeout } from "timers/promises";
import { Time } from "../utils/times/UnitTime.js";
import config from "../config.js";

export interface Command {
    name: string;
    description: string;
    options?: any[];
    default_member_permissions?: string | bigint | number;
    guildID?: string[];
    type?: number; // Optionnel, pour les menus contextuels
}

// Initialisation du REST après la création du client
client.rest = new REST({ version: '10' }).setToken(config.token);

export async function deployAllCommands(): Promise<void> {
    if (!(await loginBot(client))) {
        log("Erreur : Impossible de connecter le bot");
        return;
    }

    client.once("ready", async () => {
        log('INFO : Déploiement des commandes slash et menus contextuels');

        // 1. Lire les commandes slash
        const slashFiles = await listJsonFile('./commands/');
        // 2. Lire les menus contextuels
        const contextFiles = await listJsonFile('./context-menu/');

        if (!slashFiles || !contextFiles) {
            log('ERREUR : Impossible de lire les fichiers de commandes ou de menus contextuels');
            return;
        }

        // Tableaux pour les commandes globales (sans guildID)
        const globalCommands: Command[] = [];
        let totalDeployed = 0;
        let totalFiles = 0;

        // Fonction pour traiter un dossier de commandes
        async function processCommands(folderPath: string, isContextMenu: boolean = false): Promise<void> {
            const files = await listJsonFile(folderPath);
            if (!Array.isArray(files)) return;

            const filteredFiles = files.filter(f => !f.includes("example"));
            totalFiles += filteredFiles.length;

            for (const file of filteredFiles) {
                try {
                    const command: Command = await readJsonFile(`${folderPath}${file}`);

                    if (command.default_member_permissions && Array.isArray(command.default_member_permissions)) {
                        const bitfield = command.default_member_permissions
                            .map(perm => {
                            const flag = PermissionFlagsBits[perm as keyof typeof PermissionFlagsBits];
                            if (flag === undefined) {
                                throw new Error(
                                `Permission inconnue : "${perm}". Vérifiez l'orthographe dans votre JSON (Enumeration Discord : PermissionFlagsBits.X ).`
                                );
                            }
                            return flag;
                            })
                            .reduce((acc, val) => acc | val, BigInt(0));

                        command.default_member_permissions = Number(bitfield)
                    }

                    // Déploiement pour des guildes spécifiques ou globalement
                    if (command.guildID && command.guildID.length > 0) {
                        for (const guildId of command.guildID) {
                            // Créer une copie de la commande sans le paramètre guildID
                            const { guildID, ...commandWithoutGuildID } = command;

                            try {
                                await client.rest.put(
                                    Routes.applicationGuildCommands(config.clientId, guildId),
                                    { body: [commandWithoutGuildID] }
                                );
                                log(`SUCCÈS : ${isContextMenu ? 'Menu contextuel' : 'Commande'} "${command.name}" déployée sur la guilde ${guildId}`);
                                totalDeployed++;
                            } catch (err: any) {
                                log(`ERREUR : Impossible de déployer ${isContextMenu ? 'le menu contextuel' : 'la commande'} "${command.name}" sur la guilde ${guildId}. Raison : ${err.message}`);
                            }
                            await setTimeout(Time.second.SEC_01.toMilliseconds());
                        }
                    } else {
                        log(`AJOUT : ${isContextMenu ? 'Menu contextuel' : 'Commande'} "${command.name}" ajouté à la file d'attente globale`);
                        globalCommands.push(command);
                        totalDeployed++;
                    }
                } catch (err: any) {
                    log(`ERREUR : Lecture du fichier ${file} : ${err.message}`);
                }
            }
        }

        // Traiter les commandes slash
        await processCommands('./commands/');
        // Traiter les menus contextuels
        await processCommands('./context-menu/', true);

        // Déploiement global des commandes sans guildID
        if (globalCommands.length > 0) {
            try {
                await client.rest.put(
                    Routes.applicationCommands(client.user!.id),
                    { body: globalCommands }
                );
                log(`SUCCÈS : ${globalCommands.length}/${totalFiles} commandes/menus globaux déployés`);
            } catch (err: any) {
                log(`ERREUR CRITIQUE : Déploiement des commandes/menus globaux : ${err.message}`);
            }
        }

        process.exit();
    });
}

deployAllCommands();