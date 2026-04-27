import {MEMORY_URL} from './config.js';

/**
 * Service pour centraliser les appels API du jeu Memory.
 */
export class ApiService {
    /**
     * Crée une nouvelle partie sur le serveur.
     * @param {string} pseudo nom du joueur
     * @param {number} difficulty niveau de difficulé
     * @returns {Promise<GameReturn>}
     */
    static createGame = async (pseudo, difficulty) => {
        // On effectue une requête 'fetch' vers l'URL du serveur (configurée dans config.js) stv jai une bonne video yt sur sa
        // On utilise 'await' pour attendre que le serveur réponde
        const response = await fetch(`${MEMORY_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // On prévient le serveur qu'on lui envoie du JSON
            },
            // On transforme l'objet JavaScript en texte JSON pour le réseau
            body: JSON.stringify({
                name: pseudo,
                difficulty: difficulty
            })
        });

        // Si la réponse n'est pas ok, on arrête tout et on lance une erreur
        if (!response.ok) {
            throw new Error('Erreur lors de la création de la partie');
        }

        // Si c'est good on transforme le JSON reçu qui contient l'ID en objet
        return response.json();
    }

    /**
     * Met à jour le score à la fin d'une partie.
     * @param {number} gameId
     * @param {number} pairsRemaining
     * @returns {Promise<any>}
     */
    static updateGameResult = async (gameId, pairsRemaining) => {
        // On envoie les données à l'URL spécifique de la partie
        const response = await fetch(`${MEMORY_URL}/${gameId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // On envoie le nombre de paires qu'il reste à découvrir
            body: JSON.stringify({
                nombreCoupsRestant: pairsRemaining,
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du score');
        }

        // On renvoie la réponse, même si elle n'est pas forcément utilisée par l'application
        return response.json();
    }
}