# MunLink Zambales - Render Deployment Guide

## Overview
This guide covers deploying MunLink Zambales to Render using the Blueprint feature. The application consists of:
- **Backend API** (Python/Flask) with Postgres database and persistent disk for uploads
- **Public Website** (React/Vite static site)
- **Admin Dashboard** (React/Vite static site)

## Prerequisites
- GitHub account with your code repository
- Render account (free tier works for testing)
- Gmail App Password for SMTP (if using email features)

---

## Deployment Method: Blueprint (Recommended)

### Step 1: Prepare Your Repository

1. **Commit the `render.yaml` blueprint** to your repository root:
   ```bash
   git add render.yaml RENDER_DEPLOYMENT_GUIDE.md
   git commit -m "Add Render deployment blueprint"
   git push origin main
   ```

2. **Push to GitHub** if not already there

### Step 2: Deploy via Render Blueprint

1. **Log in to Render** at https://dashboard.render.com

2. **Create New Blueprint**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`

3. **Configure Secrets** (before first deploy):
   Click on each service and add the secret environment variables:

   **For `munlink-api` service:**
   ```bash
   SECRET_KEY=4d5a4bb38df3a17c8971b77e26cc5f2e0da0eb37b9f7a663a7a19b4cd5ef31cb
   JWT_SECRET_KEY=f7d35600f9d2a1bb4bd2c5b721547c96c3bf15de1add8967dacf4590fb2ad88a15dc8346275e3ba98ea642a939a4e79f8acdd40209237127bf3b3b9360dbe85a
   ADMIN_SECRET_KEY=0641c7b5e072facd6132f65ba06d91fc7c128e9c33703e41ccae43a9aeaaf2ff
   
   # Email (optional but recommended)
   SMTP_USERNAME=munlink.egov@gmail.com
   SMTP_PASSWORD=knbpjwjjsgvdevbw
   FROM_EMAIL=munlink.egov@gmail.com
   
   # Claim/QR Security (optional, will use JWT_SECRET_KEY if not set)
   CLAIM_CODE_ENC_KEY=ZkNc0ptMN4aI7ha6kalqBU593QhVYNuchZ9NceDTF2U=
   CLAIM_JWT_SECRET=ee8cc2285888f966724e3fe8aacc948768e0c3c1ff26d15e7a1567ac7c0a2787
   ```

4. **Deploy**: Click "Apply" to create all services

### Step 3: Wait for First Deploy
- Render will create:
  - PostgreSQL database (`munlink-db`)
  - API service with persistent disk
  - Web static site
  - Admin static site
- First deploy takes 5-10 minutes

### Step 4: Verify Services

Once deployed, you'll have three public URLs:
- API: `https://munlink-api-XXXXX.onrender.com`
- Web: `https://munlink-web-XXXXX.onrender.com`
- Admin: `https://munlink-admin-XXXXX.onrender.com`

**Health Checks:**
1. API: Visit `https://munlink-api-XXXXX.onrender.com/health`
   - Should return: `{"status":"healthy","service":"MunLink Zambales API","version":"1.0.0"}`

2. Web: Visit `https://munlink-web-XXXXX.onrender.com`
   - Should load the public homepage

3. Admin: Visit `https://munlink-admin-XXXXX.onrender.com`
   - Should load admin login page

---

## Manual Deployment (Alternative)

If you prefer to create services manually instead of using Blueprint:

### 1. Create PostgreSQL Database
1. Dashboard → New → PostgreSQL
2. Name: `munlink-db`
3. Database: `munlink_zambales`
4. User: `munlink_user`
5. Plan: Free (or Starter)
6. Copy the **Internal Database URL** after creation

### 2. Create API Web Service
1. Dashboard → New → Web Service
2. Connect your repository
3. Configuration:
   - **Name**: `munlink-api`
   - **Root Directory**: `apps/api`
   - **Runtime**: Python 3
   - **Build Command**:
     ```bash
     pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir psycopg2-binary==2.9.9
     ```
   - **Start Command**:
     ```bash
     flask db upgrade && gunicorn app:app --bind 0.0.0.0:$PORT --workers 3 --timeout 120
     ```
   - **Health Check Path**: `/health`

4. **Add Disk** (for uploads):
   - Name: `uploads`
   - Mount Path: `./uploads`
   - Size: 20 GB (adjust as needed)

