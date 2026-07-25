# Made in Vrancea — Backend (Phase 1)

REST API for the **Made in Vrancea** platform: an interactive regional map and
business directory for the Vrancea county. Built with **NestJS**, **TypeORM**
and **SQL Server** (Azure SQL in production).

The code follows a **controller → service → model (entity) → DTO** architecture.
Feature modules: `auth`, `users`, `roles`, `categories`, `businesses`,
`locations`, `media`, `map`, `logs`.

---

## Prerequisites

- **Node.js 20+** and **npm**
- A database, using either:
  - **Docker Desktop** (recommended — runs SQL Server locally in one command), or
  - an existing **SQL Server** / **Azure SQL** instance you can connect to.

---

## Quick start (local development)

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy the provided template and adjust values if needed:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

The defaults in `.env.example` already match the local Docker database below,
so it works out of the box.

### 3. Start the database

Using Docker (starts SQL Server on `localhost:1433`, plus an optional Azurite
blob emulator):

```bash
docker compose up -d
```

> Already have SQL Server? Skip Docker and point the `DB_*` variables in `.env`
> at your instance instead.

### 4. Run the API

```bash
npm run start:dev
```

On the **first boot** the application automatically:

1. creates the `madeinvrancea` database if it does not exist,
2. creates all tables from the entities (because `DB_SYNCHRONIZE=true`),
3. seeds the system roles and a **default admin** account.

### 5. Open it

| What                          | URL                               |
| ----------------------------- | --------------------------------- |
| API base                      | http://localhost:3000/api         |
| Swagger UI (interactive docs) | http://localhost:3000/api/docs    |
| Health check                  | http://localhost:3000/api/health  |
| Locally stored uploads        | http://localhost:3000/uploads/... |

**Default admin** (from `.env`): `admin@madeinvrancea.ro` / `Admin_password123`.
Log in with `POST /api/auth/login` to obtain a JWT.

---

## Authentication

All routes require a JWT **except** those marked as public (auth, health, and
read-only catalog/map endpoints).

1. Register a business owner: `POST /api/auth/register`
2. Log in: `POST /api/auth/login` → returns `{ accessToken, user }`
3. Send the token on protected requests:
   `Authorization: Bearer <accessToken>`
4. In Swagger UI, click **Authorize** and paste the token to try endpoints.

Roles: `Admin`, `BusinessOwner`, `Customer`, `Guest`. New registrations become
`BusinessOwner`; the seeded admin is `Admin`.

---

## Available scripts

| Command              | Description                           |
| -------------------- | ------------------------------------- |
| `npm run start:dev`  | Start in watch mode (development).    |
| `npm run start`      | Start once.                           |
| `npm run start:prod` | Run the compiled build (`dist/main`). |
| `npm run build`      | Compile TypeScript to `dist/`.        |
| `npm run lint`       | Lint and auto-fix.                    |
| `npm run format`     | Format with Prettier.                 |
| `npm run test`       | Unit tests.                           |
| `npm run test:e2e`   | End-to-end tests.                     |

---

## Environment variables

| Variable                          | Default                   | Description                                                      |
| --------------------------------- | ------------------------- | ---------------------------------------------------------------- |
| `NODE_ENV`                        | `development`             | `development` or `production`.                                   |
| `PORT`                            | `3000`                    | HTTP port.                                                       |
| `JWT_SECRET`                      | `change-me-in-production` | Secret used to sign JWTs. **Change in production.**              |
| `JWT_EXPIRES_IN`                  | `7d`                      | Token lifetime.                                                  |
| `DB_HOST`                         | `localhost`               | SQL Server host.                                                 |
| `DB_PORT`                         | `1433`                    | SQL Server port.                                                 |
| `DB_USERNAME`                     | `sa`                      | Database user.                                                   |
| `DB_PASSWORD`                     | `Your_password123`        | Database password.                                               |
| `DB_NAME`                         | `madeinvrancea`           | Database name (auto-created in dev).                             |
| `DB_ENCRYPT`                      | `true`                    | Encrypt the connection (required by Azure SQL).                  |
| `DB_TRUST_SERVER_CERT`            | `true`                    | Trust self-signed certs (local Docker). Set `false` on Azure.    |
| `DB_SYNCHRONIZE`                  | `true` in dev             | Auto-create schema from entities. **Set `false` in production.** |
| `ADMIN_EMAIL`                     | `admin@madeinvrancea.ro`  | Seeded admin email.                                              |
| `ADMIN_PASSWORD`                  | `Admin_password123`       | Seeded admin password.                                           |
| `AZURE_STORAGE_CONNECTION_STRING` | _(empty)_                 | Empty = store uploads on local disk. See below.                  |
| `AZURE_STORAGE_CONTAINER`         | `media`                   | Blob container name.                                             |
| `AZURE_STORAGE_PUBLIC_URL`        | _(empty)_                 | Optional CDN/base URL prefixed to file URLs.                     |

