/** // Note pour comprendre : typedef va définir l'objet et property les "colonnes" de l'objet
    // Donc ici, pour une instance d'Image, il va avoir un id, un nom et un url.
 * @typedef {Object} Image
 * @property {number} id
 * @property {string} name
 * @property {string} url
 */

/** // Encore une note : une Collection est définie comme un ensemble d'Images (défini juste au dessus)
 * @typedef {Image[]} Collection
 */

/** // Une dernière note : un nouvel objet est crée, et contient 3 Collections qui eux contiennent des Images.
 * @typedef {Object} ImagesCollection
 * @property {Collection} animals
 * @property {Collection} fruits
 * @property {Collection} cars
 */
