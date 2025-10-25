# MunLink Zambales: AI Development Guide v2.0
## Municipal Digital Governance Platform - Complete Specification

> **VERSION**: 2.0 | **LAST UPDATED**: 2025-10-13  
> **AI INSTRUCTION**: This is the SINGLE SOURCE OF TRUTH. Read this ENTIRE document before starting.

---

## 📑 TABLE OF CONTENTS

### Part 1: Project Overview & Constraints
1. [Quick Reference](#1-quick-reference) - Start here for key facts
2. [Executive Summary](#2-executive-summary)
3. [Scope & Boundaries](#3-scope-and-boundaries)
4. [Geographic Coverage](#4-geographic-coverage)

### Part 2: Technical Foundation
5. [Technology Stack](#5-technology-stack-mandatory)
6. [File Structure](#6-file-structure-actual-paths)
7. [Database Architecture](#7-database-architecture)
8. [Multi-Tenant Design](#8-multi-tenant-architecture)

### Part 3: Core Features
9. [User Authentication & Verification](#9-user-authentication-verification)
10. [Marketplace System](#10-marketplace-system)
11. [Document Services](#11-document-services)
12. [Issue Reporting](#12-issue-reporting)
13. [Benefits Management](#13-benefits-management)
14. [QR Code System](#14-qr-code-system)

### Part 4: API Specifications
15. [API Endpoints](#15-api-endpoints-complete-reference)
16. [Error Handling](#16-error-handling)
17. [Data Validation](#17-data-validation)

### Part 5: User Interface
18. [Frontend Architecture](#18-frontend-architecture)
19. [UI Components](#19-ui-components)
20. [Responsive Design](#20-responsive-design)

### Part 6: Security & Permissions
21. [User Roles](#21-user-roles-permissions)
22. [Admin Account Management](#22-admin-account-management)
23. [Security Implementation](#23-security-implementation)

### Part 7: Deployment & Operations
24. [Development Setup](#24-development-setup)
25. [Production Deployment](#25-production-deployment)
26. [Monitoring & Maintenance](#26-monitoring-maintenance)

### Part 8: Scaling & Best Practices
27. [Scalability Guidelines](#27-scalability-guidelines)
28. [Performance Optimization](#28-performance-optimization)
29. [Data Migration](#29-data-migration)

---

## 1. QUICK REFERENCE

> **AI CHECKPOINT**: Verify these facts before proceeding with ANY implementation.

### Critical Project Facts

```yaml
Project Name: MunLink Zambales
Type: Multi-tenant municipal governance platform
Geographic Scope: Zambales Province ONLY (13 municipalities, NO cities)
Architecture: Monorepo with 3 apps (web, admin, api)
Database: PostgreSQL (production) / SQLite (dev)
Frontend: React 18 + TypeScript + Vite + Tailwind
Backend: Flask + SQLAlchemy + JWT
```

### ACTUAL File Paths (USE THESE, NOT OTHERS)

```yaml
Location Data: "locations_reference/philippines_full_locations.json"
Municipal Logos: "munlink_municipals_logo/{municipality_name}/"
Province Logo: "zambales_logo/"
Hero Image: "ui_reference/Nature.jpg"
Admin Emails: "admins_gmails.txt"
Municipality Photos: "municipalities_trademark/{municipality}_*.png"
```

### The 13 Zambales Municipalities (EXACT LIST)

```python
ZAMBALES_MUNICIPALITIES = [
    "Botolan",      # 1
    "Cabangan",     # 2
    "Candelaria",   # 3
    "Castillejos",  # 4
    "Iba",          # 5 (Capital)
    "Masinloc",     # 6
    "Palauig",      # 7
    "San Antonio",  # 8
    "San Felipe",   # 9
    "San Marcelino",# 10
    "San Narciso",  # 11
    "Santa Cruz",   # 12
    "Subic"         # 13
]
```

### What NOT to Do (AI Anti-Patterns)

```diff
- ❌ DO NOT add provinces other than Zambales
- ❌ DO NOT add cities (Olongapo is a city, NOT included)
- ❌ DO NOT use hardcoded location data (use JSON file)
- ❌ DO NOT reference "data/PH_LOC.json" (wrong path)
- ❌ DO NOT reference "Municipality Logo/" (wrong path)
- ❌ DO NOT create provincial-level admin features
- ❌ DO NOT add features not in this specification
- ❌ DO NOT use different technologies than specified
```

### Key Design Principles

1. **Municipal Independence**: Each municipality operates independently
2. **Cross-Municipal Sharing**: Marketplace is shared across all 13
3. **Data Isolation**: User data belongs to home municipality only
4. **Two-Tier Verification**: Email verification → Admin ID verification
5. **Age-Based Access**: Under 18 = read-only marketplace
6. **Internal Admin Dashboard**: NOT publicly accessible

---

## 2. EXECUTIVE SUMMARY

MunLink Zambales is a **multi-tenant digital governance platform** designed exclusively for the **13 municipalities** of Zambales Province, Philippines. It provides:

- **Unified Digital Infrastructure**: Municipal government services digitized
- **Cross-Municipal Marketplace**: Residents share/donate/sell items across municipalities
- **Document Management**: Request and receive official municipal documents
- **Issue Reporting**: Report infrastructure and community issues
- **Benefits Management**: Apply for municipal assistance programs
- **QR Verification**: Validate official documents with QR codes

### Target Users
- **Residents** (18+): Full access to all features
- **Residents** (<18): Read-only marketplace access
- **Municipal Admins**: Manage their municipality's operations
- **System Admins**: Technical administration (CLI/internal only)

### Core Value Proposition
- **For Residents**: One platform for all municipal services
- **For Government**: Streamlined service delivery and communication
- **For Community**: Cross-municipal resource sharing and collaboration

---

## 3. SCOPE AND BOUNDARIES

### ✅ IN SCOPE

**Geographic Coverage**
- Zambales Province ONLY
- 13 municipalities (complete list in Quick Reference)
- Municipality-level services and administration
- Cross-municipal marketplace functionality

**Core Features**
- User registration with two-tier verification
- Marketplace (donate, lend, sell items)
- Document request and generation
- Issue reporting and tracking
- Benefits application and management
- QR code generation and validation
- Municipal announcements
- Activity logging and notifications

**Technical Scope**
- Monorepo architecture (apps/web, apps/admin, apps/api)
- PostgreSQL database with complete data isolation
- React frontend with TypeScript
- Flask backend with RESTful API
- JWT authentication
- File upload management
- Email notifications

### ❌ OUT OF SCOPE (DO NOT IMPLEMENT)

**Geographic Exclusions**
- Other provinces beyond Zambales
- National-level government integration
- Cities (e.g., Olongapo City is NOT included)
- Barangay-level administration (only municipality level)

**Feature Exclusions**
- Provincial-level administration
- Inter-province data sharing
- Payment processing (marketplace is free exchange only)
- Real-time chat (use async messaging only)
- Mobile apps (responsive web only)
- Social media features beyond marketplace

**Technical Exclusions**
- Alternative frameworks (no Vue, Angular, Django, etc.)
- Blockchain integration
- AI/ML features
- Third-party service integrations (except email)

### 🔒 CRITICAL CONSTRAINTS

1. **Data Source**: Location data MUST come from `locations_reference/philippines_full_locations.json`
2. **Municipality Count**: EXACTLY 13, no more, no less
3. **No Mock Data**: All data from actual files or database
4. **Logo Sources**: Use actual logo files from `munlink_municipals_logo/`
5. **Admin Access**: Internal network only (NOT public internet)

---

## 4. GEOGRAPHIC COVERAGE

### Data Source Configuration

```python
# tools/scripts/load_location_data.py
import json
from pathlib import Path

def load_zambales_data():
    """
    Load Zambales municipalities from official location data.
    
    Returns:
        list: 13 municipalities with PSGC codes and details
    """
    # ACTUAL file path
    location_file = Path("locations_reference/philippines_full_locations.json")
    
    if not location_file.exists():
        raise FileNotFoundError(
            f"Location data not found: {location_file}\n"
            "This file is REQUIRED for the system to function."
        )
    
    with open(location_file, 'r', encoding='utf-8') as f:
        ph_data = json.load(f)
    
    # Filter for Zambales province
    zambales_data = [
        item for item in ph_data 
        if item.get('province') == 'Zambales' 
        and item.get('level') == 'municipality'
    ]
    
    # Expected municipalities
    expected_names = [
        'Botolan', 'Cabangan', 'Candelaria', 'Castillejos', 'Iba',
        'Masinloc', 'Palauig', 'San Antonio', 'San Felipe',
        'San Marcelino', 'San Narciso', 'Santa Cruz', 'Subic'
    ]
    
    municipalities = [
        item for item in zambales_data 
        if item.get('name') in expected_names
    ]
    
    # Validation
    if len(municipalities) != 13:
        raise ValueError(
            f"Expected 13 municipalities, found {len(municipalities)}. "
            f"Check location data file."
        )
    
    return municipalities

# Validate on import
ZAMBALES_MUNICIPALITIES = load_zambales_data()
```

### Municipality Logo Mapping

```python
# utils/logo_paths.py
from pathlib import Path

# Base paths (ACTUAL structure)
LOGO_BASE = Path("munlink_municipals_logo")
PROVINCE_LOGO_BASE = Path("zambales_logo")

# Municipality logo paths
MUNICIPALITY_LOGOS = {
    "Botolan": {
        "seal": LOGO_BASE / "Botolan" / "Ph_seal_zambales_botolan.png",
        "flag": LOGO_BASE / "Botolan" / "Flag_of_Botolan,_Zambales.png",
        "sizes": {
            "960px": LOGO_BASE / "Botolan" / "960px-Flag_of_Botolan,_Zambales.png",
            "1080px": LOGO_BASE / "Botolan" / "1080px-Flag_of_Botolan,_Zambales.png",
        }
    },
    "Cabangan": {
        "seal": LOGO_BASE / "Cabangan" / "Cabangan_Zambales_seal.png",
        "flag": LOGO_BASE / "Cabangan" / "Flag_of_Cabangan_Zambales.jpg",
        "sizes": {
            "32px": LOGO_BASE / "Cabangan" / "Cabangan_Zambales_seal 32px.png",
            "64px": LOGO_BASE / "Cabangan" / "Cabangan_Zambales_ seal 64px.png",
            "128px": LOGO_BASE / "Cabangan" / "Cabangan_Zambales_seal 128px.png",
            "256px": LOGO_BASE / "Cabangan" / "Cabangan_Zambales_seal 256px.png",
            "512px": LOGO_BASE / "Cabangan" / "Cabangan_Zambales_seal 512px.png",
        }
    },
    "Candelaria": {
        "seal": LOGO_BASE / "Candelaria" / "Candelaria_Zambales_Seal.png",
        "flag": LOGO_BASE / "Candelaria" / "Flag_of_Candelaria,_Zambales.png",
        "sizes": {
            "500px": LOGO_BASE / "Candelaria" / "500px-Candelaria_Zambales_Seal.png",
            "960px": LOGO_BASE / "Candelaria" / "960px-Candelaria_Zambales_Seal.png",
            "1080px": LOGO_BASE / "Candelaria" / "1080px-Candelaria_Zambales_Seal.png",
        }
    },
    "Castillejos": {
        "seal": LOGO_BASE / "Castillejos" / "Castillejos_Zambales_seal.png",
        "flag": LOGO_BASE / "Castillejos" / "Flag_of_Castillejos,_Zambales.png",
        "sizes": {
            "960px": LOGO_BASE / "Castillejos" / "960px-Flag_of_Castillejos,_Zambales.png",
            "1280px": LOGO_BASE / "Castillejos" / "1280px-Flag_of_Castillejos,_Zambales.png",
        }
    },
    "Iba": {
        "seal": LOGO_BASE / "Iba" / "Iba_Zambales_seal.png",
        "flag": LOGO_BASE / "Iba" / "Flag_of_Iba,_Zambales.png",
        "sizes": {
            "960px": LOGO_BASE / "Iba" / "960px-Flag_of_Iba,_Zambales.png",
        }
    },
    "Masinloc": {
        "seal": LOGO_BASE / "Masinloc" / "Masinloc_Zambales_seal.png",
        "flag": LOGO_BASE / "Masinloc" / "Flag_of_Masinloc,_Zambales.png",
        "sizes": {
            "960px": LOGO_BASE / "Masinloc" / "960px-Flag_of_Masinloc,_Zambales.png",
        }
    },
    "Palauig": {
        "seal": LOGO_BASE / "Palauig" / "Palauig_Zambales_seal.png",
        "flag": LOGO_BASE / "Palauig" / "Flag_of_Palauig_Zambales.png",
        "sizes": {
            "960px": LOGO_BASE / "Palauig" / "960px-Flag_of_Palauig_Zambales.png",
            "1279px": LOGO_BASE / "Palauig" / "1279px-Flag_of_Palauig_Zambales.png",
        }
    },
    "San Antonio": {
        "seal": LOGO_BASE / "SanAntonio" / "SanAntonio,102Zambalesjf.png",
    },
    "San Felipe": {
        "seal": LOGO_BASE / "San Felipe" / "Seal San Felipe.png",
        "sizes": {
            "32px": LOGO_BASE / "San Felipe" / "Seal San Felipe 32px.png",
            "64px": LOGO_BASE / "San Felipe" / "Seal San Felipe 64px.png",
            "92px": LOGO_BASE / "San Felipe" / "Seal San Felipe 92px.png",
            "128px": LOGO_BASE / "San Felipe" / "Seal San Felipe 128px.png",
            "256px": LOGO_BASE / "San Felipe" / "Seal San Felipe 256px.png",
        }
    },
    "San Marcelino": {
        "seal": LOGO_BASE / "San Marcelino" / "smz-logo-512px.png",
        "flag": LOGO_BASE / "San Marcelino" / "san-marcelino_flag.png",
        "sizes": {
            "32px": LOGO_BASE / "San Marcelino" / "smz-logo-32px.png",
            "64px": LOGO_BASE / "San Marcelino" / "smz-logo-64px.png",
            "128px": LOGO_BASE / "San Marcelino" / "smz-logo-128px.png",
            "256px": LOGO_BASE / "San Marcelino" / "smz-logo-256px.png",
            "500px": LOGO_BASE / "San Marcelino" / "smz-logo-500px.png",
            "512px": LOGO_BASE / "San Marcelino" / "smz-logo-512px.png",
        }
    },
    "San Narciso": {
        "seal": LOGO_BASE / "San Narciso" / "san-narciso-seal 512px.png",
        "flag": LOGO_BASE / "San Narciso" / "Flag_of_San_Narciso,_Zambales.png",
        "sizes": {
            "32px": LOGO_BASE / "San Narciso" / "san-narciso-seal 32px.png",
            "64px": LOGO_BASE / "San Narciso" / "san-narciso-seal 64px.png",
            "128px": LOGO_BASE / "San Narciso" / "san-narciso-seal 128px1.png",
            "256px": LOGO_BASE / "San Narciso" / "san-narciso-seal 256px.png",
            "960px": LOGO_BASE / "San Narciso" / "960px-Flag_of_San_Narciso,_Zambales.png",
        }
    },
    "Santa Cruz": {
        "seal": LOGO_BASE / "Santa-Cruz" / "Santa_Cruz_Zambales.png",
    },
    "Subic": {
        "seal": LOGO_BASE / "Subic" / "subic seal 512px.png",
        "flag": LOGO_BASE / "Subic" / "Subic Flag.png",
        "logo": LOGO_BASE / "Subic" / "subic logo.png",
        "sizes": {
            "32px": LOGO_BASE / "Subic" / "subic seal 32px.png",
            "64px": LOGO_BASE / "Subic" / "subic seal 64px.png",
            "128px": LOGO_BASE / "Subic" / "subic seal 128px.png",
            "256px": LOGO_BASE / "Subic" / "subic seal 256px.png",
            "516px": LOGO_BASE / "Subic" / "subic seal 516px.png",
            "960px": LOGO_BASE / "Subic" / "subic seal 960px.png",
        }
    },
}

# Province logo
ZAMBALES_PROVINCE_LOGO = {
    "svg": PROVINCE_LOGO_BASE / "Seal_of_Province_of_Zambales.svg",
    "32px": PROVINCE_LOGO_BASE / "32px-Seal_of_Province_of_Zambales.svg.png",
    "64px": PROVINCE_LOGO_BASE / "64px-Seal_of_Province_of_Zambales.svg.png",
    "128px": PROVINCE_LOGO_BASE / "128px-Seal_of_Province_of_Zambales.svg.png",
    "256px": PROVINCE_LOGO_BASE / "256px-Seal_of_Province_of_Zambales.svg.png",
    "512px": PROVINCE_LOGO_BASE / "512px-Seal_of_Province_of_Zambales.svg.png",
}

def get_municipality_seal(municipality_name: str, size: str = "256px") -> Path:
    """
    Get the seal/logo path for a municipality.
    
    Args:
        municipality_name: Name of municipality (exact match required)
        size: Preferred size (e.g., "256px", "512px")
        
    Returns:
        Path to the seal file
        
    Raises:
        ValueError: If municipality not found or file doesn't exist
    """
    if municipality_name not in MUNICIPALITY_LOGOS:
        raise ValueError(
            f"Municipality '{municipality_name}' not found. "
            f"Valid municipalities: {list(MUNICIPALITY_LOGOS.keys())}"
        )
    
    logos = MUNICIPALITY_LOGOS[municipality_name]
    
    # Try to get specific size
    if "sizes" in logos and size in logos["sizes"]:
        seal_path = logos["sizes"][size]
    else:
        # Fallback to default seal
        seal_path = logos["seal"]
    
    if not seal_path.exists():
        raise FileNotFoundError(
            f"Seal file not found: {seal_path}\n"
            f"Please ensure logo files are in correct location."
        )
    
    return seal_path
```

### Municipality Trademark Photos

```python
# utils/trademark_photos.py
from pathlib import Path

TRADEMARK_BASE = Path("municipalities_trademark")

MUNICIPALITY_TRADEMARKS = {
    "Botolan": TRADEMARK_BASE / "botolan_mt_pinatubo.png",
    "Cabangan": TRADEMARK_BASE / "cabangan_municipal.png",
    "Candelaria": TRADEMARK_BASE / "candelaria_municipal.png",
    "Castillejos": TRADEMARK_BASE / "Castillejos_Ramon_Magsaysay_Ancestral_House,_Castillejos.jpg",
    "Iba": TRADEMARK_BASE / "iba_municipal.png",
    "Masinloc": TRADEMARK_BASE / "masinloc_church.png",
    "Palauig": TRADEMARK_BASE / "palauig_municipal.png",
    "San Antonio": TRADEMARK_BASE / "san_antonio_municipal.png",
    "San Felipe": TRADEMARK_BASE / "san_felipe_arko.png",
    "San Marcelino": TRADEMARK_BASE / "san_marcelino_municipal.png",
    "San Narciso": TRADEMARK_BASE / "san_narciso_municipal.png",
    "Santa Cruz": TRADEMARK_BASE / "Santa_Cruz_Municipal.png",
    "Subic": TRADEMARK_BASE / "subic_municipality.png",
}

def get_municipality_trademark(municipality_name: str) -> Path:
    """Get trademark photo for municipality homepage/branding"""
    if municipality_name not in MUNICIPALITY_TRADEMARKS:
        raise ValueError(f"Unknown municipality: {municipality_name}")
    
    photo_path = MUNICIPALITY_TRADEMARKS[municipality_name]
    
    if not photo_path.exists():
        raise FileNotFoundError(f"Trademark photo not found: {photo_path}")
    
    return photo_path
```

---

## 5. TECHNOLOGY STACK (MANDATORY)

> **AI WARNING**: Do NOT suggest alternative technologies. These choices are final.

### Backend Stack

```yaml
Framework: Flask 3.0+
ORM: SQLAlchemy 2.0+
Database:
  Production: PostgreSQL 15+
  Development: SQLite 3
  
Authentication: JWT (PyJWT)
Password Hashing: bcrypt
API Style: RESTful with Flask-RESTful
File Uploads: Werkzeug secure_filename
PDF Generation: ReportLab
QR Codes: qrcode library
Email: smtplib (Gmail SMTP)

Python Version: 3.10+
```

**Why Flask?**
- Lightweight and flexible
- Government IT staff familiar with Python
- Easy to maintain and debug
- Excellent SQLAlchemy integration
- Perfect for municipal-scale applications

### Frontend Stack (Both Apps)

```yaml
Framework: React 18+
Language: TypeScript 5+
Build Tool: Vite 5+
Styling: Tailwind CSS 3+
Routing: React Router 6+
HTTP Client: Axios
Form Handling: React Hook Form
State Management: React Context API + useReducer

Node Version: 18+
```

**Why React + TypeScript?**
- Type safety prevents runtime errors
- Large ecosystem and community support
- Vite provides instant hot reload
- Tailwind CSS enables rapid UI development
- Easy to find developers for maintenance

### Monorepo Structure

```yaml
Tool: Turborepo
Package Manager: npm
Workspaces: 
  - apps/web (public website)
  - apps/admin (internal dashboard)
  - apps/api (Flask backend)
  - packages/ui (shared components)
  - packages/types (shared TypeScript types)
  - packages/utils (shared utilities)
```

**Why Monorepo?**
- Code sharing between web and admin apps
- Single source of truth for types
- Unified deployment pipeline
- Easier dependency management
- Better developer experience

### Infrastructure

```yaml
Containerization: Docker + Docker Compose
Web Server: Nginx (reverse proxy)
WSGI Server: Gunicorn (production)
Database Migrations: Flask-Migrate (Alembic)
CI/CD: GitHub Actions
Hosting: Render.com (recommended)
```

---

## 6. FILE STRUCTURE (ACTUAL PATHS)

> **CRITICAL**: Use these EXACT paths. Do not create alternative structures.

### Complete Project Structure

```
munlink-zambales/                                   # Root monorepo
│
├── 📁 locations_reference/                        # Location data (ACTUAL PATH)
│   ├── philippines_full_locations.json            # ✅ USE THIS, not data/PH_LOC.json
│   └── zambales_municipalities.json               # Filtered Zambales data (optional)
│
├── 📁 munlink_municipals_logo/                    # Municipal logos (ACTUAL PATH)
│   ├── Botolan/
│   │   ├── Ph_seal_zambales_botolan.png          # Official seal
│   │   ├── Flag_of_Botolan,_Zambales.png
│   │   ├── 960px-Flag_of_Botolan,_Zambales.png
│   │   └── 1080px-Flag_of_Botolan,_Zambales.png
│   ├── Cabangan/
│   │   ├── Cabangan_Zambales_seal.png            # Official seal
│   │   ├── Cabangan_Zambales_seal 32px.png
│   │   ├── Cabangan_Zambales_seal 64px.png
│   │   ├── Cabangan_Zambales_seal 128px.png
│   │   ├── Cabangan_Zambales_seal 256px.png
│   │   ├── Cabangan_Zambales_seal 512px.png
│   │   └── Flag_of_Cabangan_Zambales.jpg
│   ├── [... 11 more municipality folders]
│   └── README.md (usage instructions)
│
├── 📁 zambales_logo/                              # Province logo (ACTUAL PATH)
│   ├── Seal_of_Province_of_Zambales.svg
│   ├── 32px-Seal_of_Province_of_Zambales.svg.png
│   ├── 64px-Seal_of_Province_of_Zambales.svg.png
│   ├── 128px-Seal_of_Province_of_Zambales.svg.png
│   ├── 256px-Seal_of_Province_of_Zambales.svg.png
│   └── 512px-Seal_of_Province_of_Zambales.svg.png
│
├── 📁 municipalities_trademark/                   # Municipality landmark photos
│   ├── botolan_mt_pinatubo.png
│   ├── cabangan_municipal.png
│   ├── [... 11 more landmark photos]
│   └── README.md
│
├── 📁 ui_reference/                               # UI design assets
│   ├── Nature.jpg                                 # Hero section background
│   └── Reference.jpg                              # Design reference
│
├── 📄 admins_gmails.txt                           # Admin email list
├── 📄 PSGC-July-2025-Publication-Datafile.xlsx    # Reference data
│
├── 📁 apps/                                       # Monorepo applications
│   ├── 📁 api/                                    # Backend (Flask)
│   │   ├── app.py                                 # Main application entry
│   │   ├── config.py                              # Configuration settings
│   │   ├── requirements.txt                       # Python dependencies
│   │   │
│   │   ├── 📁 models/                             # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py                            # User & ResidentProfile
│   │   │   ├── municipality.py                    # Municipality model
│   │   │   ├── marketplace.py                     # Item, Transaction, Message
│   │   │   ├── document.py                        # DocumentType, DocumentRequest
│   │   │   ├── benefit.py                         # Benefit, BenefitApplication
│   │   │   ├── issue.py                           # Issue model
│   │   │   ├── qr_code.py                         # QRCode, QRValidation
│   │   │   ├── announcement.py                    # Announcement model
│   │   │   ├── activity_log.py                    # ActivityLog model
│   │   │   └── notification.py                    # Notification model
│   │   │
│   │   ├── 📁 routes/                             # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                            # /api/auth/*
│   │   │   ├── users.py                           # /api/users/*
│   │   │   ├── municipalities.py                  # /api/municipalities/*
│   │   │   ├── marketplace.py                     # /api/marketplace/*
│   │   │   ├── documents.py                       # /api/documents/*
│   │   │   ├── benefits.py                        # /api/benefits/*
│   │   │   ├── issues.py                          # /api/issues/*
│   │   │   ├── qr.py                              # /api/qr/*
│   │   │   ├── announcements.py                   # /api/announcements/*
│   │   │   ├── notifications.py                   # /api/notifications/*
│   │   │   ├── files.py                           # /api/files/*
│   │   │   └── admin.py                           # /api/admin/* (internal)
│   │   │
│   │   ├── 📁 utils/                              # Utility functions
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                            # JWT handling, decorators
│   │   │   ├── validators.py                      # Input validation
│   │   │   ├── file_handler.py                    # File upload/download
│   │   │   ├── qr_generator.py                    # QR code generation
│   │   │   ├── pdf_generator.py                   # PDF document generation
│   │   │   ├── email_sender.py                    # Email notifications
│   │   │   ├── logo_loader.py                     # Load municipal logos
│   │   │   └── location_loader.py                 # Load location data
│   │   │
│   │   ├── 📁 migrations/                         # Database migrations (Alembic)
│   │   │   ├── versions/
│   │   │   └── alembic.ini
│   │   │
│   │   ├── 📁 tests/                              # API tests
│   │   │   ├── test_auth.py
│   │   │   ├── test_marketplace.py
│   │   │   ├── test_documents.py
│   │   │   └── [... more test files]
│   │   │
│   │   ├── Dockerfile                             # Docker configuration
│   │   └── .env.example                           # Environment template
│   │
│   ├── 📁 web/                                    # Public website (React)
│   │   ├── src/
│   │   │   ├── main.tsx                           # App entry point
│   │   │   ├── App.tsx                            # Root component
│   │   │   │
│   │   │   ├── 📁 pages/                          # Page components
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── VerifyEmail.tsx
│   │   │   │   ├── Marketplace.tsx
│   │   │   │   ├── MarketplaceItem.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   ├── Documents.tsx
│   │   │   │   ├── Benefits.tsx
│   │   │   │   ├── Issues.tsx
│   │   │   │   ├── Municipalities.tsx
│   │   │   │   └── NotFound.tsx
│   │   │   │
│   │   │   ├── 📁 components/                     # Reusable components
│   │   │   │   ├── common/                        # Generic UI
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   ├── Navbar.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   └── Loading.tsx
│   │   │   │   ├── marketplace/
│   │   │   │   │   ├── ItemCard.tsx
│   │   │   │   │   ├── ItemGallery.tsx
│   │   │   │   │   ├── ItemFilters.tsx
│   │   │   │   │   ├── ItemForm.tsx
│   │   │   │   │   └── TransactionFlow.tsx
│   │   │   │   ├── documents/
│   │   │   │   │   ├── DocumentTypeCard.tsx
│   │   │   │   │   ├── DocumentRequestForm.tsx
│   │   │   │   │   └── DocumentStatusTracker.tsx
│   │   │   │   ├── issues/
│   │   │   │   │   ├── IssueForm.tsx
│   │   │   │   │   └── IssueCard.tsx
│   │   │   │   └── benefits/
│   │   │   │       ├── BenefitCard.tsx
│   │   │   │       └── ApplicationForm.tsx
│   │   │   │
│   │   │   ├── 📁 hooks/                          # Custom React hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useApi.ts
│   │   │   │   ├── useFileUpload.ts
│   │   │   │   └── useMunicipality.ts
│   │   │   │
│   │   │   ├── 📁 services/                       # API service layer
│   │   │   │   ├── api.ts                         # Axios configuration
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── marketplace.service.ts
│   │   │   │   ├── document.service.ts
│   │   │   │   ├── benefit.service.ts
│   │   │   │   └── issue.service.ts
│   │   │   │
│   │   │   ├── 📁 context/                        # React Context
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   ├── MunicipalityContext.tsx
│   │   │   │   └── NotificationContext.tsx
│   │   │   │
│   │   │   ├── 📁 types/                          # TypeScript types
│   │   │   │   ├── user.ts
│   │   │   │   ├── marketplace.ts
│   │   │   │   ├── document.ts
│   │   │   │   └── api.ts
│   │   │   │
│   │   │   └── 📁 utils/                          # Utility functions
│   │   │       ├── validators.ts
│   │   │       ├── formatters.ts
│   │   │       └── constants.ts
│   │   │
│   │   ├── public/                                # Static assets
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── 📁 admin/                                  # Admin dashboard (React)
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   │
│       │   ├── 📁 pages/
│       │   │   ├── AdminLogin.tsx
│       │   │   ├── Dashboard.tsx
│       │   │   ├── UserManagement.tsx
│       │   │   ├── CreateAdmin.tsx                # Admin creation page
│       │   │   ├── DocumentReview.tsx
│       │   │   ├── IssueManagement.tsx
│       │   │   ├── BenefitReview.tsx
│       │   │   └── Analytics.tsx
│       │   │
│       │   ├── 📁 components/
│       │   │   ├── AdminNavbar.tsx
│       │   │   ├── StatsCard.tsx
│       │   │   ├── UserTable.tsx
│       │   │   ├── DocumentQueue.tsx
│       │   │   └── AdminCreationForm.tsx          # Admin creation component
│       │   │
│       │   └── 📁 services/
│       │       ├── admin.service.ts
│       │       └── analytics.service.ts
│       │
│       ├── package.json
│       ├── vite.config.ts
│       └── Dockerfile
│
├── 📁 packages/                                   # Shared packages
│   ├── 📁 ui/                                     # Shared React components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── package.json
│   │
│   ├── 📁 types/                                  # Shared TypeScript types
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── municipality.ts
│   │   └── package.json
│   │
│   └── 📁 utils/                                  # Shared utilities
│       ├── validators.ts
│       ├── formatters.ts
│       ├── constants.ts
│       └── package.json
│
├── 📁 tools/                                      # Utility scripts
│   └── 📁 scripts/
│       ├── seed_data.py                           # Initialize municipalities
│       ├── create_admin_account.py                # CLI admin creation
│       ├── migrate_database.py                    # Database migration helper
│       ├── backup_database.sh                     # Backup script
│       └── setup_production.sh                    # Production setup
│
├── 📁 uploads/                                    # File storage (Docker volume)
│   └── zambales/
│       ├── municipalities/
│       │   ├── botolan/
│       │   │   ├── residents/{user_id}/
│       │   │   │   ├── profile/
│       │   │   │   ├── government_id/
│       │   │   │   └── documents/
│       │   │   ├── issues/{issue_id}/
│       │   │   └── generated_documents/
│       │   └── [... 12 more municipalities]
│       └── marketplace/
│           └── items/{item_id}/photos/
│
├── docker-compose.yml                             # Container orchestration
├── turbo.json                                     # Turborepo configuration
├── package.json                                   # Root package.json
├── .env.example                                   # Environment template
├── .gitignore
├── README.md
└── munlink_guide.md                               # This file (v1 - deprecated)
└── munlink_guide_v2.md                            # ✅ THIS FILE (v2 - current)
```

### File Path Constants (Code Implementation)

```python
# apps/api/utils/paths.py
"""
Centralized file path management.
USE THESE CONSTANTS EVERYWHERE. DO NOT HARDCODE PATHS.
"""
from pathlib import Path

# Project root (relative to this file)
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent

# Data directories
LOCATION_DATA_DIR = PROJECT_ROOT / "locations_reference"
LOCATION_DATA_FILE = LOCATION_DATA_DIR / "philippines_full_locations.json"

# Logo directories
MUNICIPAL_LOGO_DIR = PROJECT_ROOT / "munlink_municipals_logo"
PROVINCE_LOGO_DIR = PROJECT_ROOT / "zambales_logo"
TRADEMARK_PHOTO_DIR = PROJECT_ROOT / "municipalities_trademark"

# UI assets
UI_REFERENCE_DIR = PROJECT_ROOT / "ui_reference"
HERO_IMAGE = UI_REFERENCE_DIR / "Nature.jpg"

# Upload directories
UPLOAD_BASE_DIR = PROJECT_ROOT / "uploads" / "zambales"
MUNICIPAL_UPLOADS_DIR = UPLOAD_BASE_DIR / "municipalities"
MARKETPLACE_UPLOADS_DIR = UPLOAD_BASE_DIR / "marketplace"

# Admin data
ADMIN_EMAILS_FILE = PROJECT_ROOT / "admins_gmails.txt"

# Validation: Check if critical files exist
def validate_project_structure():
    """
    Validate that all required files and directories exist.
    Call this on application startup.
    """
    errors = []
    
    if not LOCATION_DATA_FILE.exists():
        errors.append(f"Missing: {LOCATION_DATA_FILE}")
    
    if not MUNICIPAL_LOGO_DIR.exists():
        errors.append(f"Missing: {MUNICIPAL_LOGO_DIR}")
    
    if not PROVINCE_LOGO_DIR.exists():
        errors.append(f"Missing: {PROVINCE_LOGO_DIR}")
    
    if not HERO_IMAGE.exists():
        errors.append(f"Missing: {HERO_IMAGE}")
    
    if errors:
        raise FileNotFoundError(
            "Project structure validation failed:\n" + 
            "\n".join(errors) +
            "\n\nPlease ensure all required files are in place."
        )
```

```typescript
// apps/web/src/utils/paths.ts
/**
 * Frontend path constants
 * Corresponds to backend API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
  },
  MUNICIPALITIES: {
    LIST: '/api/municipalities',
    DETAIL: (id: number) => `/api/municipalities/${id}`,
    STATS: (id: number) => `/api/municipalities/${id}/stats`,
  },
  MARKETPLACE: {
    ITEMS: '/api/marketplace/items',
    ITEM_DETAIL: (id: number) => `/api/marketplace/items/${id}`,
    ITEM_PHOTOS: (id: number) => `/api/marketplace/items/${id}/photos`,
    TRANSACTIONS: '/api/marketplace/transactions',
    FEED: '/api/marketplace/feed',
  },
  // ... more endpoints
} as const;

// Asset paths
export const ASSETS = {
  HERO_IMAGE: '/assets/ui_reference/Nature.jpg',
  MUNICIPALITY_LOGOS: (municipality: string) => 
    `/assets/munlink_municipals_logo/${municipality}/`,
  PROVINCE_LOGO: '/assets/zambales_logo/256px-Seal_of_Province_of_Zambales.svg.png',
} as const;
```

---

## 7. DATABASE ARCHITECTURE

### Entity Relationship Diagram

```
┌─────────────────┐
│  municipalities │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴────────────────────────────────────┐
    │                                         │
    │                                         │
┌───┴────┐                              ┌────┴──────┐
│  users │──────1:N────────────────────▶│   items   │
└───┬────┘                              └────┬──────┘
    │                                        │
    │ 1:1                                    │ 1:N
    │                                        │
┌───┴──────────────┐                   ┌────┴──────────┐
│ resident_profile │                   │ transactions  │
└──────────────────┘                   └───────────────┘
    │
    │ 1:N
    │
    ├──────────────────┬──────────────────┬────────────────┐
    │                  │                  │                │
┌───┴────────────┐ ┌──┴──────────┐  ┌───┴──────────┐ ┌──┴────────┐
│document_requests│ │   issues    │  │benefit_apps  │ │  qr_codes │
└────────────────┘ └─────────────┘  └──────────────┘ └───────────┘
```

### Core Tables (SQLAlchemy Models)

#### 1. Users Table

```python
# apps/api/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(Base):
    """
    User model - Core authentication and profile data.
    
    Access Levels:
    - email_verified=False: No access (must verify email)
    - email_verified=True, age<18: Read-only marketplace
    - email_verified=True, age>=18, is_verified=False: Basic access
    - email_verified=True, age>=18, is_verified=True: Full access
    """
    __tablename__ = 'users'
    
    # Primary Key
    id = Column(Integer, primary_key=True)
    
    # Authentication (UNIQUE across all municipalities)
    username = Column(String(30), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    
    # Personal Information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))  # Unique within municipality
    date_of_birth = Column(Date)  # For age-based access control
    address = Column(Text)
    
    # Municipality Association (CRITICAL for data isolation)
    municipality_id = Column(Integer, ForeignKey('municipalities.id'), nullable=False, index=True)
    municipality = relationship('Municipality', back_populates='users')
    
    # Role & Status
    role = Column(String(50), default='resident', nullable=False)  # 'resident' or 'admin'
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Email Verification (Tier 1)
    email_verified = Column(Boolean, default=False, nullable=False, index=True)
    email_verification_token = Column(String(255), unique=True, index=True)
    email_verification_expires = Column(DateTime)
    
    # Admin ID Verification (Tier 2)
    is_verified = Column(Boolean, default=False, nullable=False, index=True)
    government_id_url = Column(String(255))
    id_verification_status = Column(String(20), default='pending')  # pending, approved, rejected
    id_verification_notes = Column(Text)
    verified_by = Column(Integer, ForeignKey('users.id'))  # Admin who verified
    verified_at = Column(DateTime)
    
    # Profile Media
    profile_photo = Column(String(255))
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    items = relationship('Item', back_populates='user', cascade='all, delete-orphan')
    document_requests = relationship('DocumentRequest', back_populates='user', cascade='all, delete-orphan')
    benefit_applications = relationship('BenefitApplication', back_populates='user', cascade='all, delete-orphan')
    issues = relationship('Issue', back_populates='user', cascade='all, delete-orphan')
    notifications = relationship('Notification', back_populates='user', cascade='all, delete-orphan')
    activity_logs = relationship('ActivityLog', back_populates='user', cascade='all, delete-orphan')
    
    # Methods
    def set_password(self, password: str):
        """Hash and store password"""
        self.password_hash = generate_password_hash(password, method='bcrypt')
    
    def check_password(self, password: str) -> bool:
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def can_access_marketplace_full(self) -> bool:
        """Check if user can create listings and transact"""
        if not self.email_verified:
            return False
        
        # Age check
        if self.date_of_birth:
            today = datetime.utcnow().date()
            age = today.year - self.date_of_birth.year
            if today.month < self.date_of_birth.month or \
               (today.month == self.date_of_birth.month and today.day < self.date_of_birth.day):
                age -= 1
            return age >= 18
        
        return False
    
    def can_access_municipal_services(self) -> bool:
        """Check if user can request documents, apply for benefits, report issues"""
        return self.email_verified and self.is_verified and self.can_access_marketplace_full()
    
    def to_dict(self, include_sensitive=False):
        """Convert to dictionary for API responses"""
        data = {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': f"{self.first_name} {self.last_name}",
            'municipality_id': self.municipality_id,
            'municipality_name': self.municipality.name if self.municipality else None,
            'profile_photo': self.profile_photo,
            'role': self.role,
            'is_active': self.is_active,
            'email_verified': self.email_verified,
            'is_verified': self.is_verified,
            'id_verification_status': self.id_verification_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        
        if include_sensitive:
            data.update({
                'email': self.email,
                'phone': self.phone,
                'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
                'address': self.address,
                'government_id_url': self.government_id_url,
            })
        
        return data
```

#### 2. Municipality Table

```python
# apps/api/models/municipality.py
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class Municipality(Base):
    """
    Municipality model - One of 13 Zambales municipalities.
    Data MUST be sourced from locations_reference/philippines_full_locations.json
    """
    __tablename__ = 'municipalities'
    
    id = Column(Integer, primary_key=True)
    
    # Basic Information (from JSON data)
    name = Column(String(100), unique=True, nullable=False, index=True)
    psgc_code = Column(String(20), unique=True)  # Philippine Standard Geographic Code
    
    # Administrative
    is_capital = Column(Boolean, default=False)  # Iba is the capital
    
    # Contact Information
    logo_path = Column(String(255))  # Path to seal/logo in munlink_municipals_logo/
    trademark_photo = Column(String(255))  # Path to landmark photo
    contact_email = Column(String(255))
    contact_phone = Column(String(20))
    address = Column(Text)
    office_hours = Column(String(100))
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    users = relationship('User', back_populates='municipality')
    document_types = relationship('DocumentType', back_populates='municipality')
    benefits = relationship('Benefit', back_populates='municipality')
    issues = relationship('Issue', back_populates='municipality')
    announcements = relationship('Announcement', back_populates='municipality')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'psgc_code': self.psgc_code,
            'is_capital': self.is_capital,
            'logo_path': self.logo_path,
            'trademark_photo': self.trademark_photo,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'address': self.address,
            'office_hours': self.office_hours,
        }
```

#### 3. Marketplace Items

```python
# apps/api/models/marketplace.py
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

class Item(Base):
    """
    Marketplace item - Can be donated, lent, or sold.
    Visible across ALL 13 municipalities (cross-municipal sharing).
    """
    __tablename__ = 'items'
    
    id = Column(Integer, primary_key=True)
    
    # Basic Information
    title = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False, index=True)  # electronics, furniture, etc.
    
    # Transaction Details
    transaction_type = Column(String(20), nullable=False, index=True)  # donate, lend, sell
    status = Column(String(20), default='available', nullable=False, index=True)
    
    # Type-specific fields
    price = Column(Numeric(10, 2))  # For 'sell' items only
    lending_duration = Column(Integer)  # Days for 'lend' items only
    
    # Ownership (data belongs to user's municipality)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    user = relationship('User', back_populates='items')
    municipality_id = Column(Integer, ForeignKey('municipalities.id'), nullable=False, index=True)
    
    # Media
    photos = Column(JSON)  # Array of photo URLs (max 5)
    
    # Metrics
    view_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    transactions = relationship('Transaction', back_populates='item', cascade='all, delete-orphan')
    
    # Valid categories
    VALID_CATEGORIES = [
        'electronics', 'furniture', 'clothing', 'books',
        'tools', 'appliances', 'vehicles', 'sports', 'toys', 'other'
    ]
    
    VALID_TRANSACTION_TYPES = ['donate', 'lend', 'sell']
    
    VALID_STATUSES = [
        'available', 'claimed', 'requested', 'approved', 
        'borrowed', 'sold', 'delivered', 'completed', 'cancelled'
    ]
    
    def to_dict(self, include_user=True):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'transaction_type': self.transaction_type,
            'status': self.status,
            'photos': self.photos or [],
            'view_count': self.view_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        
        if self.transaction_type == 'sell':
            data['price'] = float(self.price) if self.price else None
        
        if self.transaction_type == 'lend':
            data['lending_duration'] = self.lending_duration
        
        if include_user and self.user:
            data['user'] = {
                'id': self.user.id,
                'name': f"{self.user.first_name} {self.user.last_name}",
                'municipality': self.user.municipality.name if self.user.municipality else None,
                'profile_photo': self.user.profile_photo,
            }
        
        return data

class Transaction(Base):
    """
    Marketplace transaction - Tracks item exchanges.
    """
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True)
    
    # Associated Item
    item_id = Column(Integer, ForeignKey('items.id'), nullable=False, index=True)
    item = relationship('Item', back_populates='transactions')
    
    # Participants
    buyer_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    buyer = relationship('User', foreign_keys=[buyer_id])
    
    seller_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    seller = relationship('User', foreign_keys=[seller_id])
    
    # Transaction Details
    transaction_type = Column(String(20), nullable=False)  # donate, lend, sell
    status = Column(String(20), default='pending', nullable=False, index=True)
    
    # Negotiation (for sell items)
    agreed_price = Column(Numeric(10, 2))
    
    # Scheduling
    pickup_date = Column(DateTime)
    return_date = Column(DateTime)  # For lending
    
    # Notes
    notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime)
    
    # Relationships
    messages = relationship('Message', back_populates='transaction', cascade='all, delete-orphan')
    
    VALID_STATUSES = [
        'pending', 'approved', 'rejected', 'contact_exchange',
        'picked_up', 'returned', 'completed', 'cancelled'
    ]
    
    def to_dict(self):
        return {
            'id': self.id,
            'item': self.item.to_dict(include_user=False) if self.item else None,
            'buyer': self.buyer.to_dict() if self.buyer else None,
            'seller': self.seller.to_dict() if self.seller else None,
            'transaction_type': self.transaction_type,
            'status': self.status,
            'agreed_price': float(self.agreed_price) if self.agreed_price else None,
            'pickup_date': self.pickup_date.isoformat() if self.pickup_date else None,
            'return_date': self.return_date.isoformat() if self.return_date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
        }

class Message(Base):
    """
    In-app messaging for marketplace transactions.
    NO external contact info sharing.
    """
    __tablename__ = 'messages'
    
    id = Column(Integer, primary_key=True)
    
    # Associated Transaction
    transaction_id = Column(Integer, ForeignKey('transactions.id'), nullable=False, index=True)
    transaction = relationship('Transaction', back_populates='messages')
    
    # Message Details
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    sender = relationship('User')
    
    message = Column(Text, nullable=False)
    message_type = Column(String(20), default='text')  # text, image, file
    attachments = Column(JSON)  # Array of file URLs
    
    # Status
    is_read = Column(Boolean, default=False, index=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sender': self.sender.to_dict() if self.sender else None,
            'message': self.message,
            'message_type': self.message_type,
            'attachments': self.attachments or [],
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
```

#### 4. Document Management Tables

```python
# apps/api/models/document.py
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta

class DocumentType(Base):
    """
    Document types offered by each municipality.
    Each municipality can define which documents they issue.
    """
    __tablename__ = 'document_types'
    
    id = Column(Integer, primary_key=True)
    
    # Basic Information
    name = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False, index=True)  # municipal, barangay
    
    # Municipality Association
    municipality_id = Column(Integer, ForeignKey('municipalities.id'), nullable=False, index=True)
    municipality = relationship('Municipality', back_populates='document_types')
    
    # Requirements and Processing
    requirements = Column(JSON)  # Array of requirement strings
    processing_days = Column(String(20))  # "3-5 business days"
    
    # Delivery Options
    digital_available = Column(Boolean, default=True)
    
    # Expiration Periods
    expiry_physical = Column(String(50))  # "6 months", "1 year", "Permanent"
    expiry_digital = Column(String(50))   # "30 days"
    
    # Fees
    fee = Column(Numeric(8, 2), default=0.00)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Relationships
    requests = relationship('DocumentRequest', back_populates='document_type')
    
    # Valid categories
    VALID_CATEGORIES = ['municipal', 'barangay']
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'municipality': self.municipality.name if self.municipality else None,
            'requirements': self.requirements or [],
            'processing_days': self.processing_days,
            'digital_available': self.digital_available,
            'expiry_physical': self.expiry_physical,
            'expiry_digital': self.expiry_digital,
            'fee': float(self.fee) if self.fee else 0.00,
            'is_active': self.is_active,
        }

class DocumentRequest(Base):
    """
    User's request for a municipal document.
    Processed by the user's home municipality only.
    """
    __tablename__ = 'document_requests'
    
    id = Column(Integer, primary_key=True)
    
    # Requester
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    user = relationship('User', back_populates='document_requests')
    
    # Municipality (must match user's municipality)
    municipality_id = Column(Integer, ForeignKey('municipalities.id'), nullable=False, index=True)
    municipality = relationship('Municipality')
    
    # Document Type
    document_type_id = Column(Integer, ForeignKey('document_types.id'), nullable=False, index=True)
    document_type = relationship('DocumentType', back_populates='requests')
    
    # Delivery Method
    delivery_method = Column(String(20), nullable=False)  # pickup, digital
    
    # Status
    status = Column(String(20), default='pending', nullable=False, index=True)
    
    # Supporting Files
    supporting_documents = Column(JSON)  # Array of file URLs
    
    # Generated Document
    generated_document_url = Column(String(255))
    qr_token = Column(String(100), unique=True, index=True)
    
    # Admin Processing
    admin_notes = Column(Text)
    rejection_reason = Column(String(500))
    
    # Timestamps
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processed_at = Column(DateTime)
    expires_at = Column(DateTime)
    
    # Relationships
    qr_code = relationship('QRCode', back_populates='document_request', uselist=False)
    
    # Valid statuses
    VALID_STATUSES = [
        'pending', 'under_review', 'approved', 'rejected',
        'generated', 'ready_for_pickup', 'delivered', 'expired'
    ]
    
    VALID_DELIVERY_METHODS = ['pickup', 'digital']
    
    def calculate_expiry(self):
        """Calculate expiry date based on delivery method and document type"""
        if self.delivery_method == 'digital':
            # Digital documents expire in 30 days
            self.expires_at = datetime.utcnow() + timedelta(days=30)
        elif self.document_type and self.document_type.expiry_physical:
            # Parse physical expiry (e.g., "6 months", "1 year")
            expiry_str = self.document_type.expiry_physical.lower()
            if 'month' in expiry_str:
                months = int(expiry_str.split()[0])
                self.expires_at = datetime.utcnow() + timedelta(days=months * 30)
            elif 'year' in expiry_str:
                years = int(expiry_str.split()[0])
                self.expires_at = datetime.utcnow() + timedelta(days=years * 365)
            elif 'permanent' in expiry_str:
                self.expires_at = None
    
    def to_dict(self):
        return {
            'id': self.id,
            'user': self.user.to_dict() if self.user else None,
            'document_type': self.document_type.to_dict() if self.document_type else None,
            'delivery_method': self.delivery_method,
            'status': self.status,
            'supporting_documents': self.supporting_documents or [],
            'generated_document_url': self.generated_document_url,
            'qr_token': self.qr_token,
            'admin_notes': self.admin_notes,
            'rejection_reason': self.rejection_reason,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
        }
```

#### 5. Benefits Management Tables

```python
# apps/api/models/benefit.py
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

class Benefit(Base):
    """
    Municipal benefit program (assistance programs).
    Each municipality manages their own programs.
    """
    __tablename__ = 'benefits'
    
    id = Column(Integer, primary_key=True)
    
    # Basic Information
    name = Column(String(200), nullable=False)
    description = Column(Text)
    
    # Municipality
    municipality_id = Column(Integer, ForeignKey('municipalities.id'), nullable=False, index=True)
    municipality = relationship('Municipality', back_populates='benefits')
    
    # Eligibility
    eligibility_criteria = Column(JSON)  # Array of criteria strings
    required_documents = Column(JSON)    # Array of required document names
    
    # Application Period
    application_start = Column(Date)
    application_end = Column(Date)
    
    # Benefit Details
    benefit_amount = Column(Numeric(10, 2))
    benefit_type = Column(String(50))  # financial, in-kind, service
    
    # Capacity
    max_beneficiaries = Column(Integer)
    current_beneficiaries = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True, index=True)
    
    # Relationships
    applications = relationship('BenefitApplication', back_populates='benefit')
    
    def is_accepting_applications(self):
        """Check if program is currently accepting applications"""
        if not self.is_active:
            return False
        
        today = datetime.utcnow().date()
        
        if self.application_start and today < self.application_start:
            return False
        
        if self.application_end and today > self.application_end:
            return False
        
        if self.max_beneficiaries and self.current_beneficiaries >= self.max_beneficiaries:
            return False
        
        return True
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'municipality': self.municipality.name if self.municipality else None,
            'eligibility_criteria': self.eligibility_criteria or [],
            'required_documents': self.required_documents or [],
            'application_start': self.application_start.isoformat() if self.application_start else None,
            'application_end': self.application_end.isoformat() if self.application_end else None,
            'benefit_amount': float(self.benefit_amount) if self.benefit_amount else None,
            'benefit_type': self.benefit_type,
            'max_beneficiaries': self.max_beneficiaries,
            'current_beneficiaries': self.current_beneficiaries,
            'is_active': self.is_active,
            'is_accepting_applications': self.is_accepting_applications(),
        }

class BenefitApplication(Base):
    """
    User's application for a municipal benefit program.
    """
    __tablename__ = 'benefit_applications'
    
    id = Column(Integer, primary_key=True)
    
    # Applicant
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    user = relationship('User', back_populates='benefit_applications')
    
    # Benefit Program
    benefit_id = Column(Integer, ForeignKey('benefits.id'), nullable=False, index=True)
    benefit = relationship('Benefit', back_populates='applications')
    
    # Application Status
    status = Column(String(20), default='submitted', nullable=False, index=True)
    
    # Application Data
    application_data = Column(JSON)  # Form responses
    supporting_documents = Column(JSON)  # Uploaded files
    
    # Admin Processing
    admin_notes = Column(Text)
    approved_amount = Column(Numeric(10, 2))
    disbursement_date = Column(Date)
    
    # Timestamps
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processed_at = Column(DateTime)
    
    # Valid statuses
    VALID_STATUSES = [
        'submitted', 'under_review', 'document_request',
        'approved', 'denied', 'disbursement', 'completed'
    ]
    
    def to_dict(self):
        return {
            'id': self.id,
            'user': self.user.to_dict() if self.user else None,
            'benefit': self.benefit.to_dict() if self.benefit else None,
            'status': self.status,
            'application_data': self.application_data or {},
            'supporting_documents': self.supporting_documents or [],
            'admin_notes': self.admin_notes,
            'approved_amount': float(self.approved_amount) if self.approved_amount else None,
            'disbursement_date': self.disbursement_date.isoformat() if self.disbursement_date else None,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
        }
```

#### 6. Issue Reporting Tables

```python
# apps/api/models/issue.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

class Issue(Base):
    """
    Municipal issue report (infrastructure, safety, environmental).
    Users report issues to their home municipality only.
    """
    __tablename__ = 'issues'
    
    id = Column(Integer, primary_key=True)
    
    # Basic Information
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    
    # Categorization
    category = Column(String(50), nullable=False, index=True)
    location = Column(String(255), nullable=False)
    urgency = Column(String(20), default='medium', index=True)
    
    # Status
    status = Column(String(20), default='reported', nullable=False, index=True)
    
    # Reporter
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    user = relationship('User', back_populates='issues')
    
    # Municipality
    municipality_id = Column(Integer, ForeignKey('municipalities.id'), nullable=False, index=True)
    municipality = relationship('Municipality', back_populates='issues')
    
    # Media
    photos = Column(JSON)  # Array of photo URLs
    
    # Admin Management
    assigned_to = Column(String(100))  # Department or person
    admin_notes = Column(Text)
    estimated_completion = Column(Date)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    resolved_at = Column(DateTime)
    
    # Valid categories
    VALID_CATEGORIES = [
        'infrastructure', 'public_safety', 
        'environmental', 'administrative'
    ]
    
    # Valid urgency levels
    VALID_URGENCY = ['low', 'medium', 'high', 'emergency']
    
    # Valid statuses
    VALID_STATUSES = [
        'reported', 'acknowledged', 'investigating',
        'in_progress', 'resolved', 'verified', 'closed'
    ]
    
    def to_dict(self, include_reporter=False):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'location': self.location,
            'urgency': self.urgency,
            'status': self.status,
            'municipality': self.municipality.name if self.municipality else None,
            'photos': self.photos or [],
            'assigned_to': self.assigned_to,
            'admin_notes': self.admin_notes,
            'estimated_completion': self.estimated_completion.isoformat() if self.estimated_completion else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
        }
        
        # Include reporter info only for admin view
        if include_reporter and self.user:
            data['reporter'] = {
                'id': self.user.id,
                'name': f"{self.user.first_name} {self.user.last_name}",
                'phone': self.user.phone,
            }
        else:
            data['reporter'] = 'Anonymous'  # Privacy for public view
        
        return data
```

#### 7. QR Code and Supporting Tables

```python
# apps/api/models/qr_code.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import hashlib
import secrets

class QRCode(Base):
    """
    QR codes for document verification.
    Each generated document has a unique QR code.
    """
    __tablename__ = 'qr_codes'
    
    id = Column(Integer, primary_key=True)
    
    # Unique Token
    token = Column(String(100), unique=True, nullable=False, index=True)
    
    # Associated Document
    document_request_id = Column(Integer, ForeignKey('document_requests.id'), nullable=False, index=True)
    document_request = relationship('DocumentRequest', back_populates='qr_code')
    
    # Municipality
    municipality_id = Column(Integer, ForeignKey('municipalities.id'), nullable=False, index=True)
    municipality = relationship('Municipality')
    
    # QR Data (JSON payload)
    qr_data = Column(JSON)
    
    # Security
    verification_hash = Column(String(255), nullable=False)
    
    # Validity
    is_valid = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime)
    last_validated_at = Column(DateTime)
    
    @staticmethod
    def generate_verification_hash(document_id: int, municipality_code: str, timestamp: datetime) -> str:
        """Generate unique verification hash for security"""
        data = f"{document_id}:{municipality_code}:{timestamp.isoformat()}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    @staticmethod
    def generate_token() -> str:
        """Generate unique QR token"""
        return secrets.token_urlsafe(32)
    
    def is_expired(self) -> bool:
        """Check if QR code has expired"""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at
    
    def to_dict(self):
        return {
            'token': self.token,
            'qr_data': self.qr_data or {},
            'is_valid': self.is_valid and not self.is_expired(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'last_validated_at': self.last_validated_at.isoformat() if self.last_validated_at else None,
        }

# apps/api/models/announcement.py
class Announcement(Base):
    """Municipal announcements"""
    __tablename__ = 'announcements'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    
    municipality_id = Column(Integer, ForeignKey('municipalities.id'), nullable=False, index=True)
    municipality = relationship('Municipality', back_populates='announcements')
    
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    creator = relationship('User')
    
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# apps/api/models/activity_log.py
class ActivityLog(Base):
    """Activity logging for audit trail"""
    __tablename__ = 'activity_logs'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    user = relationship('User', back_populates='activity_logs')
    
    action = Column(String(100), nullable=False, index=True)
    details = Column(JSON)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

# apps/api/models/notification.py
class Notification(Base):
    """User notifications"""
    __tablename__ = 'notifications'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    user = relationship('User', back_populates='notifications')
    
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False)
    related_id = Column(Integer)  # ID of related entity
    
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
```

### Database Indexes Strategy

```python
# apps/api/models/__init__.py
"""
Index Strategy for Performance:

PRIMARY INDEXES (already defined):
- All primary keys (id columns)
- Foreign keys for joins
- Unique constraints (email, username, qr_token)

QUERY OPTIMIZATION INDEXES:
- user.municipality_id - for municipal data isolation
- user.email_verified - for access control queries
- user.is_verified - for permission checks
- item.status - for marketplace filtering
- item.category - for category browsing
- item.created_at - for sorting/pagination
- transaction.status - for transaction filtering
- document_request.status - for admin queues
- issue.status - for issue tracking
- issue.urgency - for priority sorting
- notification.is_read - for unread counts
- activity_log.created_at - for audit queries

COMPOSITE INDEXES (if needed for scale):
CREATE INDEX idx_items_municipality_status ON items(municipality_id, status);
CREATE INDEX idx_items_category_status ON items(category, status);
CREATE INDEX idx_requests_user_status ON document_requests(user_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
"""
```

---

## 8. MULTI-TENANT ARCHITECTURE

### Data Isolation Strategy

```python
# apps/api/utils/multi_tenant.py
"""
Multi-tenant data isolation middleware.
Ensures users can only access their own municipality's data.
"""
from flask import g
from functools import wraps

def require_municipality_access(f):
    """
    Decorator to enforce municipal data isolation.
    User can only access data from their own municipality.
    
    Exceptions:
    - Marketplace is cross-municipal (accessible to all)
    - Admins can access their own municipality only
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = g.current_user
        requested_municipality_id = kwargs.get('municipality_id')
        
        # Check if user is accessing their own municipality
        if requested_municipality_id and user.municipality_id != requested_municipality_id:
            # Admins cannot cross municipalities either
            return {
                'error': 'Access denied',
                'message': 'You can only access data from your own municipality'
            }, 403
        
        return f(*args, **kwargs)
    
    return decorated_function

# Usage example:
@app.route('/api/municipalities/<int:municipality_id>/documents')
@require_auth
@require_municipality_access
def get_municipality_documents(municipality_id):
    # User can only see their own municipality's documents
    pass
```

### Cross-Municipal Marketplace Access

```python
# apps/api/routes/marketplace.py
"""
Marketplace is the ONLY cross-municipal feature.
Items are visible across all 13 municipalities.
"""

@app.route('/api/marketplace/items', methods=['GET'])
@require_auth
def get_marketplace_items():
    """
    Get marketplace items from ALL municipalities.
    This is intentionally cross-municipal for resource sharing.
    """
    # Filter parameters
    category = request.args.get('category')
    municipality_id = request.args.get('municipality')  # Optional filter
    transaction_type = request.args.get('type')
    search = request.args.get('search')
    
    # Base query - items from ALL municipalities
    query = Item.query.filter_by(status='available')
    
    # Optional municipality filter
    if municipality_id:
        query = query.filter_by(municipality_id=municipality_id)
    
    # Other filters...
    if category:
        query = query.filter_by(category=category)
    
    items = query.order_by(Item.created_at.desc()).all()
    
    return {
        'items': [item.to_dict() for item in items],
        'total': len(items)
    }
```

### Data Ownership Rules

```python
# apps/api/utils/ownership.py
"""
Data ownership and access rules.
"""

class DataOwnershipRules:
    """
    Define which data belongs to which entity and who can access it.
    """
    
    @staticmethod
    def user_owns_data(user, entity):
        """Check if user owns the data entity"""
        return entity.user_id == user.id
    
    @staticmethod
    def municipality_owns_data(municipality_id, entity):
        """Check if entity belongs to municipality"""
        return entity.municipality_id == municipality_id
    
    @staticmethod
    def can_user_access_document(user, document_request):
        """
        User can access document if:
        - They created it, OR
        - They are admin of the municipality that processed it
        """
        if user.id == document_request.user_id:
            return True
        
        if user.role == 'admin' and user.municipality_id == document_request.municipality_id:
            return True
        
        return False
    
    @staticmethod
    def can_user_access_item(user, item):
        """
        User can access marketplace item if:
        - It's available (public), OR
        - They own it, OR
        - They have an active transaction on it
        """
        if item.status == 'available':
            return True
        
        if user.id == item.user_id:
            return True
        
        # Check if user has transaction on this item
        transaction = Transaction.query.filter(
            (Transaction.buyer_id == user.id) | (Transaction.seller_id == user.id),
            Transaction.item_id == item.id
        ).first()
        
        return transaction is not None

# Usage in routes:
@app.route('/api/documents/requests/<int:request_id>')
@require_auth
def get_document_request(request_id):
    user = g.current_user
    doc_request = DocumentRequest.query.get_or_404(request_id)
    
    if not DataOwnershipRules.can_user_access_document(user, doc_request):
        return {'error': 'Access denied'}, 403
    
    return {'request': doc_request.to_dict()}
```

---

## 9. USER AUTHENTICATION & VERIFICATION

### Two-Tier Verification System

```python
# apps/api/routes/auth.py
"""
Two-tier user verification system:
Tier 1: Email Verification (basic access)
Tier 2: Admin ID Verification (full access)
"""

@app.route('/api/auth/register', methods=['POST'])
def register():
    """
    User registration - Creates account and sends email verification.
    """
    data = request.json
    
    # Validate required fields
    required = ['email', 'username', 'password', 'first_name', 'last_name', 
                'municipality_id', 'phone', 'date_of_birth']
    
    for field in required:
        if field not in data:
            return {'error': f'Missing required field: {field}'}, 400
    
    # Check email uniqueness
    if User.query.filter_by(email=data['email']).first():
        return {'error': 'Email already registered'}, 409
    
    # Check username uniqueness
    if User.query.filter_by(username=data['username']).first():
        return {'error': 'Username already taken'}, 409
    
    # Create user
    user = User(
        email=data['email'],
        username=data['username'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        municipality_id=data['municipality_id'],
        phone=data['phone'],
        date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date(),
        address=data.get('address'),
        email_verified=False,  # NOT verified yet
        is_verified=False,     # NOT admin-verified yet
    )
    
    user.set_password(data['password'])
    
    # Generate email verification token
    token = secrets.token_urlsafe(32)
    user.email_verification_token = token
    user.email_verification_expires = datetime.utcnow() + timedelta(hours=24)
    
    db.session.add(user)
    db.session.commit()
    
    # Send verification email
    send_verification_email(user.email, token)
    
    return {
        'message': 'Registration successful. Please check your email to verify your account.',
        'email_sent': True
    }, 201

@app.route('/api/auth/verify-email', methods=['POST'])
def verify_email():
    """
    Tier 1: Email verification.
    User gains basic access after email verification.
    """
    data = request.json
    token = data.get('token')
    
    if not token:
        return {'error': 'Verification token required'}, 400
    
    user = User.query.filter_by(email_verification_token=token).first()
    
    if not user:
        return {'error': 'Invalid verification token'}, 404
    
    if datetime.utcnow() > user.email_verification_expires:
        return {'error': 'Verification token expired'}, 400
    
    # Mark email as verified
    user.email_verified = True
    user.email_verification_token = None
    user.email_verification_expires = None
    
    db.session.commit()
    
    # Generate JWT token for login
    access_token = create_access_token(identity=user.id)
    
    # Log activity
    log_activity(user.id, 'email_verified', {'email': user.email})
    
    return {
        'token': access_token,
        'user': user.to_dict(include_sensitive=True),
        'message': 'Email verified successfully. Please upload your government ID for full access to municipal services.'
    }, 200

@app.route('/api/users/profile/government-id', methods=['POST'])
@require_auth
def upload_government_id():
    """
    User uploads government ID for Tier 2 verification.
    Admin will review and approve/reject.
    """
    user = g.current_user
    
    if not user.email_verified:
        return {'error': 'Please verify your email first'}, 403
    
    if 'government_id' not in request.files:
        return {'error': 'No file uploaded'}, 400
    
    file = request.files['government_id']
    
    # Validate file
    if not allowed_file(file.filename, ['jpg', 'jpeg', 'png', 'pdf']):
        return {'error': 'Invalid file type. Allowed: JPG, PNG, PDF'}, 400
    
    if file_size_exceeds(file, 5 * 1024 * 1024):  # 5MB limit
        return {'error': 'File too large. Maximum 5MB'}, 400
    
    # Save file
    filename = save_uploaded_file(
        file, 
        user.municipality_id, 
        user.id, 
        'government_id'
    )
    
    # Update user record
    user.government_id_url = filename
    user.id_verification_status = 'pending'
    
    db.session.commit()
    
    # Notify admin
    notify_admin_new_id_verification(user.municipality_id, user.id)
    
    # Log activity
    log_activity(user.id, 'government_id_uploaded', {})
    
    return {
        'id_url': filename,
        'message': 'Government ID uploaded successfully. Awaiting admin verification.'
    }, 200

@app.route('/api/users/admin/<int:user_id>/verify-id', methods=['PUT'])
@require_auth
@require_admin
def verify_user_id(user_id):
    """
    Tier 2: Admin verifies user's government ID.
    User gains full access after admin approval.
    """
    admin = g.current_user
    user = User.query.get_or_404(user_id)
    
    # Admin can only verify users from their own municipality
    if user.municipality_id != admin.municipality_id:
        return {'error': 'Access denied'}, 403
    
    data = request.json
    status = data.get('status')  # 'approved' or 'rejected'
    notes = data.get('notes', '')
    
    if status not in ['approved', 'rejected']:
        return {'error': 'Invalid status. Use approved or rejected'}, 400
    
    # Update verification status
    user.id_verification_status = status
    user.id_verification_notes = notes
    
    if status == 'approved':
        user.is_verified = True  # FULL ACCESS GRANTED
        user.verified_by = admin.id
        user.verified_at = datetime.utcnow()
        
        # Notify user of approval
        send_notification(
            user.id,
            'Account Verified',
            'Your account has been fully verified. You now have access to all municipal services.',
            'account_verified'
        )
        
        # Log activity
        log_activity(user.id, 'account_verified', {'verified_by': admin.id})
    else:
        # Notify user of rejection
        send_notification(
            user.id,
            'ID Verification Rejected',
            f'Your ID verification was rejected. Reason: {notes}',
            'id_rejected'
        )
        
        # Log activity
        log_activity(user.id, 'id_verification_rejected', {'reason': notes})
    
    db.session.commit()
    
    return {
        'message': f'User ID verification {status}',
        'user': user.to_dict(include_sensitive=True)
    }, 200
```

### Access Control Implementation

```python
# apps/api/utils/auth.py
"""
Access control decorators and utilities.
"""
from flask import g
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def require_auth(f):
    """Require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_active:
            return {'error': 'Invalid user'}, 401
        
        g.current_user = user
        return f(*args, **kwargs)
    
    return decorated

def require_email_verified(f):
    """Require email verification (Tier 1)"""
    @wraps(f)
    def decorated(*args, **kwargs):
        user = g.current_user
        
        if not user.email_verified:
            return {
                'error': 'Email not verified',
                'message': 'Please verify your email address to access this feature'
            }, 403
        
        return f(*args, **kwargs)
    
    return decorated

def require_verified(f):
    """Require full verification (Tier 2 - email + admin ID)"""
    @wraps(f)
    def decorated(*args, **kwargs):
        user = g.current_user
        
        if not user.email_verified:
            return {
                'error': 'Email not verified',
                'message': 'Please verify your email first'
            }, 403
        
        # Check age for municipal services (18+)
        if not user.can_access_municipal_services():
            return {
                'error': 'Access denied',
                'message': 'You must be 18+ and admin-verified to access municipal services'
            }, 403
        
        return f(*args, **kwargs)
    
    return decorated

def require_admin(f):
    """Require admin role"""
    @wraps(f)
    def decorated(*args, **kwargs):
        user = g.current_user
        
        if user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        return f(*args, **kwargs)
    
    return decorated

def require_age(min_age=18):
    """Require minimum age"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = g.current_user
            
            if not user.date_of_birth:
                return {'error': 'Date of birth required'}, 400
            
            today = datetime.utcnow().date()
            age = today.year - user.date_of_birth.year
            
            if today.month < user.date_of_birth.month or \
               (today.month == user.date_of_birth.month and today.day < user.date_of_birth.day):
                age -= 1
            
            if age < min_age:
                return {
                    'error': 'Age requirement not met',
                    'message': f'You must be at least {min_age} years old'
                }, 403
            
            return f(*args, **kwargs)
        
        return decorated
    return decorator
```

---

*Continued in next sections...*

## 10. MARKETPLACE SYSTEM

### Item Creation and Management

```python
# apps/api/routes/marketplace.py

@app.route('/api/marketplace/items', methods=['POST'])
@require_auth
@require_email_verified
@require_age(18)  # Must be 18+ to create listings
def create_item():
    """
    Create marketplace item (donate, lend, or sell).
    Cross-municipal: Visible across all 13 municipalities.
    """
    user = g.current_user
    data = request.json
    
    # Validate required fields
    required = ['title', 'description', 'category', 'transaction_type']
    for field in required:
        if field not in data:
            return {'error': f'Missing required field: {field}'}, 400
    
    # Validate category
    if data['category'] not in Item.VALID_CATEGORIES:
        return {
            'error': 'Invalid category',
            'valid_categories': Item.VALID_CATEGORIES
        }, 400
    
    # Validate transaction type
    if data['transaction_type'] not in Item.VALID_TRANSACTION_TYPES:
        return {
            'error': 'Invalid transaction type',
            'valid_types': Item.VALID_TRANSACTION_TYPES
        }, 400
    
    # Type-specific validation
    if data['transaction_type'] == 'sell' and 'price' not in data:
        return {'error': 'Price required for sell items'}, 400
    
    if data['transaction_type'] == 'lend' and 'lending_duration' not in data:
        return {'error': 'Lending duration required for lend items'}, 400
    
    # Create item
    item = Item(
        title=data['title'],
        description=data['description'],
        category=data['category'],
        transaction_type=data['transaction_type'],
        price=data.get('price'),
        lending_duration=data.get('lending_duration'),
        user_id=user.id,
        municipality_id=user.municipality_id,
        status='available'
    )
    
    db.session.add(item)
    db.session.commit()
    
    # Log activity
    log_activity(user.id, 'item_created', {
        'item_id': item.id,
        'type': item.transaction_type
    })
    
    return {
        'message': 'Item created successfully',
        'item': item.to_dict()
    }, 201

@app.route('/api/marketplace/items/<int:item_id>/photos', methods=['POST'])
@require_auth
def upload_item_photos(item_id):
    """
    Upload photos for marketplace item (max 5 photos).
    """
    user = g.current_user
    item = Item.query.get_or_404(item_id)
    
    # Check ownership
    if item.user_id != user.id:
        return {'error': 'Access denied'}, 403
    
    if 'photos' not in request.files:
        return {'error': 'No photos uploaded'}, 400
    
    files = request.files.getlist('photos')
    
    # Check photo count limit
    current_photos = item.photos or []
    if len(current_photos) + len(files) > 5:
        return {'error': 'Maximum 5 photos per item'}, 400
    
    uploaded_urls = []
    
    for file in files:
        # Validate file
        if not allowed_file(file.filename, ['jpg', 'jpeg', 'png']):
            continue
        
        # Save file
        filename = save_uploaded_file(
            file,
            'marketplace',
            item.id,
            'photo'
        )
        
        uploaded_urls.append(filename)
    
    # Update item photos
    item.photos = current_photos + uploaded_urls
    db.session.commit()
    
    return {
        'message': f'{len(uploaded_urls)} photos uploaded',
        'photo_urls': uploaded_urls,
        'total_photos': len(item.photos)
    }, 200
```

### Transaction Workflows

```python
# apps/api/routes/marketplace.py

@app.route('/api/marketplace/transactions', methods=['POST'])
@require_auth
@require_email_verified
@require_age(18)
def create_transaction():
    """
    Initiate transaction (claim, request, or buy).
    """
    user = g.current_user
    data = request.json
    
    item_id = data.get('item_id')
    action = data.get('action')  # 'claim', 'request', 'buy'
    
    item = Item.query.get_or_404(item_id)
    
    # Cannot transact with own items
    if item.user_id == user.id:
        return {'error': 'Cannot transact with your own item'}, 400
    
    # Check item availability
    if item.status != 'available':
        return {'error': 'Item is no longer available'}, 400
    
    # Validate action matches transaction type
    action_map = {
        'donate': 'claim',
        'lend': 'request',
        'sell': 'buy'
    }
    
    if action_map[item.transaction_type] != action:
        return {'error': f'Invalid action for {item.transaction_type} items'}, 400
    
    # Create transaction
    transaction = Transaction(
        item_id=item.id,
        buyer_id=user.id,
        seller_id=item.user_id,
        transaction_type=item.transaction_type,
        status='pending'
    )
    
    # Update item status
    if item.transaction_type == 'donate':
        item.status = 'claimed'
        transaction.status = 'contact_exchange'
    elif item.transaction_type == 'lend':
        item.status = 'requested'
    elif item.transaction_type == 'sell':
        item.status = 'interested'
    
    db.session.add(transaction)
    db.session.commit()
    
    # Notify seller
    send_notification(
        item.user_id,
        f'New {action} on your item',
        f'{user.first_name} {user.last_name} wants to {action} "{item.title}"',
        'marketplace_transaction'
    )
    
    # Notify buyer
    send_notification(
        user.id,
        'Transaction initiated',
        f'You initiated a transaction for "{item.title}"',
        'marketplace_transaction'
    )
    
    # Log activity
    log_activity(user.id, 'transaction_initiated', {
        'transaction_id': transaction.id,
        'item_id': item.id,
        'action': action
    })
    
    return {
        'message': 'Transaction initiated successfully',
        'transaction': transaction.to_dict()
    }, 201

@app.route('/api/marketplace/transactions/<int:transaction_id>', methods=['PUT'])
@require_auth
def update_transaction(transaction_id):
    """
    Update transaction status (approve, reject, complete).
    """
    user = g.current_user
    transaction = Transaction.query.get_or_404(transaction_id)
    
    # Check access (must be buyer or seller)
    if user.id not in [transaction.buyer_id, transaction.seller_id]:
        return {'error': 'Access denied'}, 403
    
    data = request.json
    new_status = data.get('status')
    notes = data.get('notes', '')
    
    # Validate status transition
    if new_status not in Transaction.VALID_STATUSES:
        return {'error': 'Invalid status'}, 400
    
    # Status-specific logic
    if new_status == 'approved' and user.id == transaction.seller_id:
        # Seller approves request
        transaction.status = 'approved'
        transaction.item.status = 'approved'
    
    elif new_status == 'rejected' and user.id == transaction.seller_id:
        # Seller rejects request
        transaction.status = 'rejected'
        transaction.item.status = 'available'  # Back to available
    
    elif new_status == 'completed':
        # Either party can mark as completed
        transaction.status = 'completed'
        transaction.item.status = 'completed'
        transaction.completed_at = datetime.utcnow()
    
    transaction.notes = notes
    db.session.commit()
    
    # Notify other party
    other_user_id = transaction.buyer_id if user.id == transaction.seller_id else transaction.seller_id
    send_notification(
        other_user_id,
        'Transaction updated',
        f'Transaction status changed to: {new_status}',
        'marketplace_transaction'
    )
    
    return {
        'message': 'Transaction updated successfully',
        'transaction': transaction.to_dict()
    }, 200
```

---

## 15. API ENDPOINTS (COMPLETE REFERENCE)

### Authentication Endpoints

```yaml
POST /api/auth/register
  Body: { email, username, password, first_name, last_name, municipality_id, phone, date_of_birth }
  Response: { message, email_sent }
  Status: 201

POST /api/auth/verify-email
  Body: { token }
  Response: { token, user, message }
  Status: 200

POST /api/auth/resend-verification
  Body: { email }
  Response: { message }
  Status: 200

POST /api/auth/login
  Body: { email_or_username, password }
  Response: { token, user }
  Status: 200

POST /api/auth/logout
  Headers: { Authorization: "Bearer <token>" }
  Response: { message }
  Status: 200

GET /api/users/profile
  Headers: { Authorization: "Bearer <token>" }
  Response: { user, municipality, stats }
  Status: 200

PUT /api/users/profile
  Headers: { Authorization: "Bearer <token>" }
  Body: { first_name, last_name, phone, address }
  Response: { user }
  Status: 200

POST /api/users/profile/government-id
  Headers: { Authorization: "Bearer <token>" }
  Body: FormData with "government_id" file
  Response: { id_url, message }
  Status: 200
```

### Municipality Endpoints

```yaml
GET /api/municipalities
  Response: { municipalities: [{ id, name, psgc_code, is_capital }] }
  Status: 200

GET /api/municipalities/<id>
  Response: { municipality, services, contact_info }
  Status: 200

GET /api/municipalities/<id>/stats
  Headers: { Authorization: "Bearer <token>" }
  Response: { residents, active_issues, pending_documents, marketplace_items }
  Status: 200
```

### Marketplace Endpoints

```yaml
GET /api/marketplace/items
  Query: ?category=string&municipality=int&type=string&search=string&page=int
  Response: { items: [...], pagination }
  Status: 200

POST /api/marketplace/items
  Headers: { Authorization: "Bearer <token>" }
  Body: { title, description, category, transaction_type, price?, lending_duration? }
  Response: { message, item }
  Status: 201

GET /api/marketplace/items/<id>
  Response: { item }
  Status: 200

PUT /api/marketplace/items/<id>
  Headers: { Authorization: "Bearer <token>" }
  Body: { title?, description?, status? }
  Response: { item }
  Status: 200

DELETE /api/marketplace/items/<id>
  Headers: { Authorization: "Bearer <token>" }
  Response: { message }
  Status: 200

POST /api/marketplace/items/<id>/photos
  Headers: { Authorization: "Bearer <token>" }
  Body: FormData with "photos" files (max 5)
  Response: { message, photo_urls, total_photos }
  Status: 200

POST /api/marketplace/transactions
  Headers: { Authorization: "Bearer <token>" }
  Body: { item_id, action, message? }
  Response: { message, transaction }
  Status: 201

GET /api/marketplace/transactions
  Headers: { Authorization: "Bearer <token>" }
  Response: { transactions: [...] }
  Status: 200

PUT /api/marketplace/transactions/<id>
  Headers: { Authorization: "Bearer <token>" }
  Body: { status, notes? }
  Response: { message, transaction }
  Status: 200
```

### Document Endpoints

```yaml
GET /api/documents/types
  Query: ?municipality_id=int
  Response: { document_types: [...] }
  Status: 200

POST /api/documents/requests
  Headers: { Authorization: "Bearer <token>" }
  Body: { document_type_id, delivery_method, supporting_documents, notes? }
  Response: { message, request }
  Status: 201

GET /api/documents/requests
  Headers: { Authorization: "Bearer <token>" }
  Query: ?status=string&page=int
  Response: { requests: [...], pagination }
  Status: 200

PUT /api/documents/requests/<id>
  Headers: { Authorization: "Bearer <token>" } (admin only)
  Body: { status, admin_notes?, rejection_reason? }
  Response: { message, request }
  Status: 200

GET /api/documents/download/<id>
  Headers: { Authorization: "Bearer <token>" }
  Response: PDF file
  Status: 200
```

### Benefits Endpoints

```yaml
GET /api/benefits/programs/<municipality_id>
  Response: { programs: [...] }
  Status: 200

POST /api/benefits/applications
  Headers: { Authorization: "Bearer <token>" }
  Body: { program_id, supporting_documents, application_data }
  Response: { message, application }
  Status: 201

GET /api/benefits/applications
  Headers: { Authorization: "Bearer <token>" }
  Response: { applications: [...] }
  Status: 200

PUT /api/benefits/applications/<id>
  Headers: { Authorization: "Bearer <token>" } (admin only)
  Body: { status, admin_notes?, requested_documents? }
  Response: { message, application }
  Status: 200
```

### Issues Endpoints

```yaml
POST /api/issues/submit
  Headers: { Authorization: "Bearer <token>" }
  Body: { title, description, category, location, urgency, photos }
  Response: { message, issue }
  Status: 201

GET /api/issues/municipality/<id>
  Query: ?status=string&category=string&page=int
  Response: { issues: [...], pagination }
  Status: 200

PUT /api/issues/<id>/status
  Headers: { Authorization: "Bearer <token>" } (admin only)
  Body: { status, admin_notes?, estimated_completion? }
  Response: { message, issue }
  Status: 200
```

### QR Code Endpoints

```yaml
POST /api/qr/validate
  Body: { qr_data }
  Response: { valid, document: {...} }
  Status: 200

GET /api/qr/<token>
  Response: { document_info, verification_status }
  Status: 200
```

### Admin Endpoints

```yaml
POST /api/admin/create-admin
  Headers: { Authorization: "Bearer <token>", X-Admin-Secret: "<secret>" }
  Body: { username, email, first_name, last_name, municipality_id, phone, date_of_birth, password? }
  Response: { message, admin }
  Status: 201

GET /api/users/admin/<municipality_id>
  Headers: { Authorization: "Bearer <token>" } (admin only)
  Query: ?verification_status=pending&page=int
  Response: { users: [...], pagination }
  Status: 200

PUT /api/users/admin/<user_id>/verify-id
  Headers: { Authorization: "Bearer <token>" } (admin only)
  Body: { status, notes? }
  Response: { message, user }
  Status: 200
```

---

## 25. PRODUCTION DEPLOYMENT

### Deployment on Render.com (Recommended)

**Step-by-Step Guide:**

```bash
# 1. Prepare Repository
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/munlink-zambales.git
git push -u origin main

# 2. Create Render Account
# Visit render.com and sign up

# 3. Deploy Database
# Dashboard → New → PostgreSQL
# Name: munlink-zambales-db
# Region: Singapore
# Plan: Starter ($7/month)
# Copy Internal Database URL

# 4. Deploy API Backend
# Dashboard → New → Web Service
# Connect GitHub repo
# Root Directory: apps/api
# Build Command: pip install -r requirements.txt && flask db upgrade
# Start Command: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
# Environment Variables:
DATABASE_URL=<from step 3>
JWT_SECRET_KEY=<generate with: openssl rand -hex 32>
ADMIN_SECRET_KEY=<generate with: openssl rand -hex 32>
FLASK_ENV=production
# Add persistent disk: /app/uploads (1GB+)

# 5. Seed Database
# In Render Dashboard → munlink-api → Shell
python ../../tools/scripts/seed_data.py
python ../../tools/scripts/create_admin_account.py

# 6. Deploy Web App
# Dashboard → New → Static Site
# Root Directory: apps/web
# Build Command: npm install && npm run build
# Publish Directory: dist
# Environment Variables:
VITE_API_BASE_URL=https://munlink-api.onrender.com/api

# 7. Deploy Admin Dashboard
# Dashboard → New → Private Service
# Root Directory: apps/admin
# Build Command: npm install && npm run build
# Start Command: npm run preview -- --port $PORT --host 0.0.0.0

# 8. Access Admin Dashboard (SSH Tunnel)
npm install -g @render/cli
render login
render ssh munlink-admin -L 3001:localhost:10000
# Then visit: http://localhost:3001
```

---

## 27. SCALABILITY GUIDELINES

### Performance Optimization

```python
# Database Query Optimization
from sqlalchemy import select, joinedload

# BAD: N+1 queries
items = Item.query.all()
for item in items:
    print(item.user.name)  # Each iteration hits DB

# GOOD: Eager loading
items = Item.query.options(joinedload(Item.user)).all()
for item in items:
    print(item.user.name)  # Loaded in single query

# Pagination for large datasets
def get_paginated_items(page=1, per_page=20):
    return Item.query.order_by(Item.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
```

### Caching Strategy

```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis'})

@app.route('/api/municipalities')
@cache.cached(timeout=3600)  # Cache for 1 hour
def get_municipalities():
    """Municipalities rarely change - cache heavily"""
    municipalities = Municipality.query.all()
    return {'municipalities': [m.to_dict() for m in municipalities]}
```

### File Storage Scaling

```python
# When scaling beyond single server:
# 1. Use S3-compatible storage (AWS S3, DigitalOcean Spaces)
# 2. CDN for static assets
# 3. Separate file server

import boto3

s3_client = boto3.client('s3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_KEY')
)

def save_to_s3(file, bucket, key):
    s3_client.upload_fileobj(file, bucket, key)
    return f"https://{bucket}.s3.amazonaws.com/{key}"
```

---

**GUIDE COMPLETE**

This comprehensive guide covers all aspects of the MunLink Zambales platform from conceptual design to production deployment. Use the AI Quick Start checklist before implementation and reference specific sections as needed.

