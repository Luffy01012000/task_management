# Task Manager — MERN + TypeScript

A full-stack Task Management application built with a feature-based, layered
architecture on the backend and a modern React 19 frontend.

## Tech Stack

**Backend**

- Node.js 22, Express.js, TypeScript (via `tsx`)
- MongoDB + Mongoose
- JWT authentication, `bcryptjs` password hashing
- `zod` for request validation (with strong password rules)
- Feature-based layered architecture: `routes → controller → service → repository → model`
- Seeders that run automatically on server start (`RUN_SEEDERS_ON_START=true`)
- ESLint, Prettier

**Frontend**

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 + shadcn/ui-style components (Radix primitives)
- TanStack Query v5 for all server-state/data-fetching
- `@dnd-kit` Kanban board with drag-and-drop status changes
- Debounced search (custom `useDebounce` hook)
- `react-hot-toast` notifications, skeleton loaders, dark mode
- React Router v7

**Tooling**

- Docker + Docker Compose (Mongo + backend + frontend/nginx)
- GitHub Actions CI (lint + build both apps on every push to `main`)
- Husky + lint-staged + commitlint (Conventional Commits) at the repo root

## Project Structure

```
task-manager/
├── backend/
│   └── src/
│       ├── config/          # env, db connection
│       ├── modules/
│       │   ├── auth/        # validation, controller, service, repository, routes
│       │   ├── tasks/       # validation, controller, service, repository, model, routes
│       │   └── users/       # user model
│       ├── middleware/      # auth, validation, error handling
│       ├── seeders/         # runs on startup + `npm run seed`
│       ├── utils/           # ApiError, asyncHandler, jwt
│       ├── app.ts
│       └── server.ts
├── frontend/
│   └── src/
│       ├── components/      # ui/, kanban/, forms, navbar, filters, pagination
│       ├── context/         # Auth, Theme
│       ├── hooks/           # useDebounce, useTasks (TanStack Query)
│       ├── lib/             # axios instance, query client, utils
│       ├── pages/           # Login, Register, Dashboard
│       └── services/        # typed API clients
├── .github/workflows/ci.yml
├── docker-compose.yml
└── postman_collection.json
```

## Installation & Local Setup

### Prerequisites

- Node.js 22+
- MongoDB running locally, **or** use Docker Compose (recommended)

### 1. Clone & install

```bash
git clone <repo-url>
cd task-manager
npm install --workspaces
```

### 2. Environment variables

Copy the example files and adjust as needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Run with Docker (recommended)

```bash
docker compose up --build
```

This starts MongoDB, the backend (with seeders on first boot), and the
frontend served via nginx on `http://localhost:5173`. The API is available at
`http://localhost:5000/api`.

### 4. Run without Docker

```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

Frontend: http://localhost:5173 · Backend: http://localhost:5000

### Seed data

Seeders run automatically on backend start when `RUN_SEEDERS_ON_START=true`
(default in the example env / Docker Compose). To seed manually:

```bash
npm run seed --workspace backend
```

This creates a demo user:
<!--- **Email:** `demo@example.com`
- **Password:** `Password@123`-->

## Environment Variables

**backend/.env**

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=change_this_super_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
RUN_SEEDERS_ON_START=true
```

**frontend/.env**

```
VITE_API_URL=http://localhost:5000/api
```

## API Documentation

Import `postman_collection.json` into Postman. Summary of endpoints:

| Method | Endpoint                  | Auth | Description                              |
| ------ | ------------------------- | ---- | ---------------------------------------- |
| POST   | `/api/auth/register`      | No   | Register a new user                      |
| POST   | `/api/auth/login`         | No   | Login, returns JWT                       |
| GET    | `/api/tasks`              | Yes  | List tasks (search/filter/sort/paginate) |
| POST   | `/api/tasks`              | Yes  | Create a task                            |
| PUT    | `/api/tasks/:id`          | Yes  | Update a task                            |
| PATCH  | `/api/tasks/:id/complete` | Yes  | Mark a task completed                    |
| DELETE | `/api/tasks/:id`          | Yes  | Delete a task                            |

`GET /api/tasks` query params: `search`, `status`, `priority`, `sortBy`
(`dueDate` | `createdAt` | `priority`), `sortOrder` (`asc` | `desc`), `page`,
`limit`.

## Password Rules

Enforced by both `zod` (backend) and the registration form (frontend):
min 8 characters, at least one uppercase letter, one lowercase letter, one
number, and one special character.

## Bonus Features Implemented

- ✅ Dark mode (toggle in navbar, persisted to `localStorage`)
- ✅ Drag & Drop Kanban board (`@dnd-kit`) with list-view fallback
- ✅ Toast notifications (`react-hot-toast`)
- ✅ Skeleton loaders while fetching
- ✅ Docker & Docker Compose support
- ✅ Role field on user model (Role-Based Access foundation — `user`/`admin`)

## Linting & Git Hooks

- `npm run lint --workspace backend` / `--workspace frontend`
- Husky pre-commit runs `lint-staged` (Prettier + ESLint on staged files)
- commit-msg hook enforces Conventional Commits via commitlint

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: installs deps,
lints, and builds both the backend and frontend — failing the build if either
does not compile.
