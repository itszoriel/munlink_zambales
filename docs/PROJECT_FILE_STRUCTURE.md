# MunLink Zambales - Complete File Structure

## 📁 Full Project Directory Tree

```
munlink-zambales/                                    # Root monorepo directory
│
├── 📄 package.json                                  # Root workspace configuration
├── 📄 turbo.json                                    # Turborepo build configuration
├── 📄 .gitignore                                    # Git ignore patterns
├── 📄 .env                                          # Environment variables (DO NOT COMMIT)
├── 📄 .env.example                                  # Environment template (commit this)
├── 📄 README.md                                     # Project README
├── 📄 docker-compose.yml                            # Docker container orchestration
│
├── 📁 docs/                                         # Project documentation
│   ├── munlink_guide_v2.md                          # Main specification
│   ├── AI_QUICK_START.md                            # AI validation checklist
│   ├── GUIDE_IMPROVEMENTS.md                        # Change summary
│   ├── DOCUMENTATION_SUMMARY.md                     # Documentation overview
│   ├── PROJECT_FILE_STRUCTURE.md                    # This file
│   ├── API_REFERENCE.md                             # API endpoint documentation
│   └── DEPLOYMENT_GUIDE.md                          # Deployment instructions
│
├── 📁 data/                                         # Data files
│   ├── philippines_full_locations.json              # ✅ Philippine location data (REQUIRED)
│   └── zambales_municipalities.json                 # Filtered Zambales data (optional)
│
├── 📁 assets/                                       # Static assets
│   ├── 📁 logos/
│   │   ├── 📁 municipalities/                       # Municipal logos
│   │   │   ├── 📁 Botolan/
│   │   │   │   ├── Ph_seal_zambales_botolan.png
│   │   │   │   ├── Flag_of_Botolan,_Zambales.png
│   │   │   │   └── ...
│   │   │   ├── 📁 Cabangan/
│   │   │   ├── 📁 Candelaria/
│   │   │   ├── 📁 Castillejos/
│   │   │   ├── 📁 Iba/
│   │   │   ├── 📁 Masinloc/
│   │   │   ├── 📁 Palauig/
│   │   │   ├── 📁 SanAntonio/
│   │   │   ├── 📁 San Felipe/
│   │   │   ├── 📁 San Marcelino/
│   │   │   ├── 📁 San Narciso/
│   │   │   ├── 📁 Santa-Cruz/
│   │   │   └── 📁 Subic/
│   │   └── 📁 zambales/                             # Province logo
│   │       ├── Seal_of_Province_of_Zambales.svg
│   │       ├── 32px-Seal_of_Province_of_Zambales.svg.png
│   │       ├── 64px-Seal_of_Province_of_Zambales.svg.png
│   │       ├── 128px-Seal_of_Province_of_Zambales.svg.png
│   │       ├── 256px-Seal_of_Province_of_Zambales.svg.png
│   │       └── 512px-Seal_of_Province_of_Zambales.svg.png
│   ├── 📁 images/
│   │   ├── 📁 ui/
│   │   │   ├── Nature.jpg                           # Hero background
│   │   │   └── Reference.jpg
│   │   └── 📁 landmarks/                            # Municipality landmarks
│   │       ├── botolan_mt_pinatubo.png
│   │       ├── cabangan_municipal.png
│   │       ├── candelaria_municipal.png
│   │       ├── castillejos_magsaysay_house.jpg
│   │       ├── iba_municipal.png
│   │       ├── masinloc_church.png
│   │       ├── palauig_municipal.png
│   │       ├── san_antonio_municipal.png
│   │       ├── san_felipe_arko.png
│   │       ├── san_marcelino_municipal.png
│   │       ├── san_narciso_municipal.png
│   │       ├── santa_cruz_municipal.png
│   │       └── subic_municipality.png
│   └── 📁 fonts/                                    # Custom fonts (if any)
│
├── 📁 apps/                                         # Monorepo applications
│   │
│   ├── 📁 api/                                      # Backend API (Flask)
│   │   ├── 📄 app.py                                # Main application entry point
│   │   ├── 📄 config.py                             # Configuration management
│   │   ├── 📄 requirements.txt                      # Python dependencies
│   │   ├── 📄 requirements-dev.txt                  # Development dependencies
│   │   ├── 📄 Dockerfile                            # Docker configuration
│   │   ├── 📄 .env.example                          # Environment template
│   │   ├── 📄 wsgi.py                               # WSGI entry point (Gunicorn)
│   │   │
│   │   ├── 📁 models/                               # SQLAlchemy database models
│   │   │   ├── __init__.py                          # Models package init
│   │   │   ├── base.py                              # Base model class
│   │   │   ├── user.py                              # User, ResidentProfile
│   │   │   ├── municipality.py                      # Municipality model
│   │   │   ├── marketplace.py                       # Item, Transaction, Message
│   │   │   ├── document.py                          # DocumentType, DocumentRequest
│   │   │   ├── benefit.py                           # Benefit, BenefitApplication
│   │   │   ├── issue.py                             # Issue model
│   │   │   ├── qr_code.py                           # QRCode, QRValidation
│   │   │   ├── announcement.py                      # Announcement model
│   │   │   ├── activity_log.py                      # ActivityLog model
│   │   │   └── notification.py                      # Notification model
│   │   │
│   │   ├── 📁 routes/                               # API route handlers (blueprints)
│   │   │   ├── __init__.py                          # Register all blueprints
│   │   │   ├── auth.py                              # Authentication routes
│   │   │   ├── users.py                             # User management routes
│   │   │   ├── municipalities.py                    # Municipality routes
│   │   │   ├── marketplace.py                       # Marketplace routes
│   │   │   ├── documents.py                         # Document service routes
│   │   │   ├── benefits.py                          # Benefits routes
│   │   │   ├── issues.py                            # Issue reporting routes
│   │   │   ├── qr.py                                # QR validation routes
│   │   │   ├── announcements.py                     # Announcements routes
│   │   │   ├── notifications.py                     # Notifications routes
│   │   │   ├── files.py                             # File upload/download routes
│   │   │   └── admin.py                             # Admin routes (internal)
│   │   │
│   │   ├── 📁 utils/                                # Utility functions
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                              # JWT handling, decorators
│   │   │   ├── validators.py                        # Input validation functions
│   │   │   ├── file_handler.py                      # File upload/download logic
│   │   │   ├── qr_generator.py                      # QR code generation
│   │   │   ├── pdf_generator.py                     # PDF document generation
│   │   │   ├── email_sender.py                      # Email notification service
│   │   │   ├── location_loader.py                   # Load location data from JSON
│   │   │   ├── logo_loader.py                       # Load municipal logos
│   │   │   ├── multi_tenant.py                      # Multi-tenant middleware
│   │   │   ├── ownership.py                         # Data ownership rules
│   │   │   └── constants.py                         # Application constants
│   │   │
│   │   ├── 📁 services/                             # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py                      # Authentication logic
│   │   │   ├── user_service.py                      # User management logic
│   │   │   ├── marketplace_service.py               # Marketplace business logic
│   │   │   ├── document_service.py                  # Document processing logic
│   │   │   ├── benefit_service.py                   # Benefits processing logic
│   │   │   └── notification_service.py              # Notification logic
│   │   │
│   │   ├── 📁 migrations/                           # Database migrations (Alembic)
│   │   │   ├── versions/                            # Migration version files
│   │   │   ├── env.py                               # Migration environment config
│   │   │   ├── script.py.mako                       # Migration template
│   │   │   └── alembic.ini                          # Alembic configuration
│   │   │
│   │   ├── 📁 templates/                            # Email/PDF templates
│   │   │   ├── 📁 email/
│   │   │   │   ├── verification_email.html
│   │   │   │   ├── document_ready.html
│   │   │   │   └── notification.html
│   │   │   └── 📁 pdf/
│   │   │       ├── document_template.html
│   │   │       └── certificate_template.html
│   │   │
│   │   └── 📁 tests/                                # Backend tests
│   │       ├── __init__.py
│   │       ├── conftest.py                          # Pytest configuration
│   │       ├── test_auth.py
│   │       ├── test_users.py
│   │       ├── test_marketplace.py
│   │       ├── test_documents.py
│   │       ├── test_benefits.py
│   │       └── test_issues.py
│   │
│   ├── 📁 web/                                      # Public website (React)
│   │   ├── 📄 package.json                          # Frontend dependencies
│   │   ├── 📄 vite.config.ts                        # Vite configuration
│   │   ├── 📄 tailwind.config.js                    # Tailwind configuration
│   │   ├── 📄 tsconfig.json                         # TypeScript configuration
│   │   ├── 📄 tsconfig.node.json                    # Node TypeScript config
│   │   ├── 📄 postcss.config.js                     # PostCSS configuration
│   │   ├── 📄 index.html                            # HTML entry point
│   │   ├── 📄 .env.example                          # Environment template
│   │   ├── 📄 Dockerfile                            # Docker configuration
│   │   │
│   │   ├── 📁 public/                               # Static public assets
│   │   │   ├── favicon.ico
│   │   │   ├── logo.png
│   │   │   └── robots.txt
│   │   │
│   │   └── 📁 src/                                  # Source code
│   │       ├── 📄 main.tsx                          # App entry point
│   │       ├── 📄 App.tsx                           # Root component
│   │       ├── 📄 index.css                         # Global styles
│   │       ├── 📄 vite-env.d.ts                     # Vite type definitions
│   │       │
│   │       ├── 📁 pages/                            # Page components (routes)
│   │       │   ├── Home.tsx
│   │       │   ├── Login.tsx
│   │       │   ├── Register.tsx
│   │       │   ├── VerifyEmail.tsx
│   │       │   ├── Profile.tsx
│   │       │   ├── Marketplace.tsx
│   │       │   ├── MarketplaceItem.tsx
│   │       │   ├── CreateListing.tsx
│   │       │   ├── MyListings.tsx
│   │       │   ├── Transactions.tsx
│   │       │   ├── Documents.tsx
│   │       │   ├── RequestDocument.tsx
│   │       │   ├── MyDocuments.tsx
│   │       │   ├── Benefits.tsx
│   │       │   ├── ApplyBenefit.tsx
│   │       │   ├── MyApplications.tsx
│   │       │   ├── Issues.tsx
│   │       │   ├── ReportIssue.tsx
│   │       │   ├── MyIssues.tsx
│   │       │   ├── Municipalities.tsx
│   │       │   ├── MunicipalityDetail.tsx
│   │       │   ├── Announcements.tsx
│   │       │   ├── Notifications.tsx
│   │       │   └── NotFound.tsx
│   │       │
│   │       ├── 📁 components/                       # Reusable components
│   │       │   ├── 📁 common/                       # Generic UI components
│   │       │   │   ├── Button.tsx
│   │       │   │   ├── Card.tsx
│   │       │   │   ├── Input.tsx
│   │       │   │   ├── Textarea.tsx
│   │       │   │   ├── Select.tsx
│   │       │   │   ├── Checkbox.tsx
│   │       │   │   ├── Radio.tsx
│   │       │   │   ├── Modal.tsx
│   │       │   │   ├── Toast.tsx
│   │       │   │   ├── Loading.tsx
│   │       │   │   ├── Spinner.tsx
│   │       │   │   ├── Badge.tsx
│   │       │   │   ├── Avatar.tsx
│   │       │   │   ├── Tabs.tsx
│   │       │   │   ├── Accordion.tsx
│   │       │   │   ├── Pagination.tsx
│   │       │   │   └── Table.tsx
│   │       │   ├── 📁 layout/                       # Layout components
│   │       │   │   ├── Navbar.tsx
│   │       │   │   ├── Footer.tsx
│   │       │   │   ├── Sidebar.tsx
│   │       │   │   ├── Header.tsx
│   │       │   │   └── Container.tsx
│   │       │   ├── 📁 marketplace/                  # Marketplace components
│   │       │   │   ├── ItemCard.tsx
│   │       │   │   ├── ItemGallery.tsx
│   │       │   │   ├── ItemFilters.tsx
│   │       │   │   ├── ItemForm.tsx
│   │       │   │   ├── TransactionCard.tsx
│   │       │   │   ├── TransactionFlow.tsx
│   │       │   │   ├── MessageThread.tsx
│   │       │   │   └── PhotoUpload.tsx
│   │       │   ├── 📁 documents/                    # Document components
│   │       │   │   ├── DocumentTypeCard.tsx
│   │       │   │   ├── DocumentRequestForm.tsx
│   │       │   │   ├── DocumentStatusBadge.tsx
│   │       │   │   ├── DocumentList.tsx
│   │       │   │   └── RequirementsList.tsx
│   │       │   ├── 📁 issues/                       # Issue components
│   │       │   │   ├── IssueCard.tsx
│   │       │   │   ├── IssueForm.tsx
│   │       │   │   ├── IssueStatusBadge.tsx
│   │       │   │   ├── IssueTimeline.tsx
│   │       │   │   └── IssuePhotoGallery.tsx
│   │       │   ├── 📁 benefits/                     # Benefits components
│   │       │   │   ├── BenefitCard.tsx
│   │       │   │   ├── ApplicationForm.tsx
│   │       │   │   ├── ApplicationStatus.tsx
│   │       │   │   └── EligibilityChecker.tsx
│   │       │   └── 📁 auth/                         # Auth components
│   │       │       ├── ProtectedRoute.tsx
│   │       │       ├── LoginForm.tsx
│   │       │       ├── RegisterForm.tsx
│   │       │       └── VerificationNotice.tsx
│   │       │
│   │       ├── 📁 hooks/                            # Custom React hooks
│   │       │   ├── useAuth.ts
│   │       │   ├── useApi.ts
│   │       │   ├── useFileUpload.ts
│   │       │   ├── useMunicipality.ts
│   │       │   ├── useDebounce.ts
│   │       │   ├── useLocalStorage.ts
│   │       │   ├── useNotifications.ts
│   │       │   └── usePagination.ts
│   │       │
│   │       ├── 📁 services/                         # API service layer
│   │       │   ├── api.ts                           # Axios configuration
│   │       │   ├── auth.service.ts
│   │       │   ├── user.service.ts
│   │       │   ├── municipality.service.ts
│   │       │   ├── marketplace.service.ts
│   │       │   ├── document.service.ts
│   │       │   ├── benefit.service.ts
│   │       │   ├── issue.service.ts
│   │       │   ├── notification.service.ts
│   │       │   └── file.service.ts
│   │       │
│   │       ├── 📁 context/                          # React Context providers
│   │       │   ├── AuthContext.tsx
│   │       │   ├── MunicipalityContext.tsx
│   │       │   ├── NotificationContext.tsx
│   │       │   └── ThemeContext.tsx
│   │       │
│   │       ├── 📁 types/                            # TypeScript type definitions
│   │       │   ├── index.ts
│   │       │   ├── user.ts
│   │       │   ├── municipality.ts
│   │       │   ├── marketplace.ts
│   │       │   ├── document.ts
│   │       │   ├── benefit.ts
│   │       │   ├── issue.ts
│   │       │   ├── notification.ts
│   │       │   └── api.ts
│   │       │
│   │       ├── 📁 utils/                            # Utility functions
│   │       │   ├── validators.ts
│   │       │   ├── formatters.ts
│   │       │   ├── constants.ts
│   │       │   ├── helpers.ts
│   │       │   └── dateUtils.ts
│   │       │
│   │       └── 📁 styles/                           # Additional styles
│   │           └── components.css
│   │
│   └── 📁 admin/                                    # Admin dashboard (React)
│       ├── 📄 package.json
│       ├── 📄 vite.config.ts
│       ├── 📄 tailwind.config.js
│       ├── 📄 tsconfig.json
│       ├── 📄 index.html
│       ├── 📄 Dockerfile
│       │
│       ├── 📁 public/
│       │   └── favicon.ico
│       │
│       └── 📁 src/
│           ├── 📄 main.tsx
│           ├── 📄 App.tsx
│           ├── 📄 index.css
│           │
│           ├── 📁 pages/                            # Admin pages
│           │   ├── AdminLogin.tsx
│           │   ├── Dashboard.tsx
│           │   ├── UserManagement.tsx
│           │   ├── VerifyUsers.tsx
│           │   ├── CreateAdmin.tsx
│           │   ├── DocumentReview.tsx
│           │   ├── IssueManagement.tsx
│           │   ├── BenefitReview.tsx
│           │   ├── MarketplaceModeration.tsx
│           │   ├── AnnouncementManager.tsx
│           │   └── Analytics.tsx
│           │
│           ├── 📁 components/                       # Admin components
│           │   ├── 📁 dashboard/
│           │   │   ├── StatsCard.tsx
│           │   │   ├── ActivityFeed.tsx
│           │   │   ├── QuickActions.tsx
│           │   │   └── Charts.tsx
│           │   ├── 📁 users/
│           │   │   ├── UserTable.tsx
│           │   │   ├── UserDetail.tsx
│           │   │   ├── IDVerificationModal.tsx
│           │   │   └── AdminCreationForm.tsx
│           │   ├── 📁 documents/
│           │   │   ├── DocumentQueue.tsx
│           │   │   ├── DocumentReviewModal.tsx
│           │   │   └── DocumentGenerator.tsx
│           │   └── 📁 common/
│           │       └── (shared with web app)
│           │
│           ├── 📁 services/                         # Admin API services
│           │   ├── admin.service.ts
│           │   ├── analytics.service.ts
│           │   └── moderation.service.ts
│           │
│           └── 📁 types/
│               └── admin.ts
│
├── 📁 packages/                                     # Shared packages
│   │
│   ├── 📁 ui/                                       # Shared React components
│   │   ├── 📄 package.json
│   │   ├── 📄 tsconfig.json
│   │   ├── 📁 src/
│   │   │   ├── index.ts                             # Export all components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Form.tsx
│   │   │   └── Badge.tsx
│   │   └── 📁 styles/
│   │       └── components.css
│   │
│   ├── 📁 types/                                    # Shared TypeScript types
│   │   ├── 📄 package.json
│   │   ├── 📄 tsconfig.json
│   │   └── 📁 src/
│   │       ├── index.ts
│   │       ├── user.ts
│   │       ├── municipality.ts
│   │       ├── marketplace.ts
│   │       ├── document.ts
│   │       ├── benefit.ts
│   │       ├── issue.ts
│   │       └── api.ts
│   │
│   ├── 📁 utils/                                    # Shared utilities
│   │   ├── 📄 package.json
│   │   ├── 📄 tsconfig.json
│   │   └── 📁 src/
│   │       ├── index.ts
│   │       ├── validators.ts                        # TypeScript validators
│   │       ├── formatters.ts
│   │       ├── constants.ts
│   │       └── dateUtils.ts
│   │
│   └── 📁 database/                                 # Shared database utilities (Python)
│       ├── 📄 __init__.py
│       ├── 📄 connection.py                         # Database connection
│       └── 📄 schemas.py                            # Pydantic schemas
│
├── 📁 tools/                                        # Development tools & scripts
│   └── 📁 scripts/
│       ├── seed_data.py                             # Seed municipalities from JSON
│       ├── create_admin_account.py                  # CLI admin creation
│       ├── migrate_database.py                      # Database migration helper
│       ├── backup_database.sh                       # Database backup script
│       ├── restore_database.sh                      # Database restore script
│       ├── setup_production.sh                      # Production setup automation
│       ├── generate_secret_keys.py                  # Generate secure keys
│       └── validate_location_data.py                # Validate location JSON
│
├── 📁 uploads/                                      # File upload storage (Docker volume)
│   └── 📁 zambales/
│       ├── 📁 municipalities/
│       │   ├── 📁 botolan/
│       │   │   ├── 📁 residents/
│       │   │   │   └── 📁 {user_id}/
│       │   │   │       ├── 📁 profile/
│       │   │   │       │   └── profile_{user_id}_{timestamp}.{ext}
│       │   │   │       ├── 📁 government_id/
│       │   │   │       │   └── gov_id_{user_id}_{timestamp}.{ext}
│       │   │   │       └── 📁 documents/
│       │   │   │           └── doc_{request_id}_{timestamp}.{ext}
│       │   │   ├── 📁 issues/
│       │   │   │   └── 📁 {issue_id}/
│       │   │   │       └── issue_{issue_id}_{photo_number}_{timestamp}.{ext}
│       │   │   ├── 📁 documents/
│       │   │   │   └── 📁 generated/
│       │   │   │       └── {document_id}.pdf
│       │   │   └── 📁 admin/
│       │   ├── 📁 cabangan/
│       │   ├── 📁 candelaria/
│       │   ├── 📁 castillejos/
│       │   ├── 📁 iba/
│       │   ├── 📁 masinloc/
│       │   ├── 📁 palauig/
│       │   ├── 📁 san_antonio/
│       │   ├── 📁 san_felipe/
│       │   ├── 📁 san_marcelino/
│       │   ├── 📁 san_narciso/
│       │   ├── 📁 santa_cruz/
│       │   └── 📁 subic/
│       └── 📁 marketplace/
│           └── 📁 items/
│               └── 📁 {item_id}/
│                   └── 📁 photos/
│                       ├── item_{item_id}_1_{timestamp}.{ext}
│                       ├── item_{item_id}_2_{timestamp}.{ext}
│                       └── ... (max 5 photos)
│
└── 📁 .github/                                      # GitHub configuration
    └── 📁 workflows/
        ├── ci.yml                                   # Continuous Integration
        ├── deploy.yml                               # Auto-deployment
        └── test.yml                                 # Automated testing
```

