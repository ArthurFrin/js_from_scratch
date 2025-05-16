// Main module - Point d'entrée principal du jeu

import { loadVolumeSettings, playGameMusic, initAudioListeners } from './audio.js';
import { initPlayer, jump, moveLeft, moveRight, resetPlayerPosition } from './player.js';
import { afficherStatsAccueil } from './stats.js';
import { loopObstacleGeneration, resetGame, incrementScore, setUICallbacks } from './obstacles.js';
import { updateHUD, initCharacterSelection, selectSavedCharacter, showGameOver } from './ui.js';

// Initialiser le jeu
const initGame = () => {
  // Connecter les modules avec des callbacks pour éviter les dépendances circulaires
  setUICallbacks(updateHUD, showGameOver);
  
  // Initialiser le joueur
  initPlayer();
  
  // Afficher les statistiques
  afficherStatsAccueil();
  
  // Sélectionner le personnage sauvegardé
  selectSavedCharacter();
  
  // Charger les paramètres audio
  loadVolumeSettings();
  
  // Initialiser les écouteurs pour l'audio
  initAudioListeners();
  
  // Initialiser les écouteurs pour la sélection des personnages
  initCharacterSelection();
  
  // Initialiser les écouteurs pour les contrôles du jeu
  initGameControls();
  
  // Initialiser les boutons
  initButtons();
  
  // Démarrer le compteur de score
  startScoreTimer();
};

// Initialiser les contrôles du jeu
const initGameControls = () => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "z") moveRight();
    if (event.key === "ArrowLeft" || event.key === "s") moveLeft();
    if (event.key === " ") jump();
  });
};

// Initialiser les boutons
const initButtons = () => {
  document.querySelector("#restart-button").addEventListener("click", startGame);

  document.querySelector("#start-btn").addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game").classList.remove("hidden");
    startGame();
  });
};

// Démarrer le jeu
const startGame = () => {
  // Réinitialiser le jeu
  const { lives, score } = resetGame();
  
  // Mettre à jour l'affichage
  updateHUD(lives, score);
  
  // Réinitialiser la position du joueur
  resetPlayerPosition();
  
  // Jouer la musique du jeu
  playGameMusic();
  
  // Cacher l'écran de fin de partie
  const screen = document.getElementById("game-over-screen");
  screen.classList.add("hidden");
  screen.style.display = "none";
  
  // Démarrer la génération d'obstacles
  loopObstacleGeneration();
};

// Démarrer le compteur de score
const startScoreTimer = () => {
  setInterval(() => {
    incrementScore();
  }, 1000);
};

// Initialiser le jeu lorsque le DOM est chargé
window.addEventListener("DOMContentLoaded", initGame);