5. **Environment Variables**: Add all from your `.env` file, including:
   ```bash
   FLASK_ENV=production
   DEBUG=False
   FLASK_APP=app.py
   DATABASE_URL=<paste-internal-db-url>
   SECRET_KEY=<your-secret>
   JWT_SECRET_KEY=<your-jwt-secret>
   ADMIN_SECRET_KEY=<your-admin-secret>
   # ... (all other env vars from your file)
   ```

### 3. Create Web Static Site
1. Dashboard → New → Static Site
2. Connect repository
3. Configuration:
   - **Name**: `munlink-web`
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   ```bash
   VITE_API_URL=https://munlink-api-XXXXX.onrender.com
   ```

### 4. Create Admin Static Site
1. Dashboard → New → Static Site
2. Connect repository
3. Configuration:
   - **Name**: `munlink-admin`
   - **Root Directory**: `apps/admin`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   ```bash
   VITE_API_URL=https://munlink-api-XXXXX.onrender.com
   VITE_API_BASE_URL=https://munlink-api-XXXXX.onrender.com
   ```

---

## Post-Deployment Configuration

### Update CORS Origins
After all services are deployed, update the API environment variables with the actual URLs:

```bash
WEB_URL=https://munlink-web-XXXXX.onrender.com
ADMIN_URL=https://munlink-admin-XXXXX.onrender.com
BASE_URL=https://munlink-api-XXXXX.onrender.com
QR_BASE_URL=https://munlink-web-XXXXX.onrender.com/verify
VERIFICATION_BASE_URL=https://munlink-web-XXXXX.onrender.com
WEB_BASE_URL=https://munlink-web-XXXXX.onrender.com
ADMIN_WEB_BASE_URL=https://munlink-admin-XXXXX.onrender.com
```

Then **redeploy the API service** for CORS to work correctly.

---

## Database Seeding

### Option 1: Via Render Shell (Browser)
1. Go to API service → Shell tab
2. Run seeding commands:
   ```bash
   cd apps/api
   python scripts/seed_data.py
   python scripts/create_admin.py
   ```

### Option 2: Via Render CLI (Local)
1. Install CLI:
   ```bash
   npm install -g @render/cli
   ```
2. Login and connect:
   ```bash
   render login
   render shell munlink-api
   ```
3. Run seeding:
   ```bash
   python scripts/seed_data.py
   python scripts/create_admin.py
   ```

---

## Architecture & Services

```
┌─────────────────────────────────────────────────────┐
│  Internet                                           │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ munlink-web  │    │munlink-admin │
│ (Static)     │    │ (Static)     │
│ Port: 443    │    │ Port: 443    │
└──────┬───────┘    └──────┬───────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  munlink-api    │
        │  (Python/Flask) │
        │  Port: 10000    │
        │  + Disk (20GB)  │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  munlink-db     │
        │  (PostgreSQL)   │
        └─────────────────┘
```

### Service Details

| Service | Type | Purpose | Storage |
|---------|------|---------|---------|
| `munlink-api` | Web Service | Flask API backend | Persistent Disk (20GB) |
| `munlink-web` | Static Site | Public website | None (static files) |
| `munlink-admin` | Static Site | Admin dashboard | None (static files) |
| `munlink-db` | PostgreSQL | Database | Render-managed |

---

## Security Checklist

- [x] `DEBUG=False` in production
- [x] Strong secrets for `SECRET_KEY`, `JWT_SECRET_KEY`, `ADMIN_SECRET_KEY`
- [x] CORS configured with exact origins (no wildcards)
- [x] HTTPS enforced (Render default)
- [x] Gmail App Password (no spaces)
- [x] Database credentials via internal URL
- [x] File uploads on persistent disk

---

## Monitoring & Maintenance

### Health Checks
- API: `https://munlink-api-XXXXX.onrender.com/health`
- Expected: 200 OK with `{"status":"healthy"}`

### Logs
- View in Render Dashboard → Service → Logs tab
- Filter by severity: Info, Warning, Error

### Disk Usage
- Monitor in Render Dashboard → Service → Disk tab
- Alerts available at 80%, 90%, 95% capacity

### Database Backups
- Render Postgres includes daily backups
- Manual backup via `pg_dump` if needed

---

## Troubleshooting

### API won't start
- Check logs for Python errors
- Verify `DATABASE_URL` is the **Internal** URL
- Ensure `psycopg2-binary` installed in build command
- Check migrations ran: `flask db upgrade`