---

## 📝 Important Files Explained

### Root Level Files

```yaml
package.json:
  Purpose: Workspace configuration for monorepo
  Contains: Workspace definitions, root scripts
  
turbo.json:
  Purpose: Turborepo build pipeline configuration
  Contains: Build order, caching, parallelization rules

docker-compose.yml:
  Purpose: Container orchestration for local development
  Contains: Database, API, Web, Admin service definitions

.env:
  Purpose: Environment variables
  WARNING: NEVER commit this file (listed in .gitignore)
  
.env.example:
  Purpose: Template for environment variables
  Action: Copy to .env and fill in actual values
```

### Data Files

```yaml
data/philippines_full_locations.json:
  Purpose: Official Philippine location data
  Usage: Seed database with 13 Zambales municipalities
  Source: PSGC (Philippine Standard Geographic Code)
  Critical: REQUIRED for system to function
```

### Asset Files

```yaml
assets/logos/municipalities/:
  Purpose: Official municipal seals and logos
  Usage: Document generation, UI branding
  Format: PNG files in various sizes
  
assets/logos/zambales/:
  Purpose: Provincial seal
  Usage: Cross-municipal documents, branding
  
assets/images/ui/:
  Purpose: UI assets (hero backgrounds, etc.)
  Usage: Landing page, marketing materials
  
assets/images/landmarks/:
  Purpose: Municipality trademark photos
  Usage: Municipality profile pages
```

