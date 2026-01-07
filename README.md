# Better Auth Tasks

Application de gestion de tâches avec authentification, construite en suivant [ce tutoriel YouTube](https://www.youtube.com/watch?v=WPiqNDapQrk).

## 🛠Stack Technique

- **Framework** : [Next.js](https://nextjs.org/) 16
- **Base de données** : [PostgreSQL](https://www.postgresql.org/) 18
- **ORM** : [Drizzle ORM](https://orm.drizzle.team/)
- **Authentification** : [Better Auth](https://www.better-auth.com/)
- **UI Components** : [shadcn/ui](https://ui.shadcn.com/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) v4

---

## Installation

### 1. Cloner le projet et installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copier le fichier `.env.example` en `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

### 3. Lancer la base de données PostgreSQL

```bash
docker compose up -d
```

> ⚠️ **Prérequis** : Avoir [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé.

### 4. Appliquer les migrations de la base de données

```bash
npm run db:push
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

---

## Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement Next.js |
| `npm run build` | Build l'application pour la production |
| `npm run start` | Lance l'application en mode production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run db:generate` | Génère les migrations Drizzle à partir du schéma |
| `npm run db:migrate` | Applique les migrations en attente |
| `npm run db:studio` | Ouvre Drizzle Studio (interface visuelle pour la BDD) |
| `npm run db:push` | Synchronise le schéma directement avec la BDD (dev) |

---

## Docker

Le fichier `docker-compose.yml` configure PostgreSQL :

```bash
# Démarrer la base de données
docker compose up -d

# Arrêter la base de données
docker compose down

# Voir les logs
docker compose logs -f db

# Supprimer les données (reset complet)
docker compose down -v
```
---
## Better Auth
```
# Créer Tables de la DB. Cette commande doit être exécutée une seule fois lors de la configuration initiale de Better Auth.
npx @better-auth/cli generate
```
Note, normalement le fichier "auth.ts" doit se trouver normalement dans "/src/lib", mais ici il est rangé dans "/src/lib/auth", il faut donc utiliser la commande "auth:generate" disponible dans le "package.json"

Workflow : A chaque modification de "auth.ts", il faut faire une generation, puis un push à la db. 


---

## Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Documentation Better Auth](https://www.better-auth.com/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com/docs)