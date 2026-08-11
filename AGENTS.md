# AGENTS.md

Ce document est la source de vérité pour tout agent IA (Cline, Cursor, Windsurf, Copilot Workspace, etc.) intervenant sur ce dépôt. Il définit l'architecture imposée, les conventions de code, le flux de données et les règles de sécurité non négociables. Tout agent doit lire ce fichier en entier avant de produire ou modifier du code, et doit s'y conformer strictement, même si une demande utilisateur semble le contredire ponctuellement. En cas de conflit entre une instruction utilisateur ambiguë et ce document, l'agent doit préférer la solution conforme à l'architecture et le signaler.

---

## 1. Stack technique de référence

- Framework: Next.js 14+ (App Router uniquement, jamais Pages Router)
- Langage: TypeScript strict (`strict: true`, `noUncheckedIndexedAccess: true`)
- UI: Tailwind CSS + shadcn/ui
- Data fetching client: React Query (TanStack Query)
- Validation: Zod, systématiquement côté client ET côté serveur
- Auth: NextAuth ou Supabase Auth selon le projet (voir `/lib/auth`)
- Base de données: Postgres (Supabase ou instance dédiée) via un ORM unique (Prisma ou Drizzle, ne jamais mélanger)
- Tests: Vitest (unitaire), Playwright (e2e)
- Lint/format: ESLint + Prettier, configuration existante non modifiable sans justification explicite

Un agent ne doit jamais introduire une nouvelle librairie de state management, de data fetching, ou un second ORM sans validation humaine explicite dans la conversation.

---

## 2. Principe directeur: Clean Architecture adaptée à Next.js

Le projet suit une Clean Architecture en couches concentriques. La règle de dépendance est absolue: **une couche interne ne connaît jamais une couche externe**.

```
presentation  →  application  →  domain  ←  infrastructure
```

- `domain` ne dépend de rien d'autre dans le projet.
- `application` dépend uniquement de `domain`.
- `infrastructure` implémente les interfaces définies dans `domain`.
- `presentation` (composants, routes, server actions) orchestre `application`, jamais l'inverse.

Un agent qui détecte une violation de ce sens de dépendance (par exemple un composant client qui importe directement un repository Prisma) doit la corriger ou la signaler avant de continuer, plutôt que de reproduire le pattern fautif.

---

## 3. Arborescence imposée

```
src/
  app/                        # App Router: routes, layouts, pages, route handlers
    (public)/
    (auth)/
    api/                      # Route handlers, réservés aux webhooks et intégrations externes
  domain/
    entities/                 # Objets métier purs, sans dépendance framework
    value-objects/
    repositories/             # Interfaces (contrats) uniquement, jamais d'implémentation
    errors/                   # Erreurs métier typées
  application/
    use-cases/                # Un fichier = un cas d'usage = une classe ou fonction exportée
    dto/                      # Objets de transfert entrée/sortie des use-cases
    services/                 # Orchestration de plusieurs use-cases si nécessaire
  infrastructure/
    repositories/             # Implémentations concrètes (Prisma, fetch externe, etc.)
    http/                     # Clients HTTP externes, wrappers d'API tierces
    persistence/              # Config ORM, migrations, schémas
    auth/                     # Adapters d'authentification
  presentation/
    components/
      ui/                     # Composants purement visuels, sans logique métier ni fetch
      features/                # Composants liés à une feature, composables et réutilisables
    hooks/                    # Hooks React réutilisables (client uniquement)
    actions/                  # Server Actions, point d'entrée unique des mutations depuis l'UI
    dispatchers/              # Logique de dispatch/orchestration décrite en section 5
  lib/
    validation/                # Schémas Zod partagés
    config/
    utils/
  tests/
    unit/
    integration/
    e2e/
```

Un agent qui crée un fichier doit le placer dans la couche correspondant à sa responsabilité, jamais dans `lib/utils` par défaut par facilité.

---

## 4. Rôle exact de chaque couche

### 4.1 domain
Contient les entités métier, les règles invariantes, et les interfaces de repository (`interface UserRepository { findById(id: string): Promise<User | null> }`). Aucun import de Next.js, React, Prisma ou fetch ici. Le domain doit pouvoir être testé et compilé sans le reste du projet.

