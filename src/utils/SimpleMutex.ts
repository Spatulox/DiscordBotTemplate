export class SimpleMutex {
    private locked: boolean; // Indique si le mutex est verrouillé
    private queue: Array<() => void>; // File d'attente des fonctions de résolution

    constructor() {
        this.locked = false;
        this.queue = [];
    }

    /**
     * Verrouille le mutex. Si le mutex est déjà verrouillé, la méthode retourne une promesse qui sera résolue une fois que le mutex sera disponible.
     * @returns Une promesse résolue lorsque le mutex est verrouillé.
     */
    async lock(): Promise<void> {
        if (this.locked) {
            return new Promise((resolve) => {
                this.queue.push(resolve);
            });
        }

        this.locked = true;
        return Promise.resolve();
    }

    /**
     * Déverrouille le mutex. Si une file d'attente existe, débloque le prochain élément dans la file.
     */
    unlock(): void {
        if (this.queue.length > 0) {
            const nextResolve = this.queue.shift();
            if (nextResolve) {
                nextResolve(); // Résout la promesse du prochain élément dans la file
            }
            return;
        }

        this.locked = false; // Déverrouille complètement si la file d'attente est vide
    }
}
