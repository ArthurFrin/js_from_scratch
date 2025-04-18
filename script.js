const player = document.querySelector("#player");

console.log(player);
let positionX = 50;
let positionY = 0;

let isJumping = false;
let obstacleGenerationTimeout;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "z") positionX += 10;
  if (event.key === "ArrowLeft" || event.key === "s") positionX -= 10;
  player.style.left = positionX + "px";

  if (event.key === " ") jump();
});

const jump = () => {
  if (isJumping) return;
  isJumping = true;

  let upIntervale = setInterval(() => {
    if (positionY >= 200) {
      clearInterval(upIntervale);

      let downInterval = setInterval(() => {
        if (positionY <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          positionY -= 8;
          player.style.bottom = positionY + "px";
        }
      }, 20);
    } else {
      positionY += 8;
      player.style.bottom = positionY + "px";
    }
  }, 20);
};

let gameOver = false;
let lives = 3;
let score = 0;

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

      if (checkCollision(player, bomb)) {
        clearInterval(moveInterval);
        bomb.remove();

        if (!gameOver) {
          lives--;
          updateHUD();

          if (lives <= 0) {
            gameOver = true;
            showGameOver();
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
  if (score > 40) return 1000;
  if (score > 20) return 1750;
  return 2500;
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
  return !(
    playerRect.top > obstacleRect.bottom ||
    playerRect.bottom < obstacleRect.top ||
    playerRect.left > obstacleRect.right ||
    playerRect.right < obstacleRect.left
  );
};

const showGameOver = () => {
  const screen = document.getElementById("game-over-screen");
  screen.classList.remove("hidden");
  screen.style.display = "block";
  console.log("Le joueur a perdu");
};

const startGame = () => {
  if (obstacleGenerationTimeout) {
    clearTimeout(obstacleGenerationTimeout);
  }
  
  document.querySelectorAll('.bomb').forEach(bomb => bomb.remove());
  
  lives = 3;
  score = 0;
  updateHUD();
  gameOver = false;
  player.style.left = "50px";
  positionX = 50;
  positionY = 0;
  player.style.bottom = "0px";
  
  const screen = document.getElementById("game-over-screen");
  screen.classList.add("hidden");
  screen.style.display = "none";
  
  loopObstacleGeneration();
};

document.querySelector("#restart-button").addEventListener("click", startGame);

document.querySelector("#start-btn").addEventListener("click", () => {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game").classList.remove("hidden");
  startGame();
});

document.querySelectorAll(".character").forEach((char) => {
  char.addEventListener("click", () => {
    document.querySelectorAll(".character").forEach(c => c.classList.remove("selected"));
    
    char.classList.add("selected");
    
    const characterType = char.dataset.character;
    
    if (characterType === 'gundam-blanc') {
      player.style.backgroundImage = `url('assets/${characterType}.webp')`;
    } else {
      player.style.backgroundImage = `url('assets/${characterType}.webp')`;
    }
    
    console.log(`Personnage sélectionné: ${characterType}`);
  });
});

const updateHUD = () => {
  const livesDisplay = document.getElementById("livesDisplay");
  if (livesDisplay) livesDisplay.textContent = "❤️".repeat(lives);

  const scoreDisplay = document.getElementById("scoreDisplay");
  if (scoreDisplay) scoreDisplay.textContent = `Score : ${score}`;
};

setInterval(() => {
  if (!gameOver) {
    score += 1;
    updateHUD();
  }
}, 1000);