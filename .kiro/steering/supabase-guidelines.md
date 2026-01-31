---
inclusion: fileMatch
fileMatchPattern: "supabase/**/*"
---

# Directives Supabase

## Migrations SQL

- Toujours utiliser des transactions
- Inclure des rollback statements
- Nommer les migrations avec timestamps
- Tester localement avant déploiement

## Edge Functions

- Utiliser Deno runtime
- Gérer les erreurs avec try/catch
- Retourner des réponses JSON structurées
- Valider les inputs

## Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Policies explicites pour chaque opération
- Ne jamais exposer de secrets dans le code