# Health Certificate Management System (Balady)

A web application for managing and displaying health certificates, designed to emulate the Saudi Balady platform interface.

## Architecture

- **Backend**: Node.js + Express (`server.js`) serving on port 5000
- **Frontend**: Vanilla HTML/CSS/JS in the `public/` directory
- **Database**: PostgreSQL (Replit managed, via `DATABASE_URL` environment variable)

## How It Works

The Express server (`server.js`):
1. Serves all static files from `public/`
2. Exposes a secure REST API at `/api/` for all database operations
3. Initializes the database schema on startup

### API Endpoints

- `GET /api/certificates` — list all certificates
- `GET /api/certificates/:id` — get certificate by id, certNumber, or idNumber
- `POST /api/certificates` — create/upsert a certificate
- `PUT /api/certificates/:id` — update a certificate
- `DELETE /api/certificates/:id` — delete a certificate
- `GET /api/dropdown-items` — list all dropdown items (amanah, municipality, job, etc.)
- `POST /api/dropdown-items` — add a dropdown item
- `PUT /api/dropdown-items/:id` — update a dropdown item
- `DELETE /api/dropdown-items/:id` — delete a dropdown item
- `POST /api/dropdown-items/seed` — bulk seed dropdown items

## Pages

- `/` or `/index.html` — Admin dashboard (protected by simple client-side auth)
- `/certificate.html?id=<id>` — View/print a certificate
- `/verify/health/issue/PrintedLicenses?id=<id>` — Balady-style certificate verification page

## Database Tables

- `certificates` — stores all health certificate records
- `dropdown_items` — stores amanah, municipality, job, program, nationality options

## Authentication

Simple client-side authentication in `public/assets/auth.js`:
- Username: `admin@balady`
- Password: `Balady.X`

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (Replit managed)
- `PORT` — Server port (default 5000)

## Startup

```
node server.js
```