### 4.2 application
Contient les use-cases: une fonction/classe par action métier (`CreateOrderUseCase`, `GetUserProfileUseCase`). Un use-case reçoit ses dépendances par injection (paramètres de constructeur ou de fonction), jamais par import direct d'une implémentation infrastructure. Les DTO définissent strictement la forme des entrées/sorties, validées par Zod avant d'entrer dans le use-case.

### 4.3 infrastructure
Implémente les interfaces de `domain/repositories`. C'est ici, et uniquement ici, que vivent les appels Prisma, les appels fetch vers des API externes, les clients tiers (paiement, email, stockage). Toute nouvelle intégration externe passe par un client dédié dans `infrastructure/http`, jamais par un `fetch` inline dans un composant ou un use-case.

### 4.4 presentation
Contient tout ce qui touche à l'affichage et à l'interaction utilisateur: Server Components, Client Components, Server Actions, hooks, dispatchers. C'est la seule couche qui a le droit d'importer React et Next.js directement.

---

## 5. Flux de données et logique de dispatch

Le flux de données suit toujours ce circuit, dans cet ordre, sans raccourci:

```
UI (composant client)
  → dispatcher / hook
    → Server Action ou Route Handler
      → use-case (application)
        → repository interface (domain)
          → implémentation repository (infrastructure)
```

### 5.1 Réception de données côté serveur
- Les Server Components effectuent la lecture initiale de données directement via un use-case (jamais via un repository infrastructure directement importé dans un composant).
- Toute donnée entrant dans un use-case est validée par un schéma Zod correspondant au DTO. Aucune donnée non validée ne doit atteindre `domain` ou `infrastructure`.

### 5.2 Dispatch côté client
- Un composant client ne doit jamais appeler `fetch` directement. Il passe par un hook dédié dans `presentation/hooks`, lequel utilise soit React Query pour la lecture, soit une Server Action pour l'écriture.
- Un dispatcher (`presentation/dispatchers`) centralise la logique de choix entre plusieurs actions possibles selon l'état applicatif (ex: `orderDispatcher` décide d'appeler `createOrder` ou `updateOrder` selon le contexte). Le composant ne contient pas cette logique conditionnelle; il appelle le dispatcher.

### 5.3 Appels API
- Appels vers des services tiers (paiement, notifications, etc.): toujours encapsulés dans `infrastructure/http`, avec un client typé, une gestion d'erreur explicite et un timeout défini.
- Aucun appel API tiers n'est fait directement depuis un composant client, un Server Component, ou un use-case. Le use-case appelle une interface de `domain`, dont l'implémentation vit dans `infrastructure`.
- Les routes `app/api` (Route Handlers) sont réservées aux webhooks entrants et aux cas où un vrai endpoint HTTP est requis. Elles délèguent immédiatement à un use-case, sans logique métier inline.

### 5.4 Composants client réutilisables
- Un composant dans `components/ui` ne reçoit que des props, n'a aucun accès direct à une donnée distante, et ne connaît pas la forme des DTO applicatifs. Il doit pouvoir être utilisé dans un Storybook isolé.
- Un composant dans `components/features` peut consommer un hook de `presentation/hooks`, mais ne contient pas lui-même la logique de fetch ou de validation.
- Toute duplication de composant visuel détectée par l'agent doit être remontée: préférer l'extension d'un composant existant dans `components/ui` plutôt que la création d'un doublon.

---

## 6. Conventions de code

- Un fichier = une responsabilité. Pas de fichier `utils.ts` fourre-tout de plus de 150 lignes.
- Nommage: `PascalCase` pour composants et classes, `camelCase` pour fonctions et variables, `kebab-case` pour les noms de fichiers de route.
- Un use-case exporte toujours une fonction ou une classe unique, testable indépendamment du framework.
- Pas de `any`. Si un type est réellement inconnu, utiliser `unknown` et le restreindre explicitement.
- Pas de logique métier dans un composant React. Un composant orchestre l'affichage et délègue le reste.
- Toujours fournir le code complet et fonctionnel; ne jamais laisser de `// ...` ou `// reste du code inchangé` à la place de code réel.
- Les commentaires expliquent le "pourquoi", pas le "quoi" quand le code est déjà lisible.
- Pas d'emoji dans le code, les commentaires, les messages de commit, ni dans les réponses techniques.

