
import { playBonusKillSound, playDamageSound } from './audio.js';
import { playerElement } from './player.js';

let bombCombo = 0;
let obstacleGenerationTimeout;
let gameOver = false;
let lives = 3;
let score = 0;
let updateHUDCallback = null;
let showGameOverCallback = null;

const setUICallbacks = (updateHUDFunc, showGameOverFunc) => {
  updateHUDCallback = updateHUDFunc;
  showGameOverCallback = showGameOverFunc;
};

// Créer un obstacle (bombe) avec hauteur aléatoire sur 5 paliers, 1er palier beaucoup plus fréquent
const createBomb = () => {
  const bomb = document.createElement("div");
  bomb.classList.add("bomb");
  document.querySelector("#game").appendChild(bomb);

  const bombHeights = [0, 110, 160, 210, 260];
  const bombProbas = [0.65, 0.22, 0.08, 0.035, 0.015];

  const r = Math.random();
  let acc = 0;
  let chosenIndex = 0;
  for (let i = 0; i < bombProbas.length; i++) {
    acc += bombProbas[i];
    if (r < acc) {
      chosenIndex = i;
      break;
    }
  }

  const bombHeight = bombHeights[chosenIndex];
  bomb.style.bottom = bombHeight + "px";

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

        bombCombo++;
        if (bombCombo >= 3) {
          // Combo réussi :détruit toutes les bombes à l'écran et on donne 20 points
          const gameContainer = document.querySelector('#game');
          if (gameContainer) {
            const children = gameContainer.children;
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child.classList.contains('bomb')) {
                child.classList.add('explosion');
                setTimeout(() => child.remove(), 500);
              }
            }
          }
          score += 20;
          if (updateHUDCallback) updateHUDCallback(lives, score);
          bombCombo = 0;
        }
      } else if (collisionResult === true) {
        // Reset combo et perte de vie
        bombCombo = 0;
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

const getObstacleDelay = () => {
  let baseDelay;
  if (score > 40) baseDelay = 1000;
  else if (score > 20) baseDelay = 1750;
  else baseDelay = 2500;
  // Ajoute un peu d'aléatoire (+/- 400ms)
  return baseDelay + Math.floor(Math.random() * 400) - 200;
};

const loopObstacleGeneration = () => {
  if (!gameOver) {
    createBomb();
    const delay = getObstacleDelay();
    obstacleGenerationTimeout = setTimeout(loopObstacleGeneration, delay);
  }
};

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

const incrementScore = () => {
  if (!gameOver) {
    score += 1;
    if (updateHUDCallback) updateHUDCallback(lives, score);
  }
};

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
