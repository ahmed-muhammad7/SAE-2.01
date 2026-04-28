// On importe les classes créées dans les autres fichiers pour pouvoir les utiliser ici.
import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';
import {imageCollections} from "./ImageCollection.js";


// On crée une "instance" (un objet) à partir de nos classes.
// Ça va nous permet d'utiliser leurs méthodes (comme game.startGame())

const domManager = new DOMManager();
const game = new Game();



//                         Config du Chronometre


// On initialise le compteur à 0.
let seconds = 0;

// C'est important pour pouvoir l'arrêter quand la partie est finie.
let timerInterval = null;

// On déclare la fonction qui va mettre à jour l'affichage du temps.
const updateTimer = () => {
    // On cible la balise <p> dans le HTML qui va afficher le chrono.
    const timerElement = document.querySelector(".game-timer");

    // On calcule le nombre de minutes
    const mins = Math.floor(seconds / 60);

    // On calcule les secondes restantes avec le modulo (%).
    // Le padStart sert a si on a 5 secondes, sa écrit "05" au lieu de "5".
    const secs = (seconds % 60).toString().padStart(2, '0');

    timerElement.textContent = `${mins} : ${secs}`;

    // On rajoute 1 seconde pour le prochain tour.
    seconds++;
};


//                        Formulaire




// On met 'async' devant car on va faire un appel au serveur qui prend du temps
document.querySelector('.game-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // On va piocher les valeurs que le joueur a tapées/choisies dans le HTML grâce aux 'id'.
    const pseudo = document.getElementById('pseudo').value;
    // On transforme la valeur de difficulté en "vrai" chiffre avec parseInt
    const difficultyLevel = parseInt(document.getElementById('difficulty').value);
    const collectionName = document.getElementById('collection').value;
    // On stocke le nom de la collection puis on met le nom de la collection dans le tableau d'images
    const images = imageCollections[collectionName];
    try {
        // On demande au fichier ApiService d'envoyer la requête POST au serveur.
        // 'await' met le code en pause jusqu'à ce que le serveur nous réponde avec l'ID de la partie.
        const data = await ApiService.createGame(pseudo, difficultyLevel);
        console.log('Partie créée avec succès ! ID:', data.id);
        //  on modifie le DOM
        // On cache le menu d'accueil en lui ajoutant "hidden".
        document.querySelector(".setup-form").setAttribute("hidden", "true");
        // On affiche le plateau de jeu en lui retirant son "hidden".
        document.querySelector(".game-area").removeAttribute("hidden");

        // On remet le chrono à zéro.
        seconds = 0;
        updateTimer();
        // On lance la fonction updateTimer sera appelée toutes les (1 seconde).
        timerInterval = setInterval(updateTimer, 1000);

        // On lui transmet toutes les infos dont il a besoin pour préparer le plateau.
        game.startGame(data.id);
        domManager.createCards(images);
        tournerCartes();
    } catch (error) {
        // Si le serveur plante ou qu'il y a un souci de réseau
        console.error('Erreur lors du lancement :', error);
        alert(error.message || 'Erreur lors de la création de la partie');
    }
});

// On va créer une fonction pour pouvoir faire tourner les cartes (idée, si ça ne marche pas/ pas optimal on pourra l'enlever)
function tournerCartes() {
    // On veut ajouter le fait que la carte tourne lors du click. Donc d'abord on sélectionne l'ensemble des cartes
    const cards = document.querySelectorAll(".card");

// Pour chaque carte, on va lui ajouter l'évènement click et montrer l'image (en lui ajoutant/enlevant la classe flip)
    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.add("flip");
        })
    })

// Après que la carte s'est retournée, on la reretourne de manière à cacher l'image
    cards.forEach(card => {
        card.addEventListener("click", () => {
            setInterval(() => {
                card.classList.remove("flip");
            }, 600)
        })
    })
}