---
inclusion: fileMatch
fileMatchPattern: "src/components/**/*.tsx"
---

# Conventions React du Projet

Lors de la création ou modification de composants React:

## Structure des Composants

- Export par défaut pour les composants principaux
- Types TypeScript explicites pour toutes les props
- Utiliser les composants UI de shadcn/ui depuis `src/components/ui/`
- Suivre la structure existante: props interface + composant fonctionnel

## Imports

- React hooks en premier
- Composants UI ensuite
- Contextes et hooks personnalisés après
- Types en dernier

## Styling

- Utiliser Tailwind CSS exclusivement
- Classes utilitaires plutôt que CSS personnalisé
- Responsive design avec préfixes md:, lg:, etc.