import { showGameOver } from './ui.js';
import { score } from './obstacles.js';
import { checkPlatforms } from './platforms.js';
import { playJumpSound } from './audio.js';

let forceFall = false;

// Forcer la chuse du joueur a milieu d'une plateforme quand on appuie sur la flèche du bas
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    forceFall = true;
  }
});

//timer pour vérifier si le joueur est hors écran et le faire mourir après de 2 secondes
let outOfBoundsTimer = null;
const screenWidth = 800; 

const checkOutOfBounds = () => {
  if (!playerElement) return;
  const playerRect = playerElement.getBoundingClientRect();
  const gameRect = document.getElementById("game").getBoundingClientRect();
  const outLeft = playerRect.right < gameRect.left;
  const outRight = playerRect.left > gameRect.right;

  if (outLeft || outRight) {
    if (!outOfBoundsTimer) {
      outOfBoundsTimer = setTimeout(() => {
        showGameOver(score);
      }, 2000);
    }
  } else {
    if (outOfBoundsTimer) {
      clearTimeout(outOfBoundsTimer);
      outOfBoundsTimer = null;
    }
  }
};

// Vérifie la sortie d'écran toutes les secondes
setInterval(checkOutOfBounds, 1000);

// Ajuster la position du joueur
const adjustPlayerX = (amount) => {
  positionX += amount;
  updatePlayerPosition();
};

// Boucle de gravité pour faire tomber le joueur s'il n'est pas sur une plateforme
setInterval(() => {
  if (!isJumping && playerElement) {
    const platformY = checkPlatforms();
    if ((platformY === null && positionY > 0) || forceFall) {
      // Le joueur n'est pas sur une plateforme OU il force la descente
      positionY -= 8;
      if (positionY < 0) positionY = 0;
      updatePlayerPosition();
      forceFall = false;
    } else if (platformY !== null && positionY > platformY) {
      // Corrige la position si le joueur est au-dessus de la plateforme
      positionY = platformY;
      updatePlayerPosition();
    }
  }
}, 20);


let positionX = 50;
let positionY = 0;
let isJumping = false;
let playerElement;

const initPlayer = () => {
  playerElement = document.querySelector("#player");
  positionX = 50;
  positionY = 0;
  isJumping = false;
  updatePlayerPosition();
};

const updatePlayerPosition = () => {
  playerElement.style.left = positionX + "px";
  playerElement.style.bottom = positionY + "px";
};

const jump = () => {
  if (isJumping) return;
  isJumping = true;
  playJumpSound();

  const hauteurMax = 180;
  const startY = positionY;

  let upIntervale = setInterval(() => {
    if (positionY >= startY + hauteurMax) {
      clearInterval(upIntervale);

      let downInterval = setInterval(() => {
        const platformY = checkPlatforms();
        if (platformY !== null && positionY <= platformY + 10) {
          clearInterval(downInterval);
          positionY = platformY;
          updatePlayerPosition();
          isJumping = false;
        } else if (positionY <= 0) {
          clearInterval(downInterval);
          positionY = 0;
          updatePlayerPosition();
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

const moveLeft = () => {
  positionX -= 10;
  updatePlayerPosition();
};

const moveRight = () => {
  positionX += 10;
  updatePlayerPosition();
};

const resetPlayerPosition = () => {
  positionX = 50;
  positionY = 0;
  updatePlayerPosition();
};

const setPlayerCharacter = (characterType) => {
  playerElement.style.backgroundImage = `url('assets/${characterType}.webp')`;
};

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
  playerElement,
  adjustPlayerX
};
