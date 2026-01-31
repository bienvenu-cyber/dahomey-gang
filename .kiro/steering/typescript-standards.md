---
inclusion: always
---

# Standards TypeScript

## Types

- Éviter `any` - utiliser `unknown` si nécessaire
- Définir des interfaces pour les objets complexes
- Utiliser les types du projet dans `src/types/`

## Code Quality

- Pas de console.log en production
- Gérer tous les cas d'erreur
- Utiliser optional chaining (?.) et nullish coalescing (??)

## Imports

- Chemins relatifs pour les fichiers locaux
- Pas d'imports circulaires
- Grouper les imports par type