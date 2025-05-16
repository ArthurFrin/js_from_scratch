import { stopGameMusic, playGameOverSound } from './audio.js';
import { setPlayerCharacter } from './player.js';
import { updateStats, getTopScore, stats, setSelectedCharacter } from './stats.js';
import { stopPlatforms } from './platforms.js';

const updateHUD = (lives, score) => {
  const livesDisplay = document.getElementById("livesDisplay");
  if (livesDisplay) livesDisplay.textContent = "❤️".repeat(lives);

  const scoreDisplay = document.getElementById("scoreDisplay");
  if (scoreDisplay) scoreDisplay.textContent = `Score : ${score}`;
};

const showGameOver = (score) => {
  const screen = document.getElementById("game-over-screen");
  screen.classList.remove("hidden");
  screen.style.display = "block";

  stopGameMusic();
  playGameOverSound();
  
  stopPlatforms();

  updateStats(score);

  const best = getTopScore();
  const bestText = document.getElementById("best-score-text");
  if (bestText) bestText.textContent = `Meilleur score : ${best}`;

  console.log("Le joueur a perdu");
};

const initCharacterSelection = () => {
  const characters = document.querySelectorAll(".character");
  const dropzone = document.getElementById("selected-character-slot");

  characters.forEach((char) => {
    char.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("character", char.dataset.character);
    });
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = "rgba(76,175,80,0.15)";
  });
  dropzone.addEventListener("dragleave", (e) => {
    dropzone.style.backgroundColor = "rgba(255,255,255,0.1)";
  });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = "rgba(255,255,255,0.1)";
    const characterType = e.dataTransfer.getData("character");
    if (!characterType) return;

    dropzone.style.backgroundImage = `url('assets/${characterType}.webp')`;

    if (!stats.characters[characterType]) stats.characters[characterType] = 0;
    setSelectedCharacter(characterType);
    setPlayerCharacter(characterType);
    console.log(`Personnage sélectionné: ${characterType}`);
  });
};

const selectSavedCharacter = () => {
  const savedCharacter = localStorage.getItem("lastSelectedCharacter") || "gundam-blanc";
  setPlayerCharacter(savedCharacter);
  const dropzone = document.getElementById("selected-character-slot");
  if (dropzone) {
    dropzone.style.backgroundImage = `url('assets/${savedCharacter}.webp')`;
  }
};

export {
  updateHUD,
  showGameOver,
  initCharacterSelection,
  selectSavedCharacter
};