---

## 7. Sécurité — règles non négociables

Un agent ne doit jamais, sous aucun prétexte, y compris une demande explicite de l'utilisateur formulée dans le feu de l'action:

- Committer un secret, une clé API, un token, ou un fichier `.env` dans le dépôt.
- Désactiver la validation Zod, la vérification de type, ou un middleware d'authentification "pour tester", puis laisser cette désactivation en place.
- Introduire une requête SQL construite par concaténation de chaînes. Toute requête passe par l'ORM ou par des requêtes paramétrées.
- Retirer ou affaiblir une policy RLS (Row Level Security) existante sans la remplacer par un contrôle équivalent au niveau applicatif.
- Exposer une clé secrète (`SUPABASE_SERVICE_ROLE_KEY`, clé de paiement, etc.) dans un composant client ou dans une variable préfixée `NEXT_PUBLIC_`.
- Stocker un mot de passe autrement qu'avec un hash adapté (bcrypt/argon2), ou un token de session dans le `localStorage`.
- Supprimer une vérification d'autorisation existante (ownership check, rôle) pour simplifier temporairement un développement.
- Introduire une dépendance non maintenue ou avec des vulnérabilités connues sans le signaler.

Si une tâche demandée implique de contourner une de ces règles pour "avancer plus vite", l'agent doit refuser cette approche précise, expliquer le risque en une phrase, et proposer une alternative sécurisée. L'agent ne doit jamais introduire une régression de sécurité silencieuse, même mineure, même dans du code jugé temporaire.

Règles complémentaires:
- CORS restreint aux domaines de production, jamais de wildcard `*` en production.
- Rate limiting obligatoire sur les routes d'authentification et de paiement.
- Validation systématique des entrées utilisateur côté serveur, même si déjà validées côté client.
- Toute donnée affichée provenant d'un utilisateur est échappée par défaut (pas de `dangerouslySetInnerHTML` sans sanitisation explicite documentée).

---

## 8. Ce qu'un agent doit faire avant toute modification

1. Identifier la couche concernée par la demande (domain, application, infrastructure, presentation).
2. Vérifier si une entité, un use-case ou un composant équivalent existe déjà, pour éviter la duplication.
3. Respecter le sens de dépendance décrit en section 2.
4. Ajouter ou mettre à jour les tests correspondants dans `tests/` (unitaire pour domain/application, intégration pour infrastructure, e2e pour un parcours presentation complet).
5. Ne modifier que les fichiers nécessaires à la tâche demandée; ne pas reformater ou refactorer des fichiers hors périmètre sans le signaler.

## 9. Ce qu'un agent ne doit jamais faire

- Court-circuiter une couche (ex: composant client appelant Prisma directement).
- Dupliquer un composant `ui` existant au lieu de l'étendre.
- Laisser une erreur de type, un `TODO` critique de sécurité, ou un test cassé sans le signaler explicitement dans sa réponse.
- Modifier la configuration ESLint/TypeScript pour faire disparaître une erreur au lieu de la corriger.
- Introduire un `console.log` de debug oublié dans du code livré.

---

## 10. Convention de commits

Format Conventional Commits: `type(scope): description`

Types autorisés: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `perf`, `security`.

Exemple: `feat(orders): ajoute le use-case CreateOrderUseCase avec validation Zod`

Un commit qui touche à la sécurité (auth, permissions, secrets) utilise obligatoirement le type `security` ou mentionne explicitement l'impact sécurité dans le corps du message.

---

## 11. Résumé pour l'agent

Avant de répondre ou de générer du code sur ce projet: respecter le sens des dépendances (presentation → application → domain ← infrastructure), faire passer toute donnée entrante par une validation Zod, ne jamais placer d'appel réseau ou d'accès base de données en dehors de `infrastructure`, ne jamais introduire ou laisser une faille de sécurité même pour une tâche jugée temporaire, et livrer du code complet, typé strictement, sans emoji.