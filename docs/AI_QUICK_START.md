# 🤖 AI Quick Start - MunLink Zambales

> **READ THIS FIRST** before implementing ANYTHING. This is your 5-minute validation checklist.

---

## ✅ Pre-Implementation Validation Checklist

### 1. Core Project Facts (30 seconds)

```yaml
✓ Project: MunLink Zambales
✓ Type: Multi-tenant municipal governance platform
✓ Geography: Zambales Province ONLY (NO other provinces)
✓ Municipalities: EXACTLY 13 (no cities, no other provinces)
✓ Architecture: Monorepo with 3 separate apps
✓ Database: PostgreSQL (production) / SQLite (development)
✓ Frontend: React 18 + TypeScript + Vite + Tailwind CSS
✓ Backend: Flask + SQLAlchemy + JWT authentication
```

### 2. The 13 Municipalities (MEMORIZE THIS)

```python
# EXACTLY 13 municipalities - NO MORE, NO LESS
ZAMBALES_MUNICIPALITIES = [
    "Botolan",        # 1
    "Cabangan",       # 2
    "Candelaria",     # 3
    "Castillejos",    # 4
    "Iba",            # 5 - Provincial Capital
    "Masinloc",       # 6
    "Palauig",        # 7
    "San Antonio",    # 8
    "San Felipe",     # 9
    "San Marcelino",  # 10
    "San Narciso",    # 11
    "Santa Cruz",     # 12
    "Subic",          # 13
]

# ❌ NOT INCLUDED: Olongapo City (it's a city, not a municipality)
# ✅ COUNT CHECK: len(ZAMBALES_MUNICIPALITIES) == 13
```

### 3. Technology Stack - MANDATORY (NO ALTERNATIVES)

```yaml
Backend (apps/api):
  ✓ Flask 3.0+ (not Django, FastAPI, Express)
  ✓ SQLAlchemy 2.0+ (not Prisma, TypeORM, Mongoose)
  ✓ PostgreSQL 15+ (not MySQL, MongoDB, SQLite in prod)
  ✓ JWT with bcrypt (not session-based, not Passport)
  ✓ Python 3.10+ (not Node.js, not PHP)

Frontend (apps/web & apps/admin):
  ✓ React 18+ (not Vue, Angular, Svelte, Next.js)
  ✓ TypeScript 5+ (not plain JavaScript)
  ✓ Vite 5+ (not Webpack, CRA, Parcel)
  ✓ Tailwind CSS 3+ (not Bootstrap, Material-UI, Chakra)
  ✓ Node.js 18+ (for build tools)

Monorepo:
  ✓ Turborepo (not Lerna, Nx, Rush, pnpm workspaces)
  ✓ npm workspaces (not yarn, pnpm)

DO NOT suggest alternatives. These are FINAL.
```

### 4. Scope Boundaries

```diff
✅ IN SCOPE (IMPLEMENT THESE):
+ Zambales Province
+ 13 municipalities (complete list above)
+ Municipal-level services (NOT provincial)
+ Cross-municipal marketplace ONLY
+ Document request system
+ Issue reporting system
+ Benefits management
+ QR code validation
+ Two-tier user verification (email → admin ID)
+ Age-based access control (18+ for marketplace)

❌ OUT OF SCOPE (DO NOT ADD):
- Other provinces beyond Zambales
- Cities (Olongapo is excluded)
- Provincial-level administration
- National government integration
- Barangay-level features
- Payment processing (marketplace is free exchange)
- Real-time chat (use async messaging)
- Blockchain/AI/ML features
- Mobile native apps (web-responsive only)
- Social media features (only marketplace feed)
```

### 5. Critical Architecture Rules

