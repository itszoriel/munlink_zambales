# Deploy MunLink to Render (Singapore)

This guide uses Render Blueprints (`render.yaml`) to provision the API and frontends.

## Prerequisites
- Render account, with billing enabled for managed Postgres and Disks
- GitHub repo connected to Render

## One-time setup
1. Commit `render.yaml` to the repository root (already added).
2. In Render, create a **Blueprint** and point it to your repo/branch.
3. Click **Apply** to provision services.

## Configure environment variables
In the `munlink-api` service:
- Replace `DATABASE_URL` with your managed Postgres string in the format:
  `postgresql+psycopg://USER:PASSWORD@HOST:PORT/DB?sslmode=require`
- Set `SMTP_USERNAME`, `SMTP_PASSWORD`, and `FROM_EMAIL` (use Gmail App Password or a proper SMTP provider).
- Optionally set `COOKIE_DOMAIN=.yourdomain.com` if using one parent domain for web/admin/api.

The API service is configured to:
- Install requirements from `apps/api/requirements.txt`
- Start with Gunicorn binding to `$PORT`
- Run `flask db upgrade` after each deploy
- Mount a 1GB disk at `/var/uploads` (adjust size as needed)

## Frontend build
Both static sites are configured to build with `VITE_API_URL` pointing to the API service hostname. If you change the API service name or domain, update the `buildCommand` lines.

## Post-deploy checks
1. Visit `/health` on the API service — expect `{"status":"healthy"}`
2. Create a user and login — ensure cookies are set with `Secure` and `SameSite=None`.
3. Upload a marketplace image — confirm it appears under `/uploads/marketplace/...`
4. Admin private file fetch — verify `/api/admin/files?path=verification/...` returns the file with auth.

## Notes
- The `/uploads` route serves only `marketplace/` and `announcements/` publicly.
- Private categories (verification, documents, issues, benefits, profiles) must be accessed via `/api/admin/files`.
- Database connection resilience is enabled (`pool_pre_ping`, `pool_recycle`).

## Troubleshooting
- 401 on refresh: ensure HTTPS and `JWT_COOKIE_SAMESITE=None`, `JWT_COOKIE_SECURE=True`.
- 403 on uploads: expected for private categories; use admin download API instead.
- DB connection drops: adjust `DB_POOL_RECYCLE`, keep API and DB in the same region.


