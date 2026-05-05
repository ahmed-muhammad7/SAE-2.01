import {ApiService} from './ApiService.js';

export class Game {
    /**
     * @type {number} id identifiant de la partie en cours
     */
    #id;


    async endGame(pairesRestantes) {
        try {
            // On utilise le vrai ID (this.#id) et le vrai chiffre
            const result = await ApiService.updateGameResult(this.#id, pairesRestantes);
            console.log('Fin de partie enregistrée sur le serveur :', result);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Erreur lors de la fin de la partie');
        }
    }

    /**
     * Start a new game.
     * @param {number} id - The game ID.
     */
    startGame(id) {
        this.#id = id;
    }
}