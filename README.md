# Better Auth Tasks

A task management application with authentication, built with Next.js and a layered architecture.
> 🎯 Originally based on [this YouTube tutorial](https://www.youtube.com/watch?v=WPiqNDapQrk), now evolved into a standalone project demonstrating layered architecture patterns.

Based on the tutorial, first a POC is build to understand the tech used, and then a alpha version will be released to serve two purposes:
- a **standalone web application**
- a **partially packaged module** to be distributed as an npm package and integrated into the **up4it** application

---

## Technical Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 15 | React framework |
| [PostgreSQL](https://www.postgresql.org/) | 16 | Database (Docker) |
| [Drizzle ORM](https://orm.drizzle.team/) | latest | Type-safe ORM |
| [Better Auth](https://www.better-auth.com/) | latest | Authentication |
| [shadcn/ui](https://ui.shadcn.com/) | latest | UI Components |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Styling |

---

## Architecture 

This project follows a **Layered Architecture** pattern, adapted for the Next.js ecosystem.

### Choice for a Layered Architecture
| Reason | Benefit                                                                                                                                                                                                           |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Separation of Concerns** | Each layer has a single responsibility, making code easier to understand and maintain                                                                                                                             |
| **Testability** | BLL can be unit tested without mocking Next.js runtime                                                                                                                                                            |
| **Scalability** | If the project grows, the architecture is already in place                                                                                                                                                        |
| **Familiarity** | Well-known pattern from backend development (C#, Java, etc.). <br/>**In the end, it's the best way for me to understand what is happening in this framework, to translate it to something I'm already familiar with.** |

> **Note**: This architecture is overkill for a small project, but it serves as a learning exercise to understand how each layer interacts in a Next.js context.

# INSERT IMAGE HERE
### Representation of the architecture


---
## Project Status / TODO

This section gives a quick overview of the current project state for other teams.

### Feat (product)

- [x] Follow the YouTube tutorial (preparation)
  - [x] Authentication (Better Auth)
- [x] Learn the technology for the POC
  - [x] Task and Todo CRUD operations
  - [x] Layered Architecture refactoring
- [ ] Review GitHub issues and adapt the POC
- [ ] Validate the need for additional auth features:
    - email verification
    - welcome email
    - delete account
    - update profile
- [ ] Up4it: explore how to ship **two formats**
    - **standalone web app**
    - **integrable npm module** (only package a subset of the project)

### Chore (internal)
- [x] Refactor toward a Layered Architecture (PL / BLL / DAL separation)
- [x] Clean the app (remove tutorial leftovers)
- [ ] DrawIO Diagram of architecture, and put it in the project
- [ ] Implement Error Handling
- [ ] Add ESLint rules to enforce boundaries between layers
- [ ] Implement unit Testing ? (use [Vitest?](https://vitest.dev/))
  - UI done by Emanuelle manually
  - Backend done with unit tests
    - Unit Test : BLL to test as n°1, test the errors, throw and successes
    - Intergartion Test : DAL, test the : docker run / stop, schema migrations, execute "insert, list, udate, delete" and verify the results from the DB
- [ ] Dockerize the full application
- [ ] Verify where there are too many arguments of functions, and pass a model instead


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