import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';

const domManager = new DOMManager();
const game = new Game();

// Ici, on fait en sorte que sur le click, on fasse disparaître la zone "Demarrer une nouvelle partie"
document.querySelector(".setup-form").addEventListener("click",()=>{
    document.querySelector(".setup-form").setAttribute("hidden", null);
    document.querySelector(".game-area").removeAttribute("hidden");
})

// La fonction qui permet de faire le timer (toujours incomplet)
let seconds= 0;
function updateTimer(){
    const timer = document.querySelector(".game-timer");
    let mins = 0;
    let secs = 0;
    timer.textContent = `${mins} : ${secs}`;
    if(seconds >= 0)
        seconds++;
}
updateTimer();
setInterval(updateTimer,1000);


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