```yaml
Data Isolation:
  - Each municipality's data is ISOLATED
  - Users belong to ONE municipality only
  - Document requests go to HOME municipality
  - Issues reported to HOME municipality
  - Benefits managed by HOME municipality

Cross-Municipal Sharing:
  - Marketplace items visible across ALL 13 municipalities
  - Users can transact across municipality boundaries
  - NO other cross-municipal features

Access Levels:
  - No email verification: No access
  - Email verified, under 18: Read-only marketplace
  - Email verified, 18+, not admin-verified: Basic marketplace
  - Email + admin verified, 18+: Full municipal services
```

---

## 🚨 Critical Anti-Patterns (WHAT NOT TO DO)

### ❌ Anti-Pattern 1: Adding Features Not in Specification

```python
# WRONG - Adding provincial administration
@app.route('/api/province/admin')
def province_admin():
    pass

# WRONG - Adding payment processing
@app.route('/api/marketplace/payment')
def process_payment():
    pass

# WRONG - Adding other provinces
@app.route('/api/provinces')  # Should be ONLY Zambales
def get_all_provinces():
    pass

# CORRECT - Stay within spec
@app.route('/api/municipalities')
def get_zambales_municipalities():
    # Returns ONLY the 13 Zambales municipalities
    pass
```

### ❌ Anti-Pattern 2: Using Alternative Technologies

```javascript
// WRONG - Vue instead of React
import { createApp } from 'vue'

// WRONG - Material-UI instead of Tailwind
import { Button } from '@mui/material'

// WRONG - Webpack config
module.exports = { /* webpack config */ }

// CORRECT - Use specified stack
import React from 'react'
import { defineConfig } from 'vite'
// Use Tailwind classes: className="bg-blue-500"
```

### ❌ Anti-Pattern 3: Hardcoding Municipality Data

```python
# WRONG - Hardcoded list
municipalities = ["Iba", "Botolan"]  # Incomplete!

# WRONG - Including cities
municipalities = ["Iba", "Olongapo", "Botolan"]  # Olongapo is a CITY

# CORRECT - Load from data source
def load_zambales_municipalities_from_json():
    """
    Load municipalities from philippines_full_locations.json
    Filter for:
    - province == 'Zambales'
    - level == 'municipality'
    - name in [list of 13 municipalities]
    """
    # Returns exactly 13 municipalities
    pass
```

### ❌ Anti-Pattern 4: Breaking Data Isolation

```python
# WRONG - Cross-municipal document access
@app.route('/api/documents/all')
def get_all_documents():
    # Returns documents from ALL municipalities
    pass

# CORRECT - Municipal isolation
@app.route('/api/documents/requests')
@require_auth
def get_user_documents():
    user = g.current_user
    # Returns ONLY documents from user's home municipality
    return DocumentRequest.query.filter_by(
        municipality_id=user.municipality_id,
        user_id=user.id
    ).all()
```

### ❌ Anti-Pattern 5: Incorrect Access Control

```python
# WRONG - No age verification for marketplace
@app.route('/api/marketplace/items', methods=['POST'])
@require_auth  # Not enough!
def create_item():
    pass

# CORRECT - Age + verification checks
@app.route('/api/marketplace/items', methods=['POST'])
@require_auth
@require_email_verified
@require_age(18)  # Must be 18+
def create_item():
    pass
```

---

## ✅ Implementation Validation Steps

### Step 1: Validate Conceptual Understanding (2 minutes)

```bash
# Ask yourself these questions:

1. How many municipalities? 
   ✓ Answer: EXACTLY 13

2. Is Olongapo included?
   ✓ Answer: NO (it's a city)

3. Can users from Iba access documents from Botolan?
   ✓ Answer: NO (municipal data isolation)

4. Can users from Iba see marketplace items from Botolan?
   ✓ Answer: YES (marketplace is cross-municipal)

5. What happens if user is under 18?
   ✓ Answer: Read-only marketplace, no services

6. What happens if email not verified?
   ✓ Answer: No access at all

7. Can we use Vue.js instead of React?
   ✓ Answer: NO (React is mandatory)

8. Can we add provincial-level features?
   ✓ Answer: NO (municipal level only)

9. How many apps in the monorepo?
   ✓ Answer: 3 (web, admin, api)

10. Is admin dashboard publicly accessible?
    ✓ Answer: NO (internal network only)
```