---

## Media storage

Uploads (logos, covers, gallery images) are handled by a storage service with
three modes:

- **Local disk (default):** leave `AZURE_STORAGE_CONNECTION_STRING` empty. Files
  are saved to `./uploads` and served at `/uploads/...`.
- **Azurite (local Azure emulator):** set
  `AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true` (the `docker
compose` file already starts Azurite).
- **Azure Blob Storage (production):** paste the storage account connection
  string.

---

## API overview

All paths are prefixed with `/api`. Explore and try them in Swagger at
`/api/docs`.

| Module                           | Endpoints                                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Health**                       | `GET /` · `GET /health`                                                                                                                                       |
| **Auth**                         | `POST /auth/register` · `POST /auth/login` · `GET /auth/me`                                                                                                   |
| **Users** _(admin)_              | `GET /users` · `GET /users/:id` · `PATCH /users/:id` · `PATCH /users/:id/suspend` · `PATCH /users/:id/activate` · `DELETE /users/:id`                         |
| **Roles** _(admin)_              | `GET/POST /roles` · `GET/PATCH/DELETE /roles/:id`                                                                                                             |
| **Categories**                   | `GET /categories` (`?tree=true`) · `GET /categories/slug/:slug` · `GET /categories/:id` · _(admin)_ `POST/PATCH/DELETE`                                       |
| **Businesses**                   | `GET /businesses` (search + pagination) · `GET /businesses/slug/:slug` · `GET /businesses/:id`                                                                |
| **Businesses** _(owner)_         | `GET /businesses/me/list` · `GET /businesses/me/:id` · `POST /businesses` · `PATCH /businesses/:id` · `DELETE /businesses/:id`                                |
| **Businesses** _(admin vetting)_ | `GET /businesses/admin/pending` · `PATCH /businesses/:id/approve` · `PATCH /businesses/:id/reject` · `PATCH /businesses/:id/suspend`                          |
| **Locations**                    | `GET /businesses/:businessId/locations` · `POST /businesses/:businessId/locations` · `PATCH/DELETE /locations/:id` · `GET/PUT /locations/:id/operating-hours` |
| **Media**                        | `GET /businesses/:businessId/media` · `POST /businesses/:businessId/media` (multipart) · `DELETE /media/:id`                                                  |
| **Map**                          | `GET /map/pins` (viewport + category filter)                                                                                                                  |
| **Logs / Analytics**             | `POST /logs` · `GET /businesses/:businessId/analytics`                                                                                                        |

---

## Project structure

```
src/
  common/            # enums, decorators, guards, transformers, utils
  config/            # configuration + TypeORM connection factory
  database/          # DB bootstrap (auto-create) + role/admin seeder
  modules/
    auth/            # register/login, JWT strategy, guards
    users/
    roles/
    categories/
    businesses/
    locations/       # locations + operating hours
    media/           # uploads + blob/local storage
    map/             # geospatial pins for the interactive map
    logs/            # visitor traffic + business analytics
  app.module.ts
  main.ts
```

Each feature module keeps the same layout:
`*.controller.ts` · `*.service.ts` · `*.module.ts` · `entities/` · `dto/`.

---

## Production & Azure deployment (low cost)

Target budget: **~$5/month for the database**, well within the €15 range.

| Concern     | Azure service                       | Notes                                             |
| ----------- | ----------------------------------- | ------------------------------------------------- |
| Database    | **Azure SQL Database — Basic tier** | ~5 USD/month, 2 GB. Same `mssql` driver as local. |
| API hosting | **Azure App Service** (Linux, Node) | Deploy via GitHub Actions.                        |
| Media       | **Azure Blob Storage**              | A few cents/month.                                |

Production checklist:

1. Set `NODE_ENV=production`.
2. Set `DB_SYNCHRONIZE=false` and manage schema changes with migrations.
3. Use a strong random `JWT_SECRET`.
4. Set the real `DB_*` values from Azure SQL and `DB_TRUST_SERVER_CERT=false`.
5. Set `AZURE_STORAGE_CONNECTION_STRING` to the storage account.
6. Build and run:

   ```bash
   npm run build
   npm run start:prod
   ```

---

## Troubleshooting

- **Cannot connect to the database / login failed for user 'sa':** ensure the
  container is up (`docker compose ps`) and that `DB_PASSWORD` matches
  `MSSQL_SA_PASSWORD` in `docker-compose.yml`.
- **Port 1433 already in use:** stop the other SQL Server instance or change
  `DB_PORT` and the compose port mapping.
- **Uploads not persisted:** with local disk mode, files live in `./uploads`
  (git-ignored). Configure Azure Blob Storage for durable storage.