---

## 🎯 File Naming Conventions

### Uploaded Files

```bash
# Profile photos
profile_{user_id}_{timestamp}.{ext}
Example: profile_123_20250113120000.jpg

# Government IDs
gov_id_{user_id}_{timestamp}.{ext}
Example: gov_id_123_20250113120000.pdf

# Supporting documents
doc_{request_id}_{timestamp}.{ext}
Example: doc_456_20250113120000.pdf

# Marketplace item photos
item_{item_id}_{photo_number}_{timestamp}.{ext}
Example: item_789_1_20250113120000.jpg

# Issue photos
issue_{issue_id}_{photo_number}_{timestamp}.{ext}
Example: issue_101_1_20250113120000.jpg

# Generated documents
{document_id}.pdf
Example: 789abc123def.pdf
```

---

## 🚀 Quick Setup Commands

### Initialize Project Structure

```bash
# Create root directory
mkdir munlink-zambales
cd munlink-zambales

# Create main directories
mkdir -p apps/{api,web,admin}
mkdir -p packages/{ui,types,utils,database}
mkdir -p tools/scripts
mkdir -p docs
mkdir -p data
mkdir -p assets/{logos/{municipalities,zambales},images/{ui,landmarks}}
mkdir -p uploads/zambales/{municipalities,marketplace}

# Create municipality directories
cd uploads/zambales/municipalities
for mun in botolan cabangan candelaria castillejos iba masinloc palauig san_antonio san_felipe san_marcelino san_narciso santa_cruz subic; do
  mkdir -p $mun/{residents,issues,documents/generated,admin}
done
cd ../../../

# Initialize root package.json
npm init -y

# Initialize Git
git init
```

