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
    const toutesLesImages = imageCollections[collectionName];


    //                                          GESTION DE LA DIFFICULTÉ

    // On définit combien de paires on veut selon la difficulté
    let nbPaires;
    if (difficultyLevel === 1) {
        nbPaires = 3; // Facile : 3 paires (6 cartes)
    } else if (difficultyLevel === 2) {
        nbPaires = 5; // Moyen : 5 paires (10 cartes)
    } else {
        nbPaires = 8; // Difficile : 8 paires (16 cartes)
    }


    //                                          DUPLICATION ET MÉLANGE

    // On "coupe" le tableau pour garder uniquement le nombre d'images voulu (selon la difficulté)
    const imagesDeBase = toutesLesImages.slice(0, nbPaires);

    // On crée un nouveau tableau avec 2 fois les images de base
    const cartesEnDouble = [...imagesDeBase, ...imagesDeBase];
    // On mélange le tout (-0.5 pour avoir 50% de tirer un nombre negatif pour melanger les cartes )
    cartesEnDouble.sort(() => Math.random() - 0.5);



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
        // on donne bien notre tableau "cartesEnDouble" qui a été mélangé !
        domManager.createCards(cartesEnDouble);
        tournerCartes();

    } catch (error) {
        // Si le serveur plante ou qu'il y a un souci de réseau
        console.error('Erreur lors du lancement :', error);
        alert(error.message || 'Erreur lors de la création de la partie');
    }
});


//                        Abandon


// Quand on clique sur Abandon, on arrête le temps et on revient au menu
document.getElementById('abandon').addEventListener('click', async () => {
    clearInterval(timerInterval);
    await game.endGame();
    document.querySelector(".game-area").setAttribute("hidden", "true");
    document.querySelector(".setup-form").removeAttribute("hidden");
    alert("Partie abandonnée ! Retour à l'accueil.");
});


//                        Cartes (Animation)


// On crée deux variables pour mémoriser l'état du jeu
let cartesRetournees = []; // Va stocker les cartes qu'on a cliquées
let peutCliquer = true;

// Fonction fléchée pour gérer les clics sur les cartes
const tournerCartes = () => {
    // On sélectionne toutes les cartes du plateau
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            // Le "return" arrête immédiatement la fonction.
            if (!peutCliquer || card.classList.contains("flip")) {
                return;
            }

            // On retourne la carte cliquée
            card.classList.add("flip");
            // On l'ajoute dans notre petite mémoire
            cartesRetournees.push(card);

            if (cartesRetournees.length === 2) {
                // On met le "bloqueur" pour bloquer les clics sur les autres cartes
                peutCliquer = false;

                // On lance un minuteur avec setTimeout (et plus setInterval !)
                setTimeout(() => {

                    cartesRetournees[0].classList.remove("flip");
                    cartesRetournees[1].classList.remove("flip");

                    // On vide notre mémoire pour le prochain tour
                    cartesRetournees = [];
                    // On retire le "bloqueur" pour qu'on puisse rejouer
                    peutCliquer = true;
                }, 1000);
            }
        });
    });
};