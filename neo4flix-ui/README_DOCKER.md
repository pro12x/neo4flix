# Docker: neo4flix-ui

This project builds the Angular app and serves it with Nginx.

## Build & run with docker-compose

From repo root:

- Full stack:
  - `docker-compose up --build`

- Simple stack:
  - `docker-compose -f docker-compose-simple.yml up --build`

The UI is exposed on:
- http://localhost:4200

## Runtime API configuration

The container generates `assets/env.js` at startup from the env var:

- `API_BASE_URL` (default: `http://localhost:1111`)

Example:

- Set API to the gateway:
  - `API_BASE_URL=http://localhost:1111`

- If you enable Nginx proxy `/api` in `nginx/default.conf`, you can set:
  - `API_BASE_URL=/api`

## Notes

- The UI is a static SPA; routes are handled with `try_files ... /index.html`.
- If you change ports, update `.env` and compose mappings.