### Step 2: Validate Database Design (2 minutes)

```python
# Check database models have:

✓ Municipality model with exactly 13 records
✓ User model with municipality_id (foreign key)
✓ User model with email_verified (Tier 1)
✓ User model with is_verified (Tier 2)
✓ User model with date_of_birth (age verification)
✓ Item model with municipality_id (for attribution)
✓ Item model visible across municipalities (cross-municipal)
✓ DocumentRequest model with municipality_id (isolation)
✓ Issue model with municipality_id (isolation)
✓ Benefit model with municipality_id (isolation)
✓ QRCode model for document verification
✓ Transaction model for marketplace
✓ Message model for in-app communication
✓ ActivityLog model for audit trail
✓ Notification model for user alerts
```

### Step 3: Validate API Endpoints (2 minutes)

```yaml
# Essential endpoints that MUST exist:

Authentication:
  ✓ POST /api/auth/register
  ✓ POST /api/auth/verify-email
  ✓ POST /api/auth/login
  ✓ POST /api/users/profile/government-id

Municipalities:
  ✓ GET /api/municipalities (returns 13)
  ✓ GET /api/municipalities/<id>

Marketplace (cross-municipal):
  ✓ GET /api/marketplace/items (all municipalities)
  ✓ POST /api/marketplace/items
  ✓ POST /api/marketplace/transactions

Documents (municipal-isolated):
  ✓ POST /api/documents/requests (home municipality only)
  ✓ GET /api/documents/requests (own requests only)

Benefits (municipal-isolated):
  ✓ GET /api/benefits/programs/<municipality_id>
  ✓ POST /api/benefits/applications

Issues (municipal-isolated):
  ✓ POST /api/issues/submit (home municipality)
  ✓ GET /api/issues/municipality/<id>

QR Validation:
  ✓ POST /api/qr/validate
  ✓ GET /api/qr/<token>

Admin (internal only):
  ✓ POST /api/admin/create-admin (with secret key)
  ✓ PUT /api/users/admin/<user_id>/verify-id
```

### Step 4: Validate Access Control Logic (1 minute)

```python
# Access control must implement:

✓ JWT token validation on protected routes
✓ Email verification check for basic access
✓ Admin ID verification check for full services
✓ Age verification (18+) for marketplace actions
✓ Municipality ownership check for isolated data
✓ Admin role check for admin endpoints
✓ No hardcoded credentials (use environment variables)
✓ Password hashing with bcrypt
✓ Token blacklisting on logout
```

---

## 📊 Quick Reference Numbers

```yaml
Total Municipalities: 13
Province: Zambales (ONLY)
Capital: Iba
Database Tables: ~15 core tables
API Endpoints: ~50 endpoints
User Roles: 2 (resident, admin)
Access Tiers: 4 (none, read-only, basic, full)
File Upload Limit: 10MB
Max Photos Per Item: 5
Document Types: ~22 types
QR Code Expiry: 30 days (digital documents)
Age Requirement: 18+ for marketplace transactions
Email Verification: Required for any access
Admin Verification: Required for municipal services
```

---

## 🎯 Asset Files Handling

When building the monorepo, you'll need these asset files:

### Location Data
- **Source**: `philippines_full_locations.json`
- **Location**: Project root or data directory
- **Usage**: Seed database with 13 Zambales municipalities
- **Filter**: `province == 'Zambales' AND level == 'municipality'`
- **Expected Count**: 13 municipalities

### Municipal Logos
- **Source**: Logo directories for each municipality
- **Usage**: Document generation, UI branding
- **Requirement**: Each municipality needs seal/logo file
- **Format**: PNG preferred, various sizes available

### UI Assets
- **Hero Images**: For landing page backgrounds
- **Municipal Trademarks**: Landmark photos for each municipality
- **Usage**: Branding and visual identity

