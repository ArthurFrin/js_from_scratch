// Obstacles module - Gestion des obstacles

import { playBonusKillSound, playDamageSound } from './audio.js';
import { playerElement } from './player.js';

let obstacleGenerationTimeout;
let gameOver = false;
let lives = 3;
let score = 0;
let updateHUDCallback = null;
let showGameOverCallback = null;

// Définir les callbacks pour les fonctions UI
const setUICallbacks = (updateHUDFunc, showGameOverFunc) => {
  updateHUDCallback = updateHUDFunc;
  showGameOverCallback = showGameOverFunc;
};

// Créer un obstacle (bombe)
const createBomb = () => {
  const bomb = document.createElement("div");
  bomb.classList.add("bomb");
  document.querySelector("#game").appendChild(bomb);

  let position = 800;
  bomb.style.left = position + "px";

  const moveInterval = setInterval(() => {
    if (position < 0) {
      score += 5;
      clearInterval(moveInterval);
      bomb.remove();
    } else {
      position -= 5;
      bomb.style.left = position + "px";

      const collisionResult = checkCollision(playerElement, bomb);
      
      if (collisionResult === "jump") {
        clearInterval(moveInterval);
        bomb.remove();
        playBonusKillSound();
      } else if (collisionResult === true) {
        clearInterval(moveInterval);
        bomb.remove();

        if (!gameOver) {
          lives--;
          playDamageSound();
          if (updateHUDCallback) updateHUDCallback(lives, score);

          if (lives <= 0) {
            gameOver = true;
            if (showGameOverCallback) showGameOverCallback(score);
          } else {
            console.log("vies restantes: " + lives);
          }
        }
      }
    }
    if (gameOver) bomb.remove();
  }, 20);
};

// Calculer le délai entre la génération des obstacles en fonction du score
const getObstacleDelay = () => {
  if (score > 40) return 1000;
  if (score > 20) return 1750;
  return 2500;
};

// Boucle de génération d'obstacles
const loopObstacleGeneration = () => {
  if (!gameOver) {
    createBomb();
    const delay = getObstacleDelay();
    obstacleGenerationTimeout = setTimeout(loopObstacleGeneration, delay);
  }
};

// Vérifier les collisions entre le joueur et un obstacle
const checkCollision = (player, obstacle) => {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  
  // Le joueur saute sur l'obstacle
  if (playerRect.bottom < obstacleRect.top + 10 &&
      playerRect.bottom > obstacleRect.top - 10 &&
      playerRect.right > obstacleRect.left &&
      playerRect.left < obstacleRect.right) {
    // L'obstacle est détruit, le joueur gagne 5 + 3 points bonus
    score += 8;
    if (updateHUDCallback) updateHUDCallback(lives, score);
    playBonusKillSound();
    return "jump";
  }
  
  return !(
    playerRect.top > obstacleRect.bottom ||
    playerRect.bottom < obstacleRect.top ||
    playerRect.left > obstacleRect.right ||
    playerRect.right < obstacleRect.left
  );
};

// Réinitialiser les variables de jeu
const resetGame = () => {
  if (obstacleGenerationTimeout) {
    clearTimeout(obstacleGenerationTimeout);
  }

  document.querySelectorAll(".bomb").forEach((bomb) => bomb.remove());

  lives = 3;
  score = 0;
  gameOver = false;
  
  return { lives, score };
};

// Incrémenter le score
const incrementScore = () => {
  if (!gameOver) {
    score += 1;
    if (updateHUDCallback) updateHUDCallback(lives, score);
  }
};

// Export des fonctions et variables pour les rendre disponibles aux autres modules
export {
  createBomb,
  loopObstacleGeneration,
  resetGame,
  incrementScore,
  score,
  lives,
  gameOver,
  setUICallbacks
};
