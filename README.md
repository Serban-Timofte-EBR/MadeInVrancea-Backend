# Made in Vrancea

An interactive regional map and business directory for Vrancea County, Romania.
The project is split into two apps:

| Folder                                               | Stack                                          | Dev URL                   |
| ---------------------------------------------------- | ---------------------------------------------- | ------------------------- |
| [`MadeInVrancea-Backend`](./MadeInVrancea-Backend)   | NestJS 11 · TypeORM · SQL Server · JWT         | http://localhost:3000/api |
| [`MadeInVrancea-Frontend`](./MadeInVrancea-Frontend) | React 19 · Vite · MUI · React Router · Leaflet | http://localhost:5173     |

The frontend talks to the backend REST API. In development, Vite proxies
`/api` and `/uploads` to the backend, so no CORS configuration is needed.

---

## 1. Prerequisites

- **Node.js 20.19+ or 22+** and npm (check with `node -v`)
- **A SQL Server database** — the easiest option is Docker (see below). A local
  SQL Server / SQL Server Express instance works too.
- **Docker Desktop** (optional, only if you use the Docker database option)

---

## 2. Start the database (SQL Server)

The backend needs a running SQL Server instance. It will **create the database
and tables automatically** on first boot — you only need the server running.

### Option A — Docker (recommended)

```powershell
docker run `
  -e "ACCEPT_EULA=Y" `
  -e "MSSQL_SA_PASSWORD=Your_password123" `
  -p 1433:1433 `
  --name miv-sqlserver `
  -d mcr.microsoft.com/mssql/server:2022-latest
```

- Stop it later with `docker stop miv-sqlserver`, start again with `docker start miv-sqlserver`.
- The SA password must match `DB_PASSWORD` in the backend `.env` (see next step).

### Option B — Existing SQL Server instance

Make sure it listens on `localhost:1433` and that you have a login (e.g. `sa`)
with a password. You'll put those values in the backend `.env`.

> You do **not** need to create the `madeinvrancea` database yourself — the
> backend creates it on startup in development.

---

## 3. Start the backend (API)

```powershell
cd MadeInVrancea-Backend
npm install

# Create your local environment file from the template
Copy-Item .env.example .env

# Start in watch mode
npm run start:dev
```

On the first run the backend will:

1. Create the `madeinvrancea` database if it doesn't exist.
2. Create all tables from the entities (`DB_SYNCHRONIZE=true`).
3. Seed roles, a default **admin** account, the **10 categories**, and **17
   sample Vrancea businesses**.

When it's ready you'll have:

- API base URL: **http://localhost:3000/api**
- Swagger docs: **http://localhost:3000/api/docs**

### Backend environment variables (`.env`)

The defaults in `.env.example` match the Docker command above, so it usually
works without edits. Adjust the database section if your setup differs.

| Variable                              | Default                   | Notes                                             |
| ------------------------------------- | ------------------------- | ------------------------------------------------- |
| `PORT`                                | `3000`                    | API port                                          |
| `JWT_SECRET`                          | `change-me-in-production` | Use a long random value in production             |
| `JWT_EXPIRES_IN`                      | `7d`                      | Token lifetime                                    |
| `DB_HOST`                             | `localhost`               | SQL Server host                                   |
| `DB_PORT`                             | `1433`                    | SQL Server port                                   |
| `DB_USERNAME`                         | `sa`                      | SQL Server login                                  |
| `DB_PASSWORD`                         | `Your_password123`        | Must match your SQL Server password               |
| `DB_NAME`                             | `madeinvrancea`           | Auto-created in development                       |
| `DB_ENCRYPT` / `DB_TRUST_SERVER_CERT` | `true`                    | Keep both `true` locally                          |
| `DB_SYNCHRONIZE`                      | `true`                    | Auto-create tables in dev; `false` in prod        |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD`      | see below                 | Seeded admin account                              |
| `AZURE_STORAGE_CONNECTION_STRING`     | _(empty)_                 | Empty = store uploads on local disk (`./uploads`) |

---

## 4. Start the frontend (web app)

Open a **second terminal**:

```powershell
cd MadeInVrancea-Frontend
npm install
npm run dev
```

Then open **http://localhost:5173**.

The API base URL is preconfigured in `MadeInVrancea-Frontend/.env`
(`VITE_API_URL=/api`) and Vite proxies requests to `http://localhost:3000`, so
the two apps work together with no extra setup.

---

## 5. Default logins (seeded)

| Role           | Email                    | Password            |
| -------------- | ------------------------ | ------------------- |
| Administrator  | `admin@madeinvrancea.ro` | `Admin_password123` |
| Business owner | `owner@madeinvrancea.ro` | `Owner_password123` |

- Admins land on the admin panel (`/admin`) — vetting queue, users, categories.
- Business owners land on the merchant dashboard (`/cont`).
- Visitors can browse the map, directory, and business profiles without a login.

> You can also register a brand-new business-owner account from the
> **Adaugă afacerea** button in the header.

---

## 6. Quick start (TL;DR)

```powershell
# 1. Database (Docker)
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Your_password123" -p 1433:1433 --name miv-sqlserver -d mcr.microsoft.com/mssql/server:2022-latest

# 2. Backend (terminal 1)
cd MadeInVrancea-Backend; npm install; Copy-Item .env.example .env; npm run start:dev

# 3. Frontend (terminal 2)
cd MadeInVrancea-Frontend; npm install; npm run dev
```

Open http://localhost:5173.

---

## 7. Useful commands

**Backend**

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `npm run start:dev`  | Start API in watch mode                 |
| `npm run build`      | Compile to `dist/`                      |
| `npm run start:prod` | Run the compiled app (`node dist/main`) |
| `npm run lint`       | Lint (with `--fix`)                     |
| `npm test`           | Unit tests                              |

**Frontend**

| Command           | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start Vite dev server (http://localhost:5173) |
| `npm run build`   | Type-check and build to `dist/`               |
| `npm run preview` | Preview the production build                  |
| `npm run lint`    | Lint                                          |

---

## 8. Troubleshooting

- **Backend can't connect to the database** — make sure SQL Server is running
  and that `DB_HOST`, `DB_PORT`, `DB_USERNAME`, and `DB_PASSWORD` in the backend
  `.env` match your instance. With Docker, confirm the container is up:
  `docker ps`.
- **`Login failed for user 'sa'`** — the `.env` `DB_PASSWORD` must equal the
  `MSSQL_SA_PASSWORD` you used when creating the container.
- **Frontend loads but shows errors / empty data** — the backend must be
  running on port `3000`. Start it before (or alongside) the frontend.
- **Port already in use** — change `PORT` in the backend `.env`, or stop the
  process using the port. If you change the backend port, update the proxy
  target in `MadeInVrancea-Frontend/vite.config.ts`.
- **Reset the sample data** — drop the `madeinvrancea` database (or remove the
  Docker container with `docker rm -f miv-sqlserver`) and restart the backend;
  it will recreate and reseed everything.