### How to Reference Assets in Code

```python
# apps/api/utils/assets.py
from pathlib import Path
import os

# Get project root (2 levels up from this file)
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent

# Asset directories
LOCATION_DATA_FILE = PROJECT_ROOT / "philippines_full_locations.json"
LOGO_BASE_DIR = PROJECT_ROOT / "municipal_logos"
UI_ASSETS_DIR = PROJECT_ROOT / "ui_assets"

# Function to load location data
def load_municipalities():
    """Load 13 Zambales municipalities from JSON"""
    import json
    
    if not LOCATION_DATA_FILE.exists():
        raise FileNotFoundError(
            f"Location data file not found: {LOCATION_DATA_FILE}\n"
            "Please ensure philippines_full_locations.json is in project root."
        )
    
    with open(LOCATION_DATA_FILE) as f:
        data = json.load(f)
    
    # Filter for Zambales municipalities
    municipalities = [
        item for item in data
        if item.get('province') == 'Zambales'
        and item.get('level') == 'municipality'
        and item.get('name') in [
            'Botolan', 'Cabangan', 'Candelaria', 'Castillejos',
            'Iba', 'Masinloc', 'Palauig', 'San Antonio',
            'San Felipe', 'San Marcelino', 'San Narciso',
            'Santa Cruz', 'Subic'
        ]
    ]
    
    # Validate count
    if len(municipalities) != 13:
        raise ValueError(
            f"Expected 13 municipalities, found {len(municipalities)}. "
            "Check data file."
        )
    
    return municipalities

# Function to get municipality logo
def get_municipality_logo(municipality_name: str) -> Path:
    """Get logo file path for municipality"""
    logo_path = LOGO_BASE_DIR / municipality_name / "seal.png"
    
    if not logo_path.exists():
        # Fallback or raise error
        raise FileNotFoundError(f"Logo not found for {municipality_name}")
    
    return logo_path
```

---

## 🔗 Where to Find Detailed Information

| Topic | Section | File |
|-------|---------|------|
| Complete specification | All sections | munlink_guide_v2.md |
| Municipality list | Section 1 | munlink_guide_v2.md |
| Technology stack | Section 5 | munlink_guide_v2.md |
| File structure | Section 6 | munlink_guide_v2.md |
| Database models | Section 7 | munlink_guide_v2.md |
| User authentication | Section 9 | munlink_guide_v2.md |
| API endpoints | Section 15 | munlink_guide_v2.md |
| Deployment guide | Section 25 | munlink_guide_v2.md |
| All changes | - | GUIDE_IMPROVEMENTS.md |

---

## ⚡ Final Validation Before Starting

Run this mental checklist:

```yaml
✓ I understand there are EXACTLY 13 municipalities
✓ I know Olongapo is NOT included (it's a city)
✓ I will use React + Flask + PostgreSQL (no alternatives)
✓ I will implement municipal data isolation
✓ I will implement cross-municipal marketplace ONLY
✓ I will implement two-tier verification (email + admin)
✓ I will implement age-based access (18+)
✓ I will NOT add provincial-level features
✓ I will NOT add payment processing
✓ I will NOT add features not in the specification
✓ I will reference munlink_guide_v2.md for all details
```

---

## 🚀 Ready to Start?

If you answered YES to all items in the final validation:

1. **Read munlink_guide_v2.md** - Full specification
2. **Start with Section 1 (Quick Reference)** - Key facts
3. **Review Section 6 (File Structure)** - Monorepo layout
4. **Review Section 7 (Database)** - Data models
5. **Review Section 15 (API)** - Endpoint specifications
6. **Follow Section 24-25 (Deployment)** - Setup guides

If ANY item is unclear, **STOP** and clarify with the full guide before proceeding.

---

**Status**: Ready for implementation ✅  
**Guide Version**: 2.0  
**Last Updated**: 2025-10-13

**Remember**: When in doubt, check munlink_guide_v2.md - it's the single source of truth!
