// Stats module - Gestion des statistiques

// Variables pour les statistiques
let stats = JSON.parse(localStorage.getItem("stats")) || {
  scores: [],
  victories: [],
  characters: {}, // { "gundam-blanc": 3, "gundam-bleu": 1, ... }
};

let selectedCharacter = localStorage.getItem("lastSelectedCharacter") || "gundam-blanc";
const winScore = 70; // Score pour gagner

// Calculer le nombre de parties jouées
const getNombreParties = () => stats.scores.length;

// Calculer le score moyen
const getScoreMoyen = () => {
    if (stats.scores.length === 0) return 0;
    return (stats.scores.reduce((acc, val) => acc + val, 0) / stats.scores.length).toFixed(2);
};

// Obtenir le meilleur score
const getTopScore = () => {
  if (stats.scores.length === 0) return 0;
  return Math.max(...stats.scores);
};

// Obtenir le personnage le plus joué
const getPersoPrincipal = () => {
  const entries = Object.entries(stats.characters);
  if (entries.length === 0) return "Aucun";
  return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
};

// Calculer le taux de victoire
const getTauxVictoire = () => {
  if (stats.victories.length === 0) return "0%";
  const wins = stats.victories.filter((vic) => vic === true).length;
  const total = stats.victories.length;
  return ((wins / total) * 100).toFixed(1) + "%";
};

// Afficher les statistiques sur l'écran d'accueil
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

// Mettre à jour les statistiques à la fin d'une partie
const updateStats = (score) => {
  const isWin = score >= winScore;
  stats.scores.push(score);
  stats.victories.push(isWin);
  if (!stats.characters[selectedCharacter])
    stats.characters[selectedCharacter] = 0;
  stats.characters[selectedCharacter]++;
  localStorage.setItem("stats", JSON.stringify(stats));
  return isWin;
};

// Définir le personnage sélectionné
const setSelectedCharacter = (character) => {
  selectedCharacter = character;
  localStorage.setItem("lastSelectedCharacter", character);
};

// Export des fonctions et variables pour les rendre disponibles aux autres modules
export {
  stats,
  selectedCharacter,
  winScore,
  getNombreParties,
  getScoreMoyen,
  getTopScore,
  getPersoPrincipal,
  getTauxVictoire,
  afficherStatsAccueil,
  updateStats,
  setSelectedCharacter
};
