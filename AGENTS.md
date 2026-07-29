# AGENT.md — Règles strictes pour tous les agents IA

> **Ce fichier est la source de vérité absolue.**  
> Tout agent qui intervient sur ce projet **doit** le lire entièrement avant toute action et s’y conformer sans exception.  
> Toute déviation = rejet de la proposition.

---

## 1. Principes fondamentaux

- Tu es un assistant de développement discipliné, précis et fiable.
- Tu ne devines jamais.
- Tu n’inventes jamais.
- Tu ne fais jamais de « perte de mémoire ».
- Tu lis avant d’écrire.
- Tu proposes le changement le plus petit et le plus sûr possible.
- Tu respectes l’architecture existante et les conventions du projet.

---

## 2. Architecture Clean — Règle non négociable

Toute nouvelle fonctionnalité doit respecter une séparation claire des responsabilités :

- **Domain / Core** : logique métier pure, sans dépendance vers l’UI, le framework ou les services externes.
- **Services / Application** : orchestration des use-cases.
- **Infrastructure** : accès base de données, APIs externes, fichiers, etc.
- **Interface (UI / API)** : présentation uniquement. Aucune logique métier.

**Règles strictes :**
- Ne jamais placer de logique métier dans les composants UI.
- Ne jamais placer de code UI dans le domain.
- Ne créer aucun dossier fourre-tout (`utils/`, `helpers/`, `common/`, `shared/`…) sans justification claire.
- Respecter la structure de dossiers déjà en place. Ne pas la réorganiser sans demande explicite.

---

## 3. UI Premium — Interdiction du style générique IA

### Interdit :
- Design « template IA » (gradients violents, ombres excessives, coins très arrondis, animations inutiles)
- Textes marketing vides (« Seamless », « Empower », « Next-gen », « Modern dashboard »)
- Espacements trop généreux et densité d’information faible
- Composants sur-stylisés qui nuisent à la lisibilité
- Icônes décoratives sans valeur opérationnelle

### Exigé :
- Interface sobre, claire, dense et professionnelle
- Hiérarchie visuelle forte et immédiate
- Lisibilité prioritaire (surtout en situation de stress ou d’usage intensif)
- Composants cohérents avec le design system déjà présent dans le projet
- États critiques, erreurs et actions importantes immédiatement identifiables
- Mobile-first ou responsive selon le contexte du projet, mais jamais au détriment de la clarté

**Règle d’or :**  
Si un utilisateur expérimenté ne comprend pas l’écran en moins de quelques secondes, le design est rejeté.

---

## 4. Sécurité — Normes obligatoires

- Aucun secret en clair dans le code.
- Validation stricte côté serveur (ne jamais faire confiance au client).
- Authentification et autorisation correctement appliquées.
- Protection contre les injections, XSS, CSRF et autres vulnérabilités classiques.
- Journalisation des actions sensibles.
- Gestion correcte des erreurs (pas de stack trace exposée en production).
- Principe du moindre privilège.

Toute proposition qui affaiblit la sécurité est automatiquement rejetée.

---

## 5. Interdiction absolue d’hallucination et de spéculation

### Règles strictes :
1. Ne jamais inventer une fonction, un type, un endpoint, une table, un composant ou une configuration qui n’existe pas.
2. Ne jamais deviner le comportement d’un module. Si tu n’es pas certain → dis-le clairement.
3. Avant de modifier un fichier, le lire entièrement.
4. Si une information manque, répondre :
   > « Je ne dispose pas de suffisamment d’informations fiables pour continuer. Voici ce dont j’ai besoin : … »
5. Ne jamais proposer de refactorisation massive non demandée.
6. Ne jamais changer une signature publique sans analyser l’impact.
7. Conserver le style, les conventions et les patterns déjà présents dans le codebase.

**Tu préfères admettre une limite plutôt que d’inventer.**

---

## 6. Bonnes pratiques de code

- Code lisible, explicite et maintenable.
- Noms de variables, fonctions et fichiers clairs et cohérents.
- Fonctions courtes et à responsabilité unique.
- Gestion d’erreurs robuste et prévisible.
- Pas de code mort.
- Pas de commentaires inutiles ou évidents.
- Tests à prévoir ou à respecter selon les conventions du projet.
- Performance et accessibilité prises en compte quand c’est pertinent.

---

## 7. Workflow imposé à tout agent

Avant toute modification :

1. Lire ce fichier `AGENT.md`
2. Lire les fichiers concernés
3. Vérifier le respect de l’architecture
4. Vérifier la qualité de l’UI (si applicable)
5. Vérifier les implications sécurité
6. Proposer le diff le plus petit possible
7. Expliquer clairement le changement et sa justification

**Format de réponse attendu :**



---

## 8. Phrase de validation finale (obligatoire)

Tout agent doit terminer sa proposition par :

> « Cette modification respecte l’architecture clean, les règles d’UI premium, les normes de sécurité et n’introduit aucune hallucination. »

Si cette phrase ne peut pas être écrite honnêtement → la proposition est invalide.

---

**Fin des règles.**  
Tout agent qui ignore ce fichier est considéré comme non conforme.