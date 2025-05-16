// Audio module - Gestion de la musique et des effets sonores

// Variables de volume audio
let musicVolume = 0.3; // Par défaut 30% (60% sur le curseur)
let effectsVolume = 0.5; // Par défaut 50% (100% sur le curseur)
const MAX_VOLUME = 0.5;
let gameMusic;

// Fonction pour charger les paramètres de volume depuis le localStorage
const loadVolumeSettings = () => {
  const savedMusicVolume = localStorage.getItem("musicVolume");
  const savedEffectsVolume = localStorage.getItem("effectsVolume");
  
  if (savedMusicVolume !== null) {
    musicVolume = parseFloat(savedMusicVolume);
    // Convertit le volume réel (0-0.5) en valeur du curseur (0-100)
    const sliderValue = (musicVolume / MAX_VOLUME) * 100;
    document.getElementById("music-volume").value = sliderValue;
    document.getElementById("music-volume-value").textContent = `${Math.round(sliderValue)}%`;
  }
  
  if (savedEffectsVolume !== null) {
    effectsVolume = parseFloat(savedEffectsVolume);
        
    const sliderValue = (effectsVolume / MAX_VOLUME) * 100;
    document.getElementById("effects-volume").value = sliderValue;
    document.getElementById("effects-volume-value").textContent = `${Math.round(sliderValue)}%`;
  }
};

// Fonction pour sauvegarder les paramètres de volume
const saveVolumeSettings = () => {
  localStorage.setItem("musicVolume", musicVolume);
  localStorage.setItem("effectsVolume", effectsVolume);
};

// Fonction pour jouer la musique du jeu
const playGameMusic = () => {
  if (!gameMusic) {
    gameMusic = new Audio('assets/arcade-beat.mp3');
    gameMusic.loop = true;
  }
  gameMusic.volume = musicVolume;
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
  gameOverSound.volume = effectsVolume;
  gameOverSound.play().catch(err => console.log('Sound play prevented:', err));
};

const playDamageSound = () => {
  const damageSound = new Audio('assets/damage.mp3');
  damageSound.volume = effectsVolume;
  damageSound.play().catch(err => console.log('Sound play prevented:', err));
};

const playBonusKillSound = () => {
  const bonusKillSound = new Audio('assets/bonus-kill.mp3');
  bonusKillSound.volume = effectsVolume;
  bonusKillSound.play().catch(err => console.log('Sound play prevented:', err));
};

const playJumpSound = () => {
  const jumpSound = new Audio('assets/jump.mp3');
  jumpSound.volume = effectsVolume;
  jumpSound.play().catch(err => console.log('Jump sound play prevented:', err));
};

// Initialiser les écouteurs d'événements pour les curseurs de volume
const initAudioListeners = () => {
  // Écouteur pour le curseur de volume de la musique
  document.getElementById("music-volume").addEventListener("input", (event) => {
    const sliderValue = event.target.value;
    // Convertit la valeur du curseur (0-100) en volume réel (0-0.5)
    musicVolume = (sliderValue / 100) * MAX_VOLUME;
    document.getElementById("music-volume-value").textContent = `${sliderValue}%`;
    
    // Mettre à jour le volume de la musique si elle est en cours de lecture
    if (gameMusic) {
      gameMusic.volume = musicVolume;
    }
    
    saveVolumeSettings();
  });
  
  // Écouteur pour le curseur de volume des effets sonores
  document.getElementById("effects-volume").addEventListener("input", (event) => {
    const sliderValue = event.target.value;
    // Convertit la valeur du curseur (0-100) en volume réel (0-0.5)
    effectsVolume = (sliderValue / 100) * MAX_VOLUME;
    document.getElementById("effects-volume-value").textContent = `${sliderValue}%`;
    saveVolumeSettings();
  });
};

// Export des fonctions pour les rendre disponibles aux autres modules
export {
  loadVolumeSettings,
  saveVolumeSettings,
  playGameMusic,
  stopGameMusic,
  playGameOverSound,
  playDamageSound,
  playBonusKillSound,
  playJumpSound,
  initAudioListeners
};
