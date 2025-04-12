import { ActivityType } from 'discord.js'
import config from '../config.json' with { type: 'json' };

export async function loginBot(client) {
    let ok = false;
    let tries = 0;
    const maxTries = 3;

    if (config.token !== "") {
        try {

            // Tant que le bot n'est pas connecté et que le nombre de tentatives est inférieur à maxTries, tenter de se connecter.
            while (ok === false && tries < maxTries) {
                ok = await client.login(config.token)
                    .then(() => {
                        client.user.setActivity('la Démocratie', { type: ActivityType.Watching });

                        client.once('ready', () => {
                            console.log(`Connecté en tant que ${client.user.tag} sur ${client.guilds.cache.size} serveurs.`);

                            // Liste des serveurs sur lesquels le bot est connecté.
                            client.guilds.cache.forEach(guild => {
                                console.log(` - ${guild.name}`);
                            });
                        });
                        return true
                    })
                    .catch(async (error) => {
                        console.log(`${error} Nouvel essai...`);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        tries++;
                        return false
                    });
            }

            // Si après maxTries tentatives le bot n'est pas connecté, gérer l'erreur.
            if (tries === maxTries) {
                console.error('ERROR : Impossible de se connecter après plusieurs tentatives.');
                return false
            }
            return true

        } catch (error) {
            console.error(`ERROR : Connexion impossible : ${error}`)
        }
    }
    return false
}

export async function setActivity(client){
    client.user.setActivity({
        name:"Seems I'm in developpement...",
        type: ActivityType.Watching
    })
}