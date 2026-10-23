# Service map

The scaffold is a small platform rather than a single page:

| Service | Runtime | Responsibility | Port |
| --- | --- | --- | --- |
| `app` | Next.js | Public site, admin workspace, auth, API route handlers | 3000 |
| `api` | Next.js route handlers | `/api/*` under the same runtime as `app` | 3000 |
| `whatsapp` | Go + WhatsMeow | WhatsApp sessions, pairing, messages, media, health | 3001 |

## Coolify deployment

Create two applications from `vishalgojha/opsivio-demo`:

1. **App/API** — Dockerfile build, Dockerfile `/Dockerfile`, exposed port `3000`.
   Point the client website domain here. API routes are available under the
   same domain at `/api/*`.
2. **WhatsApp** — Dockerfile build, Dockerfile
   `/services/whatsmeow-ingestor/Dockerfile`, exposed port `3001`. Set the
   database, internal token, and `OPSIVIO_*` variables from `.env.example`.

The public site talks to WhatsApp through the private internal URL; do not
expose port 3001 publicly unless a client explicitly needs it.

## Client design customisation

Set the `NEXT_PUBLIC_SITE_*` values in the App/API application. Logo and
favicon assets can be replaced in `public/brand/`, while colours are applied
through the typed config in `lib/site-config.ts` and CSS design tokens.
