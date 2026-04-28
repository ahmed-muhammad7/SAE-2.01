export class DOMManager {


  /**
   * Ajoute toutes les images d'une collection sur le gameBoard
   * @param {Image[]} images
   */
  createCards(images) {
      // On récupère le plateau pour pouvoir le manipuler
    const gameBoard = document.querySelector('.game-board');
     // Dans le cas où le plateau n'est pas vide, on rend son contenu vide
      gameBoard.innerHTML ="";
      // On va créer la structure de la carte ici. CHAQUE CARTE a un inner, et dans son inner il a un back et un front.
      images.forEach(image =>{
          const element = document.createElement("div");
          element.classList.add("card");
          element.innerHTML = `
              <div class="card-inner">
                  <div class="card-front">
                      <img src="./assets/images/mask1.jpg" alt="mask">
                  </div>
                  <div class="card-back">
                  <!-- On lui ajoute directement L'URL au lieu de mettre manuellement chacune des images (comme dans l'exemple) -->
                      <img src="${image.url}" alt ="${image.name}"
                  </div>
              </div>
          `;
          // Maintenant on append la carte sur le plateau
          gameBoard.append(element);
      })
    /**
     * Voici un exemple de contenu de card permettant de contenir une partie masqué
     * et l'image qui doit être révélée.
     *
     <div class="card-inner">
     <div class="card-front">
     <img src="./assets/images/mask1.jpg" alt="Hidden card">
     </div>
     <div class="card-back hidden">
     <img src="${image.url}" alt="${image.name}">
     </div>
     </div>
     */

  }
}
