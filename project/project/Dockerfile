# ─────────────────────────────────────────────────────────────────────────────
# CI Dockerfile — Level Up RPG
#
# Ce Dockerfile est utilisé uniquement par la CI (GitHub Actions).
# Il vérifie deux choses :
#   1. Le projet se build sans erreur (npm run build)
#   2. Les 125 tests de caractérisation passent (npm run test)
#
# Il ne produit pas d'image Electron distribuable — electron-builder
# nécessite un environnement Windows natif pour générer le .exe.
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-slim

WORKDIR /app

# Copier les fichiers de dépendances en premier pour profiter du cache Docker
# (les dépendances ne changent pas à chaque push)
COPY package.json package-lock.json ./

# --ignore-scripts : electron-builder tente de compiler des binaires natifs
# qui ne sont ni disponibles ni utiles dans un conteneur Linux headless
RUN npm ci --ignore-scripts

# Copier le reste du code source
COPY . .

# Étape 1 : vérifier que le build de production ne produit pas d'erreurs
RUN npm run build

# Étape 2 : lancer les tests
RUN npm run test