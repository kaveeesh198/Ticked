# Ticked — Backend

Node.js + Express + PostgreSQL REST API.

## Setup

```bash
cp .env.example .env      # fill in your values
npm install
npm run db:init           # create tables
npm run dev               # start dev server → http://localhost:5000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with auto-reload (nodemon) |
| `npm start` | Start production server |
| `npm run db:init` | Initialize database tables |

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (e.g. 7d) |
| `CLIENT_URL` | Frontend URL for CORS |
