// UI module - Gestion de l'interface utilisateur

import { stopGameMusic, playGameOverSound } from './audio.js';
import { setPlayerCharacter } from './player.js';
import { updateStats, getTopScore, stats, setSelectedCharacter } from './stats.js';

// Mettre à jour l'affichage HUD (vies et score)
const updateHUD = (lives, score) => {
  const livesDisplay = document.getElementById("livesDisplay");
  if (livesDisplay) livesDisplay.textContent = "❤️".repeat(lives);

  const scoreDisplay = document.getElementById("scoreDisplay");
  if (scoreDisplay) scoreDisplay.textContent = `Score : ${score}`;
};

// Afficher l'écran de fin de partie
const showGameOver = (score) => {
  const screen = document.getElementById("game-over-screen");
  screen.classList.remove("hidden");
  screen.style.display = "block";

  stopGameMusic();
  playGameOverSound();

  // Mettre à jour les statistiques
  updateStats(score);

  const best = getTopScore();
  const bestText = document.getElementById("best-score-text");
  if (bestText) bestText.textContent = `Meilleur score : ${best}`;

  console.log("Le joueur a perdu");
};

// Initialiser les écouteurs pour la sélection des personnages
const initCharacterSelection = () => {
  document.querySelectorAll(".character").forEach((char) => {
    char.addEventListener("click", () => {
      document
        .querySelectorAll(".character")
        .forEach((c) => c.classList.remove("selected"));

      char.classList.add("selected");

      const characterType = char.dataset.character;

      if (!stats.characters[characterType]) stats.characters[characterType] = 0;
      setSelectedCharacter(characterType);

      setPlayerCharacter(characterType);

      console.log(`Personnage sélectionné: ${characterType}`);
    });
  });
};

// Sélectionner le personnage sauvegardé
const selectSavedCharacter = () => {
  const savedCharacter = localStorage.getItem("lastSelectedCharacter") || "gundam-blanc";
  
  setPlayerCharacter(savedCharacter);
  
  document.querySelectorAll('.character').forEach(char => {
    if (char.dataset.character === savedCharacter) {
      char.classList.add('selected');
    } else {
      char.classList.remove('selected');
    }
  });
};

// Export des fonctions pour les rendre disponibles aux autres modules
export {
  updateHUD,
  showGameOver,
  initCharacterSelection,
  selectSavedCharacter
};
