# MunLink Zambales - Render Deployment Checklist

## 0) Prereqs
- [ ] Code pushed to GitHub
- [ ] Files present: `render.yaml`, `RENDER_DEPLOYMENT_GUIDE.md`, `ENV_RENDER_COPY.txt`, `RENDER_SECRETS_COPYPASTE.txt`

## 1) Create Blueprint from GitHub
- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Blueprint"
- [ ] Connect your GitHub repo with this project
- [ ] Confirm Render detects `render.yaml`

## 2) Configure env vars (munlink-api)
- [ ] Open `munlink-api` → Environment → Add from `RENDER_SECRETS_COPYPASTE.txt`
- [ ] Replace `DATABASE_URL` with the DB Internal URL (after DB is created)
- [ ] Click Save

## 3) Apply Blueprint
- [ ] Click "Apply" to create services:
  - `munlink-db` (PostgreSQL starter)
  - `munlink-api` (Python web service, standard plan)
  - `munlink-web` (static)
  - `munlink-admin` (static)

## 4) Wait for first deploys
- [ ] DB → should be green
- [ ] API → builds, runs `flask db upgrade`, then starts Gunicorn
- [ ] Web/Admin → build with Vite and publish `dist`

## 5) Update API URLs with actual Render URLs
- [ ] Visit `munlink-web` and `munlink-admin`, copy their HTTPS URLs
- [ ] In `munlink-api` env:
  - [ ] Set `WEB_URL` to your web site URL
  - [ ] Set `ADMIN_URL` to your admin site URL
  - [ ] Optionally confirm `QR_BASE_URL=https://<web>/verify`
  - [ ] Confirm `BASE_URL=https://<api>`
- [ ] Redeploy `munlink-api`

## 6) Seed data (optional)
- [ ] API → Shell tab
- [ ] Run:
  ```bash
  cd apps/api
  python scripts/seed_data.py
  python scripts/create_admin.py
  ```

## 7) Smoke test
- [ ] API: `GET /health` returns JSON `{ status: 'healthy', ... }`
- [ ] Web: registration + login flows
- [ ] Admin: login + dashboard loads
- [ ] Uploads: upload a profile photo; open link under `/uploads/...`
- [ ] Documents: create request → verify PDF generated and accessible
- [ ] QR/Claim: generate ticket; QR deep-link opens admin verification

## 8) Monitoring & Scaling
- [ ] Verify API plan: `standard` (no cold starts)
- [ ] Disk size: 50GB (increase if needed)
- [ ] Workers: 4 (tune if CPU-bound)

## 9) Rollback Plan
- [ ] Keep previous successful build to roll back if needed (Render keeps history)
- [ ] DB backups: automatic daily; verify restore process in Render docs

## Notes
- Frontends use token in memory/storage (no cookies) — no extra cookie/CORS setup needed
- Gmail App Password must be pasted without spaces
