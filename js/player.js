// Player module - Gestion du joueur

import { playJumpSound } from './audio.js';

let positionX = 50;
let positionY = 0;
let isJumping = false;
let playerElement;

// Initialiser les propriétés du joueur
const initPlayer = () => {
  playerElement = document.querySelector("#player");
  positionX = 50;
  positionY = 0;
  isJumping = false;
  updatePlayerPosition();
};

// Mettre à jour la position du joueur sur l'écran
const updatePlayerPosition = () => {
  playerElement.style.left = positionX + "px";
  playerElement.style.bottom = positionY + "px";
};

// Fonction de saut
const jump = () => {
  if (isJumping) return;
  isJumping = true;
  
  // Jouer le son de saut
  playJumpSound();

  let upIntervale = setInterval(() => {
    if (positionY >= 200) {
      clearInterval(upIntervale);

      let downInterval = setInterval(() => {
        if (positionY <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          positionY -= 8;
          updatePlayerPosition();
        }
      }, 20);
    } else {
      positionY += 8;
      updatePlayerPosition();
    }
  }, 20);
};

// Déplacer le joueur à gauche
const moveLeft = () => {
  positionX -= 10;
  updatePlayerPosition();
};

// Déplacer le joueur à droite
const moveRight = () => {
  positionX += 10;
  updatePlayerPosition();
};

// Réinitialiser la position du joueur
const resetPlayerPosition = () => {
  positionX = 50;
  positionY = 0;
  updatePlayerPosition();
};

// Changer l'apparence du joueur selon le caractère sélectionné
const setPlayerCharacter = (characterType) => {
  playerElement.style.backgroundImage = `url('assets/${characterType}.webp')`;
};

// Export des fonctions pour les rendre disponibles aux autres modules
export {
  initPlayer,
  updatePlayerPosition,
  jump,
  moveLeft,
  moveRight,
  resetPlayerPosition,
  setPlayerCharacter,
  positionX,
  positionY,
  playerElement
};
