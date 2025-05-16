# Gundam Runner

Gundam Runner est un jeu simple de type runner 2D à défilement horizontal, développé avec HTML, CSS et JavaScript.

## Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/ArthurFrin/js_from_scratch.git
    cd js_from_scratch
    ```

2.  **Installer les dépendances :**
    Ce projet utilise Node.js et Express pour un serveur simple.
    ```bash
    npm install
    ```

## Comment jouer

1.  **Démarrer le serveur :**
    ```bash
    npm start
    ```
    Cela lance le serveur de jeu, généralement accessible sur `http://localhost:5000`.

2.  **Ouvrir le jeu dans votre navigateur :**
    Rendez-vous sur `http://localhost:5000` dans votre navigateur web.

3.  **Contrôles :**
    *   **Flèche gauche / Touche S :** Aller à gauche
    *   **Flèche droite / Touche Z :** Aller à droite (Remarque : le fichier `main.js` indique 'z' pour aller à droite, mais cela pourrait être une erreur et devrait être 'd' ou une autre touche courante. Le code actuel utilise 'z'.)
    *   **Barre d’espace :** Sauter
    *   **Flèche bas :** Descendre à travers une plateforme si vous êtes dessus.

## Fonctionnalités

*   **Sélection de personnage :** Choisissez parmi différents Gundam avant de commencer. Le dernier personnage sélectionné est mémorisé.
*   **Déplacement du joueur :** Contrôlez votre Gundam pour aller à gauche, à droite et sauter pour éviter les obstacles.
*   **Évitement d’obstacles :** Des bombes apparaissent et se dirigent vers le joueur. Évitez-les ou sautez dessus.
*   **Plateformes :** Des plateformes apparaissent dynamiquement, sur lesquelles le joueur peut sauter. la fleche du bas permet de dessendre d'une plateforme
*   **Système de score :**
    *   Gagnez des points au fil du temps.
    *   Gagnez des points pour chaque bombe qui sort de l’écran.
    *   Gagnez des points bonus en sautant sur les bombes.
*   **Combo de bombes :** Sauter sur 3 bombes consécutivement déclenche un combo, effaçant toutes les bombes à l’écran et donnant des points supplémentaires.
*   **Système de vies :** Le joueur commence avec 3 vies. Perdre toutes ses vies termine la partie.
*   **Difficulté dynamique :** La difficulté augmente avec le score, les bombes apparaissent plus fréquemment.
*   **Écran de fin & redémarrage :** À la fin de la partie, un écran affiche votre score et le meilleur score. Vous pouvez recommencer ou revenir à l’accueil.
*   **Statistiques persistantes :**
    *   Nombre de parties jouées, score moyen, meilleur score, taux de victoire (atteindre 300 points), personnage le plus joué.
    *   Les statistiques sont sauvegardées dans le stockage local du navigateur.
*   **Système sonore :**
    *   Musique de fond pendant la partie.
    *   Effets sonores pour sauter, prendre des dégâts, game over et détruire des bombes.
    *   Contrôles de volume pour la musique et les effets sur l’écran d’accueil, avec sauvegarde des réglages.
*   **Visuels :**
    *   Fond étoilé animé et lune.
    *   Effets visuels pour les explosions de bombes.
*   **Détection hors-limites :** Si le joueur sort de l’écran trop longtemps, la partie se termine.

## Structure des fichiers

*   `index.html` : Fichier HTML principal du jeu.
*   `styles.css` : Contient tout le style des éléments du jeu et de l’interface.
*   `server.js` : Serveur Express simple pour servir les fichiers du jeu.
*   `js/` : Dossier contenant les modules JavaScript :
    *   `main.js` : Boucle principale du jeu, gestion des événements et initialisation.
    *   `player.js` : Logique du joueur, déplacements et personnage.
    *   `obstacles.js` : Génération des obstacles (bombes), collisions et état du jeu.
    *   `platforms.js` : Génération des plateformes et logique d’interaction.
    *   `ui.js` : Gestion de l’interface, écran de fin et sélection du personnage.
    *   `audio.js` : Gestion des sons, musiques et contrôles de volume.
    *   `stats.js` : Gestion des statistiques et du stockage local.
*   `assets/` : Images et fichiers audio du jeu.
*   `package.json` : Métadonnées et dépendances du projet.

Bon jeu sur Gundam Runner !