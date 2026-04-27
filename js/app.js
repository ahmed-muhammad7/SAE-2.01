import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';

const domManager = new DOMManager();
const game = new Game();

// Ici, on fait en sorte que sur le click, on fasse disparaître la zone "Demarrer une nouvelle partie"
document.querySelector(".setup-form").addEventListener("click",()=>{
    document.querySelector(".setup-form").setAttribute("hidden", null);
})

document.querySelector('.game-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    // Todo
    try {
        // Todo Spécifier les paramètres de createGame()
        const data = await ApiService.createGame();
        console.log('Success:', data, data.id);
        game.startGame(data.id);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Erreur lors de la création de la partie');
    }
});



