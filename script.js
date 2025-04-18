const player = document.querySelector("#player");

console.log(player);
let positionX = 50;
let positionY = 0;

let isJumping = false;
let obstacleGenerationTimeout;
let gameMusic;

// Fonction pour jouer la musique du jeu
const playGameMusic = () => {
  if (!gameMusic) {
    gameMusic = new Audio('assets/arcade-beat.mp3');
    gameMusic.loop = true;
    gameMusic.volume = 0.3; // Volume à 50%
  }
  gameMusic.currentTime = 0;
  gameMusic.play().catch(err => console.log('Autoplay prevented:', err));
};

const stopGameMusic = () => {
  if (gameMusic) {
    gameMusic.pause();
  }
};

const playGameOverSound = () => {
  const gameOverSound = new Audio('assets/game-over.mp3');
  gameOverSound.volume = 0.1;
  gameOverSound.play().catch(err => console.log('Sound play prevented:', err));
};

const playDamageSound = () => {
  const damageSound = new Audio('assets/damage.mp3');
  damageSound.volume = 0.5;
  damageSound.play().catch(err => console.log('Sound play prevented:', err));
};

const playBonusKillSound = () => {
  const bonusKillSound = new Audio('assets/bonus-kill.mp3');
  bonusKillSound.volume = 0.3;
  bonusKillSound.play().catch(err => console.log('Sound play prevented:', err));
};

const playJumpSound = () => {
  const jumpSound = new Audio('assets/jump.mp3');
  jumpSound.volume = 0.4;
  jumpSound.play().catch(err => console.log('Jump sound play prevented:', err));
};

let selectedCharacter = localStorage.getItem("lastSelectedCharacter") || "gundam-blanc"; // Default character or last selected

let stats = JSON.parse(localStorage.getItem("stats")) || {
  scores: [],
  victories: [],
  characters: {}, // { "gundam-blanc": 3, "gundam-bleu": 1, ... }
};

winScore = 70; // Score pour gagner

const getNombreParties = () => stats.scores.length;

const getScoreMoyen = () => {
    if (stats.scores.length === 0) return 0;
    return (stats.scores.reduce((acc, val) => acc + val, 0) / stats.scores.length).toFixed(2);
};

const getTopScore = () => {
  if (stats.scores.length === 0) return 0;
  return Math.max(...stats.scores);
};

const getPersoPrincipal = () => {
  const entries = Object.entries(stats.characters);
  if (entries.length === 0) return "Aucun";
  return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
};

const getTauxVictoire = () => {
  if (stats.victories.length === 0) return "0%";
  const wins = stats.victories.filter((vic) => vic === true).length;
  const total = stats.victories.length;
  return ((wins / total) * 100).toFixed(1) + "%";
};

const afficherStatsAccueil = () => {
  document.getElementById("nb-parties")
  .textContent = `Parties jouées : ${getNombreParties()}`;
  document.getElementById("score-moyen")
  .textContent = `Score moyen : ${getScoreMoyen()}`;
  document.getElementById("top-score").
  textContent = `Meilleur score : ${getTopScore()}`;
  document.getElementById("taux-victoire")
  .textContent = `Taux de victoire : ${getTauxVictoire()}`;
  document.getElementById("perso-populaire")
  .textContent = `Personnage le plus joué : ${getPersoPrincipal()}`;
};

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "z") positionX += 10;
  if (event.key === "ArrowLeft" || event.key === "s") positionX -= 10;
  player.style.left = positionX + "px";

  if (event.key === " ") jump();
});

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

      const collisionResult = checkCollision(player, bomb);
      
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
  
  // Le joueur saute sur l'obstacle
  if (playerRect.bottom < obstacleRect.top + 10 &&
      playerRect.bottom > obstacleRect.top - 10 &&
      playerRect.right > obstacleRect.left &&
      playerRect.left < obstacleRect.right) {
    // L'obstacle est détruit, le joueur gagne 5 + 3 points bonus
    score += 8;
    updateHUD();
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

const showGameOver = () => {
  const screen = document.getElementById("game-over-screen");
  screen.classList.remove("hidden");
  screen.style.display = "block";

  stopGameMusic();
  playGameOverSound();

  const isWin = score >= winScore;
  stats.scores.push(score);
  stats.victories.push(isWin);
  if (!stats.characters[selectedCharacter])
    stats.characters[selectedCharacter] = 0;
  stats.characters[selectedCharacter]++;
  localStorage.setItem("stats", JSON.stringify(stats));

  const best = getTopScore();
  const bestText = document.getElementById("best-score-text");
  if (bestText) bestText.textContent = `Meilleur score : ${best}`;

  console.log("Le joueur a perdu");
};

const startGame = () => {
  if (obstacleGenerationTimeout) {
    clearTimeout(obstacleGenerationTimeout);
  }

  document.querySelectorAll(".bomb").forEach((bomb) => bomb.remove());

  lives = 3;
  score = 0;
  updateHUD();
  gameOver = false;
  player.style.left = "50px";
  positionX = 50;
  positionY = 0;
  player.style.bottom = "0px";

  // Jouer la musique du jeu
  playGameMusic();

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
    document
      .querySelectorAll(".character")
      .forEach((c) => c.classList.remove("selected"));

    char.classList.add("selected");

    const characterType = char.dataset.character;

    if (!stats.characters[characterType]) stats.characters[characterType] = 0;
    selectedCharacter = characterType;
    localStorage.setItem("lastSelectedCharacter", characterType); // Sauvegarde du dernier personnage choisi

    if (characterType === "gundam-blanc") {
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

window.addEventListener("DOMContentLoaded", () => {
  afficherStatsAccueil();
  
  const savedCharacter = localStorage.getItem("lastSelectedCharacter") || "gundam-blanc"; // Default character
  selectedCharacter = savedCharacter;
  
  player.style.backgroundImage = `url('assets/${savedCharacter}.webp')`;
  
  document.querySelectorAll('.character').forEach(char => {
    if (char.dataset.character === savedCharacter) {
      char.classList.add('selected');
    } else {
      char.classList.remove('selected');
    }
  });
});
