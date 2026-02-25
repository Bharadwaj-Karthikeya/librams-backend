# Librams Backend

A lightweight Node.js + Express service that powers the Librams library management workflow (auth, catalog, and issue tracking). The codebase now emits structured console logs for every controller/service step so you can trace each request end-to-end.

## Features
- Role-aware authentication with direct signup and JWT-based sessions
- Book catalog management with Cloudinary-backed media uploads
- Issue lifecycle management (issue, extend, return, overdue auditing)
- Centralized request validation through Zod schemas
- Rate limiting, schema validation, and detailed server-side logging for observability

## Tech Stack
- Node.js 20+, Express 5
- MongoDB & Mongoose 9
- Zod for validation
- Cloudinary for asset storage

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Copy environment variables**
   ```bash
   cp .env.example .env
   # fill in MongoDB, JWT secret, and Cloudinary credentials
   ```
3. **Run the server (development)**
   ```bash
   node server.js
   ```
4. **Soft compile / syntax check**
   ```bash
   node --check server.js
   node --check src/app.js
   ```

> ℹ️ The project does not yet ship with automated tests (`npm test` currently exits early). See the _Testing_ section for guidance.

## Available Scripts
| Command | Description |
| --- | --- |
| `npm install` | Installs all dependencies |
| `npm test` | Placeholder – exits with status 1 because no spec suite is defined |
| `node server.js` | Boots the API (reads configuration from `.env`) |

## Environment Variables
See [.env.example](.env.example) for the full list. Required keys:

| Variable | Purpose |
| --- | --- |
| `PORT` | Express listen port (defaults to 5000) |
| `FRONTEND_URL` | Allowed CORS origin |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for signing JWTs |
| `CLOUDINARY_*` | Cloudinary cloud, API key, and secret |

## Logging & Observability
- Every controller logs the incoming request context (never passwords/token bodies).
- Services emit progress logs (DB reads/writes, role checks, uploads) and failures.
- Middlewares log auth/role validation failures, making it easier to trace rejection causes.

## API Documentation
OpenAPI documentation is available at [docs/swagger.yaml](docs/swagger.yaml). Load it in Swagger UI or Insomnia Designer to explore request/response contracts.

## Testing Status
Automated tests are not yet implemented. `npm test` will return:
- `"Error: no test specified"` (exit code 1)

To add coverage, consider Jest or Vitest suites around services and controllers.

## Folder Structure
```
src/
  app.js              # Express app bootstrap
  controllers/        # Route handlers with logging
  services/           # Business logic
  routes/             # Express routers + middleware chains
  middlewares/        # Auth, rate limiting, file uploads, validation
  models/             # Mongoose schemas
  dtos/               # Zod schemas (body/params/query)
   utils/              # Upload helpers and token utilities
```

## Swagger Quickstart
```bash
# Serve the swagger document locally via npx
npx swagger-ui-watcher docs/swagger.yaml
```
Then navigate to the printed URL to interact with the docs.