### CORS errors
- Verify `WEB_URL` and `ADMIN_URL` match exact frontend URLs
- Check `VITE_API_URL` in static sites points to API
- Redeploy API after changing URL env vars

### Media/uploads 404
- Verify persistent disk mounted at `./uploads`
- Check `UPLOAD_FOLDER=uploads/zambales`
- Ensure files saved with correct relative paths

### Database connection errors
- Use **Internal Database URL** (not external)
- Check database is running (green status)
- Verify `DATABASE_URL` env var set

### Email not sending
- Check `SMTP_USERNAME` and `SMTP_PASSWORD` set
- Gmail App Password must have no spaces
- Test with a simple admin notification

### Migrations failing
- Check migration files in `apps/api/migrations/versions/`
- Run `flask db current` to see current version
- Manually run migrations via Render Shell if needed

---

## Cost Estimates (Render - Professional Plan)

### Current Configuration (Professional)
- PostgreSQL: $7/month (Starter - 256MB RAM, 1GB storage)
- Web Service (API): $25/month (Standard - no cold starts, 2GB RAM)
- Persistent Disk: $10/month (50GB for uploads)
- Static Sites: Free (always on)
- **Total**: ~$42/month

### Benefits vs Free Tier
- ✅ **No Cold Starts** - API always warm and responsive
- ✅ **4 Gunicorn Workers** - Better concurrency for multiple users
- ✅ **2GB RAM** - Handles PDF generation, Excel exports smoothly
- ✅ **50GB Uploads** - More room for documents, images, QR codes
- ✅ **Better DB Performance** - Faster queries, more connections
- ✅ **Priority Support** - Faster response from Render team

---

## Next Steps After Deployment

1. **Test all features**:
   - User registration (Gmail verification)
   - Admin login
   - Document requests
   - Marketplace listings
   - PDF generation
   - QR code verification

2. **Seed initial data**:
   - Municipalities and barangays
   - Document types
   - Issue categories
   - Admin accounts

3. **Configure custom domains** (optional):
   - Add custom domain in Render settings
   - Update DNS records
   - Update `WEB_URL`, `ADMIN_URL`, `BASE_URL` env vars

4. **Set up monitoring**:
   - Enable UptimeRobot or similar (free tier)
   - Configure Render notification webhooks
   - Monitor disk usage trends

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Flask Deployment**: https://flask.palletsprojects.com/en/latest/deploying/
- **Render Community**: https://community.render.com/

---

## Quick Reference

### Environment Variables Summary

```bash
# Core Flask
FLASK_ENV=production
DEBUG=False
FLASK_APP=app.py
APP_NAME=MunLink Zambales
SECRET_KEY=<strong-random-key>

# Database
DATABASE_URL=<render-internal-url>

# JWT & Auth
JWT_SECRET_KEY=<strong-random-key>
JWT_ACCESS_TOKEN_EXPIRES=86400
ADMIN_SECRET_KEY=<strong-random-key>

# URLs (update with actual Render URLs)
WEB_URL=https://munlink-web-XXXXX.onrender.com
ADMIN_URL=https://munlink-admin-XXXXX.onrender.com
BASE_URL=https://munlink-api-XXXXX.onrender.com
QR_BASE_URL=https://munlink-web-XXXXX.onrender.com/verify
VERIFICATION_BASE_URL=https://munlink-web-XXXXX.onrender.com
WEB_BASE_URL=https://munlink-web-XXXXX.onrender.com
ADMIN_WEB_BASE_URL=https://munlink-admin-XXXXX.onrender.com

# Uploads
UPLOAD_FOLDER=uploads/zambales
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=pdf,jpg,jpeg,png,doc,docx

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=munlink.egov@gmail.com
SMTP_PASSWORD=<gmail-app-password>
FROM_EMAIL=munlink.egov@gmail.com

# Security
CLAIM_CODE_ENC_KEY=<fernet-key>
CLAIM_JWT_SECRET=<separate-secret>
CLAIM_TOKEN_DAYS=14
```

### Build Commands

```bash
# API
pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir psycopg2-binary==2.9.9

# Web & Admin
npm ci && npm run build
```

### Start Command

```bash
# API
flask db upgrade && gunicorn app:app --bind 0.0.0.0:$PORT --workers 3 --timeout 120
```

---

**Last Updated**: October 29, 2024
**MunLink Zambales Version**: 1.0.0

