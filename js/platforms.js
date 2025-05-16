import { playerElement, positionY, positionX, updatePlayerPosition, adjustPlayerX } from './player.js';

let platforms = [];
let platformGenerationTimeout;
let gameActive = true;

// Créer une plateforme
const createPlatform = () => {
  const platform = document.createElement("div");
  platform.classList.add("platform");
  document.querySelector("#game").appendChild(platform);

  // Position Y aléatoire entre 50 et 200 pixels
  const platformHeight = 20;
  const randomHeight = Math.floor(Math.random() * 120) + 80;
  const platformWidth = Math.floor(Math.random() * 100) + 100; // Largeur aléatoire entre 100 et 200px
  
  platform.style.width = platformWidth + "px";
  platform.style.height = platformHeight + "px";
  platform.style.bottom = randomHeight + "px";

  let position = 800;
  platform.style.left = position + "px";

  // Ajouter la plateforme à la liste
  const platformData = {
    element: platform,
    width: platformWidth,
    height: platformHeight,
    x: position,
    y: randomHeight,
    isPlayerOn: false
  };
  
  platforms.push(platformData);

  const moveInterval = setInterval(() => {
    if (position < -platformWidth) {
      clearInterval(moveInterval);
      platform.remove();
      platforms = platforms.filter(p => p.element !== platform);
    } else {
      position -= 3;
      platform.style.left = position + "px";
      platformData.x = position;

      // Si le joueur est sur cette plateforme il la suit
      if (platformData.isPlayerOn) {
        adjustPlayerX(-3);
      }
    }

    if (!gameActive) {
      clearInterval(moveInterval);
      platform.remove();
    }
  }, 20);
};

const getPlatformDelay = () => {
  return Math.floor(Math.random() * 1000) + 3000;
};

const loopPlatformGeneration = () => {
  if (gameActive) {
    createPlatform();
    const delay = getPlatformDelay();
    platformGenerationTimeout = setTimeout(loopPlatformGeneration, delay);
  }
};

// Vérifier si le joueur est sur une plateforme
const checkPlatforms = () => {
  let playerOnPlatform = false;
  
  const playerRect = playerElement.getBoundingClientRect();
  const playerBottom = positionY;
  const playerLeft = positionX;
  const playerRight = positionX + playerRect.width;
  
  platforms.forEach(platform => {
    if (
      playerBottom >= platform.y &&
      playerBottom <= platform.y + 8 && // tolérance = vitesse de chute
      playerRight > platform.x &&
      playerLeft < platform.x + platform.width
    ) {
      playerOnPlatform = true;
      platform.isPlayerOn = true;
    } else {
      platform.isPlayerOn = false;
    }
  });
  
  // Si le joueur est sur une plateforme, retourner la hauteur ajustée (y + hauteur de la plateforme)
  if (playerOnPlatform) {
    const platformOn = platforms.find(p => p.isPlayerOn);
    return platformOn.y + platformOn.height;
  }
  
  return null;
};

const resetPlatforms = () => {
  if (platformGenerationTimeout) {
    clearTimeout(platformGenerationTimeout);
  }

  document.querySelectorAll(".platform").forEach(platform => platform.remove());
  platforms = [];
  gameActive = true;
};

const stopPlatforms = () => {
  gameActive = false;
  if (platformGenerationTimeout) {
    clearTimeout(platformGenerationTimeout);
  }
};

export {
  loopPlatformGeneration,
  checkPlatforms,
  resetPlatforms,
  stopPlatforms
};