### Setup Apps

```bash
# Backend (Flask)
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install flask sqlalchemy psycopg2-binary flask-jwt-extended bcrypt
pip freeze > requirements.txt

# Frontend - Web
cd ../web
npm create vite@latest . -- --template react-ts
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Frontend - Admin
cd ../admin
npm create vite@latest . -- --template react-ts
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 📊 File Count Statistics

```yaml
Total Directories: ~150
Total Files (estimated): ~300+

By Category:
  Python Files: ~50
  TypeScript/TSX Files: ~150
  Configuration Files: ~30
  Documentation Files: ~10
  Asset Files: ~60+
  
By App:
  apps/api: ~60 files
  apps/web: ~120 files
  apps/admin: ~80 files
  packages: ~30 files
  tools: ~10 files
  docs: ~10 files
```

---

## ✅ Validation Checklist

Before starting development, ensure:

```yaml
✓ Root package.json exists with workspaces
✓ turbo.json configured for build pipeline
✓ docker-compose.yml configured
✓ .env.example exists (don't commit .env)
✓ data/philippines_full_locations.json exists
✓ assets/logos/municipalities/ has 13 subdirectories
✓ uploads/ directory created with proper structure
✓ All apps/ subdirectories initialized
✓ Documentation files copied to docs/
```

---

## 🔗 Related Documentation

- **munlink_guide_v2.md** - Complete specification
- **AI_QUICK_START.md** - Quick validation checklist
- **GUIDE_IMPROVEMENTS.md** - What changed from v1
- **DOCUMENTATION_SUMMARY.md** - Documentation overview

---

**Last Updated**: 2025-10-13  
**Version**: 2.0

