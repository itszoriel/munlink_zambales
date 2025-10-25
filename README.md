# MunLink Zambales

> Municipal Digital Governance Platform for Zambales Province

## 🎯 Project Overview

MunLink Zambales is a multi-tenant digital governance platform designed exclusively for the **13 municipalities** of Zambales Province, Philippines. It provides unified digital infrastructure for municipal government services while enabling cross-municipal community engagement through a shared marketplace platform.

## 📍 Geographic Coverage

**Province**: Zambales (ONLY)  
**Municipalities**: EXACTLY 13

1. Botolan
2. Cabangan
3. Candelaria
4. Castillejos
5. Iba (Capital)
6. Masinloc
7. Palauig
8. San Antonio
9. San Felipe
10. San Marcelino
11. San Narciso
12. Santa Cruz
13. Subic

## 🚀 Technology Stack

### Backend
- **Framework**: Flask 3.0+
- **Database**: PostgreSQL 15+ (production) / SQLite (development)
- **ORM**: SQLAlchemy 2.0+
- **Authentication**: JWT with bcrypt
- **Language**: Python 3.10+

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript 5+
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3+
- **Routing**: React Router 6+

### Infrastructure
- **Monorepo**: Turborepo
- **Containerization**: Docker + Docker Compose
- **Package Manager**: npm (workspaces)

## 📁 Project Structure

```
munlink-zambales/
├── apps/                    # Applications
│   ├── api/                # Flask backend API
│   ├── web/                # Public website (React)
│   └── admin/              # Admin dashboard (React)
├── packages/               # Shared packages (future)
│   └── (ready for shared components, utils, etc.)
├── public/                 # Static assets
│   ├── logos/
│   │   ├── zambales/      # Province logos
│   │   └── municipalities/ # Municipal logos (13 municipalities)
│   ├── landmarks/          # Landmark photos
│   └── reference/          # UI reference images
├── data/                   # Reference & seed data
│   ├── locations/          # Geographic data (Philippines, Zambales)
│   ├── admins_gmails.txt  # Admin email whitelist
│   └── PSGC-July-2025-Publication-Datafile.xlsx
├── docs/                   # Documentation
│   ├── guides/            # User & developer guides
│   ├── progress/          # Build & progress documentation
│   ├── AI_QUICK_START.md
│   └── PROJECT_FILE_STRUCTURE.md
├── scripts/                # Development & deployment scripts
│   ├── start-servers.ps1
│   ├── check-status.ps1
│   └── test-backend.py
├── uploads/                # Runtime file storage
└── munlink_zambales.db    # SQLite database (development)
```

## 🛠️ Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 15+ (or use SQLite for development)
- Docker & Docker Compose (optional)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd munlink-zambales

# 2. Install root dependencies
npm install

# 3. Setup environment
cp ENV_TEMPLATE.txt .env
# Edit .env with your configuration

# 4. Setup backend
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 5. Setup database
flask db upgrade
python scripts/seed_data.py

# 6. Setup frontend
cd ../web
npm install

cd ../admin
npm install

# 7. Return to root
cd ../..
```

### Development

```bash
# Run all services (from root)
npm run dev

# Or run individually:

# Backend API (Terminal 1)
cd apps/api
source venv/bin/activate
python app.py

# Web Frontend (Terminal 2)
cd apps/web
npm run dev

# Admin Dashboard (Terminal 3)
cd apps/admin
npm run dev
```

### Access Points

- **Public Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **API**: http://localhost:5000

## 📚 Documentation

- **Complete Guide**: [docs/guides/munlink_guide_v2.md](docs/guides/munlink_guide_v2.md)
- **Quick Start**: [docs/AI_QUICK_START.md](docs/AI_QUICK_START.md)
- **File Structure**: [docs/PROJECT_FILE_STRUCTURE.md](docs/PROJECT_FILE_STRUCTURE.md)
- **Build Progress**: [docs/progress/](docs/progress/)

## 🔑 Key Features

### For Residents (18+)
- ✅ Cross-municipal marketplace (donate, lend, sell)
- ✅ Municipal document requests (22 document types)
- ✅ Issue reporting (infrastructure, safety, environmental)
- ✅ Benefits application (municipal assistance programs)
- ✅ QR code document verification

### For Municipal Admins
- ✅ User ID verification
- ✅ Document processing and generation
- ✅ Issue management and tracking
- ✅ Benefits program management
- ✅ Municipal announcements
- ✅ Analytics and reporting

## 🔒 Security

- Two-tier verification (email + admin ID)
- Age-based access control (18+ for transactions)
- Municipal data isolation
- JWT authentication with token blacklisting
- Bcrypt password hashing
- Admin dashboard (internal network only)

## 🚢 Deployment

### Docker (Recommended)

```bash
docker-compose up -d
```

### Manual Deployment

See [docs/guides/munlink_guide_v2.md](docs/guides/munlink_guide_v2.md) Section 25 for detailed deployment instructions on Render.com and other platforms.

## 📊 Database

**Tables**: 15+ core models

- Users & Authentication
- Municipalities (13 records)
- Marketplace (Items, Transactions, Messages)
- Documents (Types, Requests, QR Codes)
- Issues & Benefits
- Notifications & Activity Logs

## 🤝 Contributing

This is a government project for Zambales Province. Contact the project maintainers for contribution guidelines.

## 📄 License

Proprietary - Zambales Provincial Government

## 📞 Support

For technical support, refer to the documentation in the `docs/` folder or contact the development team.

---

**Built for the people of Zambales** 🇵🇭

