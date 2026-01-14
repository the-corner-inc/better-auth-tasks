# Better Auth Tasks

> Task management application with authentication, built by following this YouTube tutorial: 
> [this tutorial](https://www.youtube.com/watch?v=WPiqNDapQrk).

Based on the tutorial, a POC is built to serve two purposes:
- a **standalone web application**
- a **partially packaged module** to be distributed as an npm package and integrated into the **up4it** application

---

## Technical Stack

- **Framework** : [Next.js](https://nextjs.org/) 16
- **Database (docker)** : [PostgreSQL](https://www.postgresql.org/) 18
- **ORM** : [Drizzle ORM](https://orm.drizzle.team/)
- **Authentification** : [Better Auth](https://www.better-auth.com/)
- **UI Components** : [shadcn/ui](https://ui.shadcn.com/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) v4

---

## Architecture (to redact correctly)
This project is a fullstack app, some parts are being packaged as npm modules, the app itself should be a standalone usable as it is.
The architecture tends to use a Layered architecture, with a : 
- Presentation Layer (PL) : Is the Core part of the UI, how the data is diplayed on the screen and how the states are handeled. This is the User Interaction Layer.
- Business Layer (BLL) : Contains the core logic of the app, the treatment is done here.
- Data Acces Layer (DAL) : Connects the repo to the DB, and contains all the Query to it
- Data Transfert Objects (DTO) : Cross layer, each layer has aces to it

Choice of architecture : 
- Ce que je connais le mieux dans la logique. Propre et decouplé, un peu boilerplate, mais on s'y fait vite.
- React / NextJs pas de vraie architecture imposé, alors essayer d'en mettre une en place pour faire bien et avoir une base saine pour ce projet.
- Overengineered base, mais si le projet grossit, c'est pratique pour bien construire dessus. Pour la lecture du code c'est aussi plus explicite et decouplé ça aide à comprendre le rôle de chaque partie.

---
## Project Status / TODO

This section gives a quick overview of the current project state for other teams.

### Feat (product)

- [x] Follow the YouTube tutorial (preparation)
- [x] Technology POC
- [ ] Review GitHub issues and adapt the POC
- [ ] Clean the app (remove tutorial leftovers)
- [ ] Validate the need for additional auth features:
    - email verification
    - welcome email
    - delete account
    - update profile
- [ ] Up4it: explore how to ship **two formats**
    - **standalone web app**
    - **integrable module** (only package a subset of the project)

### Chore (internal)

- [ ] Refactor toward a Layered Architecture (PL / BLL / DAL separation)
- [ ] Add ESLint rules to enforce boundaries between layers
- [ ] Clean code
- [ ] Clean comments
- [ ] Implement Error Handling
- [ ] How to implement tests ? 
- [ ] Make it as a whole container
- [ ] DrawIO Diagramm of architecture, and put it in the project


---



## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

> Docker Desktop must be installed and running.

### 4. Database migrations

```bash
# Simple production setup with a new database
npm run db:push

# Keep database migration history
npm run db:generate
npm run db:migrate

# Inspect database content
npm run db:studio
```

### 5. Development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Available Scripts

| Command | Description |
|--------|------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the application in production mode |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:push` | Sync schema directly to DB (dev only) |
| `auth:generate` | Regenerate auth schemas after auth.ts changes |

---

## Docker

The file `docker-compose.yml` configures PostgreSQL :

```bash
# Starts the database in detached mode
docker compose up -d

# Stops the database
docker compose down

# Show the logs
docker compose logs -f db

# Delete all datas (complet reset)
docker compose down -v
```
---
## Better Auth

Better Auth schemas are generated using the official CLI.

The project uses a custom config path for `auth.ts`, so schema generation is handled via the following script:

```bash
npm run auth:generate

#This scripts runs : 
npx @better-auth/cli@latest generate \
  --config ./src/lib/auth/auth.ts \
  --output ./src/drizzle/schemas/new-auth-schema.ts \
  --yes
```
### Workflow 
 - Update auth.ts
 - Run npm run auth:generate
   - The generated schema is written to: "src/drizzle/schemas/new-auth-schema.ts"
   - Copy the content of the newly generated schema into the existing auth schema file
 - Apply database changes 
   - db:push (simple / dev) 
   - OR db:generate + db:migrate (with migrations)

---

## Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Documentation Better Auth](https://www.better-auth.com/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com/docs)