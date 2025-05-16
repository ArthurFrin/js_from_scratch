import { loadVolumeSettings, playGameMusic, initAudioListeners } from './audio.js';
import { initPlayer, jump, moveLeft, moveRight, resetPlayerPosition } from './player.js';
import { afficherStatsAccueil } from './stats.js';
import { loopObstacleGeneration, resetGame, incrementScore, setUICallbacks } from './obstacles.js';
import { updateHUD, initCharacterSelection, selectSavedCharacter, showGameOver } from './ui.js';
import { loopPlatformGeneration, resetPlatforms } from './platforms.js';

//fonction pour créer des étoiles dans le fond du jeu
function createStars(nb = 80) {
  const container = document.getElementById('game-container');
  if (!container) return;
  container.querySelectorAll('.star').forEach(e => e.remove());
  for (let i = 0; i < nb; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);
    star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
    container.appendChild(star);
  }
}

const initGame = () => {
  setUICallbacks(updateHUD, showGameOver);
  
  initPlayer();
  
  afficherStatsAccueil();
  
  selectSavedCharacter();
  
  loadVolumeSettings();
  
  initAudioListeners();
  
  initCharacterSelection();
  
  initGameControls();
  
  initButtons();
  
  startScoreTimer();
};

const initGameControls = () => {
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "z") moveRight(true);
        if (event.key === "ArrowLeft" || event.key === "s") moveLeft(true);
        if (event.key === " ") jump();
    }); 

    document.addEventListener("keyup", (event) => {
        if (event.key === "ArrowRight" || event.key === "z") moveRight(false);
        if (event.key === "ArrowLeft" || event.key === "s") moveLeft(false);
    });
};

const initButtons = () => {
  document.querySelector("#restart-button").addEventListener("click", startGame);

  document.querySelector("#start-btn").addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game").classList.remove("hidden");
    startGame();
  });
};

const startGame = () => {
  const { lives, score } = resetGame();
  
  updateHUD(lives, score);
  
  resetPlayerPosition();
  
  playGameMusic();
  
  const screen = document.getElementById("game-over-screen");
  screen.classList.add("hidden");
  screen.style.display = "none";
  
  loopObstacleGeneration();
  
  resetPlatforms();
  loopPlatformGeneration();
};

const startScoreTimer = () => {
  setInterval(() => {
    incrementScore();
  }, 1000);
};

// Initialiser le jeu lorsque le DOM est chargé
window.addEventListener("DOMContentLoaded", () => {
  createStars(80);
  initGame();
});
