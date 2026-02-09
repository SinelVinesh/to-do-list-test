# To-Do List App

A CRUD to-do list web app (Neoshore hiring test). Backend: NestJS + TypeORM. Frontend: React + MUI. Deployable with Docker Compose.

## Run with Docker Compose (recommended)

```bash
docker-compose up --build
```

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432 (user `postgres`, password `postgres`, database `todo`)

The frontend is served by Nginx and proxies `/api` to the backend. Full CRUD works in the browser.

### Environment variables (Docker)

Default values are set in `docker-compose.yml`. To override, create a `.env` file in the project root (see `.env.example`). Do not commit secrets.

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` – PostgreSQL connection for the backend.
- `PORT` – Backend port (default 3000).

## Run locally (development)

### Prerequisites

- Node 20+
- pnpm (or npm)
- PostgreSQL 16 (or run only the DB with Docker: `docker-compose up -d db`)

### Backend

```bash
cd backend
cp .env.example .env   # adjust if needed
pnpm install
pnpm run start:dev
```

Runs at http://localhost:3000. Uses `DB_*` env vars (see `.env.example`).

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

Runs at http://localhost:5173. Vite proxies `/api` to the backend.

## API

- `GET /tasks?page=1&limit=50` – List tasks (paginated).
- `GET /tasks/:id` – Get one task.
- `POST /tasks` – Create task (body: `{ title, description?, completed? }`).
- `PATCH /tasks/:id` – Update task (partial body).
- `DELETE /tasks/:id` – Delete task.

## Scalability

The app is built to handle hundreds of users:

- **Stateless API**: Backend has no in-memory session state; you can run multiple instances behind a load balancer.
- **Connection pooling**: TypeORM/PostgreSQL use connection pooling by default.
- **Pagination**: `GET /tasks` is paginated (default 50, max 100 per page) to keep list responses fast.
- **Indexing**: The `tasks` table has an index on `createdAt` for efficient list ordering.

No authentication in the MVP; all users share one task list.
