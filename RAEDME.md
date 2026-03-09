# Level Up RPG 🎮

Application desktop éducative RPG pour enfants — **Electron + React + Vite**.  
Projet CodeWash — Epitech GING400.

---

## Sommaire

1. [Présentation](#présentation)
2. [Installation et lancement](#installation-et-lancement)
3. [Scripts disponibles](#scripts-disponibles)
4. [Architecture du code](#architecture-du-code)
5. [Tests](#tests)
6. [Dette technique connue](#dette-technique-connue)

---

## Présentation

Le joueur choisit un profil parmi 3 et s'entraîne sur 6 mini-jeux, chacun représenté comme une compétence RPG. Répondre correctement fait monter en niveau, débloque des badges, des succès et des cosmétiques.

**Mini-jeux**

| ID         | Mécanique                                        |
|------------|--------------------------------------------------|
| `reading`  | Lire un mot à voix haute (reconnaissance vocale) |
| `math`     | Résoudre des problèmes de mathématiques          |
| `writing`  | Épeler un mot lettre par lettre                  |
| `cleaning` | Trier des objets dans le bon coffre              |
| `memory`   | Jeu de paires (retourner des cartes)             |
| `patterns` | Compléter une séquence de couleurs               |

**Progression**

- 7 niveaux de difficulté par compétence, débloqués tous les 20 niveaux
- Cycle de rencontres : niveaux 1-9 & 11-19 → mob hostile, 10 → mini-boss, 20 → boss
- Badges (Wood → Mythic), succès, 3 profils sauvegardés en `localStorage`, thèmes visuels

---

## Installation et lancement

**Prérequis :** Node.js 18+ et npm 9+

```bash
# 1. Cloner le dépôt et aller dans le bon dossier
git clone https://github.com/Alexis-Clemot/Codewash.git
cd Codewash/project/project

# 2. Installer les dépendances
#    --ignore-scripts est requis : electron-builder tente de compiler des binaires natifs
npm install --ignore-scripts

# 3. Installer vitest (outil de test, non inclus dans les dépendances de base)
npm install --save-dev vitest --ignore-scripts

# 4. Lancer en mode développement (navigateur, tous OS)
npm run dev
# → http://localhost:5173
```

> En mode navigateur, la reconnaissance vocale utilise l'API Web Speech du navigateur.  
> Certaines fonctionnalités (microphone natif, fichiers système) nécessitent le mode Electron.

**Lancer en mode Electron (application desktop)**

```bash
npm run electron:dev
```

**Générer un exécutable Windows**

```bash
npm run electron:build
# → release/LevelUpRPG-Portable.exe
```

---

## Scripts disponibles

| Commande                  | Description                                    |
|---------------------------|------------------------------------------------|
| `npm run dev`             | Serveur de développement Vite (navigateur)     |
| `npm run build`           | Build de production                            |
| `npm run preview`         | Prévisualiser le build                         |
| `npm run lint`            | Analyse statique ESLint                        |
| `npm run test`            | Lancer les tests une fois                      |
| `npm run test:watch`      | Tests en mode watch                            |
| `npm run test:coverage`   | Tests + rapport de couverture HTML             |
| `npm run electron:dev`    | Build + lancer dans Electron                   |
| `npm run electron:build`  | Build + packager en .exe (Windows uniquement)  |

---

## Architecture du code

```
Codewash/
└── project/
    └── project/                            ← Racine du projet (double imbrication due au zip d'origine)
        │
        ├── electron/
        │   └── main.cjs                    ← Process principal Electron (création fenêtre, IPC)
        │
        ├── public/assets/                  ← Assets statiques servis par Vite
        │   ├── badges/                     ← Images des badges (wood → mythic)
        │   ├── difficulty/                 ← Icônes des niveaux de difficulté (1-7)
        │   ├── items/                      ← Images des objets (jeu Writing)
        │   │   └── chests/                 ← Coffres pour le jeu Cleaning
        │   ├── mobs/
        │   │   ├── axolotl/                ← 8 couleurs d'axolotls (jeux Memory/Patterns)
        │   │   ├── boss/                   ← Bosses de fin de cycle (niveau 20, 40, ...)
        │   │   ├── friendly/               ← Mobs amicaux — 26 créatures (jeu Memory)
        │   │   ├── hostile/                ← Mobs hostiles — 20 créatures (combats normaux)
        │   │   └── miniboss/               ← Mini-boss (niveau 10, 30, ...)
        │   ├── skills/                     ← Icônes des 6 compétences
        │   ├── sounds/
        │   │   ├── axolotl/                ← Notes de musique pour le jeu Patterns (a4–g5)
        │   │   ├── bgm/                    ← Musiques de fond (calm1-3, piano1-3)
        │   │   ├── mob/mob/                ← Sons death/hurt par type de mob (~50 dossiers)
        │   │   └── ui/ui/                  ← Sons d'interface (click, levelup, fail, ...)
        │   └── themes/                     ← Images de fond et logos des thèmes visuels
        │
        ├── src/
        │   ├── App.jsx                     ← ⚠️ Composant racine (1492 lignes — God Component)
        │   ├── main.jsx                    ← Point d'entrée React
        │   ├── index.css                   ← Styles globaux (Tailwind)
        │   │
        │   ├── components/
        │   │   ├── PhantomEvent.jsx        ← Événement aléatoire "attraper un Phantom" (+XP)
        │   │   ├── drawers/                ← Panneaux latéraux coulissants
        │   │   │   ├── CosmeticsDrawer.jsx ← Personnalisation (bordures, avatars)
        │   │   │   ├── MenuDrawer.jsx      ← Menu principal (profils, navigation)
        │   │   │   ├── MenuDrawer_old.jsx  ← ⚠️ Fichier mort — à supprimer
        │   │   │   └── SettingsDrawer.jsx  ← Paramètres (volume, difficulté, thème)
        │   │   ├── modals/
        │   │   │   ├── BugReportModal.jsx  ← ⚠️ Non fonctionnel (voir §Dette technique)
        │   │   │   └── ResetModal.jsx      ← Confirmation remise à zéro du profil
        │   │   ├── profile/
        │   │   │   └── ProfileCard.jsx     ← Carte de sélection de profil joueur
        │   │   ├── skills/
        │   │   │   └── SkillCard.jsx       ← Carte d'une compétence sur la grille principale
        │   │   └── ui/
        │   │       ├── AchievementToast.jsx         ← Notification succès débloqué
        │   │       ├── GlobalStyles.jsx              ← CSS dynamique injecté (thèmes, auras)
        │   │       ├── MobWithAura.jsx               ← Mob avec effet d'aura visuel
        │   │       ├── ParentalVerificationModal.jsx ← Code parental (mode debug)
        │   │       ├── PixelHeart.jsx                ← Cœur de vie pixel art animé
        │   │       └── SafeImage.jsx                 ← <img> avec fallback si asset manquant
        │   │
        │   ├── constants/
        │   │   ├── achievements.js         ← Définitions des succès (tiered + one-time)
        │   │   ├── assets.js               ← Re-export de BASE_ASSETS depuis gameData
        │   │   └── gameData.jsx            ← Toutes les données statiques du jeu
        │   │                                  (mobs, items, skills, difficulté, mots)
        │   │
        │   └── utils/
        │       ├── achievementUtils.js     ← Gestion succès : paliers, détection, progress
        │       ├── achievementUtils.test.js← ✅ 37 tests de caractérisation
        │       ├── gameUtils.js            ← Logique RPG : dégâts, XP, mobs, maths
        │       ├── gameUtils.test.js       ← ✅ 78 tests de caractérisation
        │       ├── mobDisplayUtils.js      ← Génération d'auras pour les mobs
        │       ├── mobDisplayUtils.test.js ← ✅ 10 tests de caractérisation
        │       └── soundManager.js         ← BGM + SFX (Web Audio API)
        │
        ├── docs/
        │   └── MICROPHONE_FEATURE.md       ← Documentation feature micro (Web Speech API)
        │
        ├── index.html
        ├── vite.config.js                  ← Config Vite + Vitest
        ├── tailwind.config.js
        ├── postcss.config.js
        ├── eslint.config.js
        ├── package.json
        └── README.md
```

Toute la logique applicative est centralisée dans `App.jsx` : état des profils, mini-jeux, navigation, achievements, animations et son. C'est le principal code smell identifié (voir §Dette technique).

---

## Tests

Les tests sont des **tests de caractérisation** : ils capturent le comportement observable actuel des fonctions pures pour servir de filet de sécurité lors des refactorisations futures.

**Règle :** ne pas modifier ces tests sauf si une règle de jeu a été intentionnellement changée. Un test qui échoue après un refactoring = un comportement qui a changé = à investiguer.

```bash
npm run test            # une passe complète
npm run test:watch      # relance à chaque modification
npm run test:coverage   # + rapport de couverture HTML
```

**Couverture actuelle — 125 tests**

| Fichier                     | Ce qui est couvert                                                |
|-----------------------------|-------------------------------------------------------------------|
| `utils/gameUtils.js`        | Cycle de rencontres, dégâts/HP/XP, génération de problèmes, mobs |
| `utils/achievementUtils.js` | Stats initiales, déverrouillage, paliers, détection de nouveautés |
| `utils/mobDisplayUtils.js`  | Auras aléatoires, noms d'affichage avec adjectif                  |

`App.jsx`, `soundManager.js` et les composants React ne sont pas couverts : trop couplés à l'état et aux APIs browser pour être testés sans refactoring préalable.

---

## Dette technique connue

| Problème                          | Localisation                   | Priorité   |
|-----------------------------------|--------------------------------|------------|
| God Component (1492 lignes)       | `src/App.jsx`                  | 🔴 Haute   |
| Pas de séparation logique/vue     | `src/App.jsx`                  | 🔴 Haute   |
| `localStorage` accédé directement | `src/App.jsx`                  | 🟡 Moyenne |
| `BugReportModal` non fonctionnel  | `modals/BugReportModal.jsx`    | 🟡 Moyenne |
| Pas de CI/CD                      | —                              | 🟡 Moyenne |
| Fichier mort                      | `drawers/MenuDrawer_old.jsx`   | 🟢 Basse   |
| Noms Minecraft hardcodés          | `constants/gameData.jsx`       | 🟢 Basse   |