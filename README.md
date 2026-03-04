# Librams Backend

A lightweight Node.js + Express service that powers the Librams library management workflow (auth, catalog, and issue tracking). The codebase emits structured console logs for every controller/service step so you can trace each request end-to-end.

## Features
- Role-aware authentication with direct signup and JWT-based sessions
- Book catalog management with Cloudinary-backed media uploads
- Issue lifecycle management (issue, extend, return, overdue auditing) with scheduled overdue checks
- Centralized request validation through Zod schemas
- Rate limiting and detailed server-side logging for observability
- Jest unit tests for core services

## Tech Stack
- Node.js 20+, Express 5
- MongoDB & Mongoose 9
- Zod, Jest
- Cloudinary, Multer
- node-cron

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
   npm start
   ```
4. **Run tests (optional)**
   ```bash
   npm test
   ```
5. **Soft compile / syntax check (optional)**
   ```bash
   node --check server.js
   node --check src/app.js
   ```

## Available Scripts
| Command | Description |
| --- | --- |
| `npm start` | Boots the API (reads configuration from `.env`) |
| `npm test` | Runs Jest unit tests |
| `npm run build` | Installs dependencies (used by some deployment platforms) |

## Environment Variables
See [.env.example](.env.example) for the full list.

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Express listen port (defaults to 5000) |
| `NODE_ENV` | No | Node environment (development/production) |
| `FRONTEND_URL` | Yes | Allowed CORS origin (app also allows `http://localhost:5173`) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used for signing JWTs |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `OVERDUE_CRON_SCHEDULE` | No | Cron schedule for overdue checks (default `*/5 * * * *`) |

## Authentication & Rate Limiting
- Use `Authorization: Bearer <token>` for protected routes.
- Roles: `admin`, `staff`, `student`.
- Rate limiting: 50 requests per minute per IP.

## File Uploads
- `profilePic` (max 5 MB) for signup and profile updates.
- `bookCover` (max 10 MB) for adding/updating books.
- Use `multipart/form-data` when uploading files.

## API Documentation
OpenAPI documentation is available at [docs/swagger.yaml](docs/swagger.yaml). Load it in Swagger UI or Insomnia Designer to explore request/response contracts.

## API Endpoints (Summary)

### Auth
- `POST /auth/signup` - Create account (multipart/form-data, optional `profilePic`).
- `POST /auth/login` - Login and retrieve JWT.
- `GET /auth/profile` - Fetch current user profile.
- `PATCH /auth/profile` - Update profile (multipart/form-data).
- `DELETE /auth/delete` - Delete a user (body: `userId`).
- `POST /auth/reset-password` - Reset a user's password (admin/staff).
- `POST /auth/change-password` - Change current user's password.
- `POST /auth/update-role` - Update a user's role (admin).

### Books
- `POST /books/add` - Add a book (admin/staff, multipart/form-data).
- `GET /books/all` - List books visible to the user.
- `PATCH /books/update` - Update book fields (admin/staff, body includes `bookId`).
- `GET /books/details/:bookId` - Fetch a single book.
- `GET /books/category/:category` - Filter by category.
- `GET /books/search?searchTerm=` - Text search.
- `DELETE /books/delete` - Soft delete (admin/staff, body: `bookId`).
- `DELETE /books/delete-complete` - Hard delete (admin, body: `bookId`).

### Issues
- `POST /issues/issue` - Issue a book (admin/staff, body: `isbn`, `toUserEmail`, `dueDate`).
- `POST /issues/return/:id` - Return an issue (admin/staff).
- `PUT /issues/extend/:id` - Extend due date (admin/staff, body: `newDueDate`).
- `GET /issues/overdue` - List overdue issues (admin/staff).
- `GET /issues` - List all issues (admin/staff).
- `GET /issues/:id` - Get issue details (admin/staff).
- `GET /issues/search?searchTerm=` - Search issues (admin/staff).
- `GET /issues/book/:bookId` - Issue history for a book (admin/staff).
- `GET /issues/my-issues` - Issues for the authenticated user.
- `GET /issues/user?userId=` - Issues for a specific user (if `userId` is provided).

Note: Issuing uses `isbn` instead of internal book IDs so staff/students never need database identifiers.

## Cron Jobs
- Overdue checks start after MongoDB connects.
- Schedule via `OVERDUE_CRON_SCHEDULE` (default every 5 minutes).
- Marks expired issues as `overdue`.

## Logging & Observability
- Every controller logs the incoming request context (never passwords/token bodies).
- Services emit progress logs (DB reads/writes, role checks, uploads) and failures.
- Middlewares log auth/role validation failures, making it easier to trace rejection causes.

## Testing
Unit tests live under `tests/services` and use Jest with ESM support. Coverage focuses on auth, books, and issues services.
```bash
npm test
```

## Folder Structure
```
src/
  app.js              # Express app bootstrap
  config/             # DB + Cloudinary setup
  controllers/        # Route handlers with logging
  cron/               # Scheduled jobs (overdue tracker)
  dtos/               # Zod schemas (body/params/query)
  middlewares/        # Auth, rate limiting, file uploads, validation
  models/             # Mongoose schemas
  routes/             # Express routers + middleware chains
  services/           # Business logic
  utils/              # Upload helpers and token utilities
```

## Swagger Quickstart
```bash
# Serve the swagger document locally via npx
npx swagger-ui-watcher docs/swagger.yaml
```
Then navigate to the printed URL to interact with the docs.

## Deployments
- Vercel Frontend: [liberams-frontend.vercel.app](https://liberams-frontend.vercel.app)
- Render Backend: [liberams-backend.onrender.com](https://liberams-backend.onrender.com)

## Librams Frontend Repository
- [Frontend](https://github.com/Bharadwaj-Karthikeya/librams-frontend)