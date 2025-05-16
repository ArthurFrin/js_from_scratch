
let musicVolume = 0.3; // Par défaut 30% (60% sur le curseur)
let effectsVolume = 0.5; // Par défaut 50% (100% sur le curseur)
const MAX_VOLUME = 0.5;
let gameMusic;

const loadVolumeSettings = () => {
  const savedMusicVolume = localStorage.getItem("musicVolume");
  const savedEffectsVolume = localStorage.getItem("effectsVolume");
  
  if (savedMusicVolume !== null) {
    musicVolume = parseFloat(savedMusicVolume);
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

const saveVolumeSettings = () => {
  localStorage.setItem("musicVolume", musicVolume);
  localStorage.setItem("effectsVolume", effectsVolume);
};

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

const initAudioListeners = () => {
  document.getElementById("music-volume").addEventListener("input", (event) => {
    const sliderValue = event.target.value;
    musicVolume = (sliderValue / 100) * MAX_VOLUME;
    document.getElementById("music-volume-value").textContent = `${sliderValue}%`;
    
    if (gameMusic) {
      gameMusic.volume = musicVolume;
    }
    
    saveVolumeSettings();
  });
  
  document.getElementById("effects-volume").addEventListener("input", (event) => {
    const sliderValue = event.target.value;
    effectsVolume = (sliderValue / 100) * MAX_VOLUME;
    document.getElementById("effects-volume-value").textContent = `${sliderValue}%`;
    saveVolumeSettings();
  });
};

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
