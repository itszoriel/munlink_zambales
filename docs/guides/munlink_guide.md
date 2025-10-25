# MunLink Zambales: Complete AI Development Guide
## Municipal Digital Governance Platform - Definitive Project Specification

> **AI DEVELOPER NOTE**: This document contains the complete specification for MunLink Zambales. Follow ALL details exactly as specified. Do not add features not mentioned here. Do not remove any existing features. This is the single source of truth for the project scope.

## Executive Summary

MunLink Zambales is a comprehensive digital governance platform specifically designed for the 13 municipalities within Zambales Province. This multi-tenant civic technology solution provides unified digital infrastructure for municipal government services while enabling cross-municipal community engagement through a shared marketplace platform.

## 🎯 PROJECT SCOPE AND BOUNDARIES

> **CRITICAL AI CONSTRAINT**: This project is LIMITED to Zambales Province ONLY. Do not suggest features for other provinces or national-level functionality.

### Geographic Coverage
**Province**: Zambales (ONLY)
**Administrative Units**: 13 municipalities only (EXACTLY 13, no more, no less)
- Complete municipal-level service coverage
- Cross-municipal marketplace functionality
- Inter-municipal resource sharing through marketplace
- **Location Data Source**: All location data must be extracted from `data/PH_LOC.json`
- **Data Filtering**: System must filter and use ONLY Zambales province data from PH_LOC.json

### 🚫 SCOPE LIMITATIONS (AI MUST NOT ADD)
- NO provincial-level administration
- NO national government integration
- NO other provinces beyond Zambales
- NO cities or municipalities outside Zambales province
- NO location data from sources other than `data/PH_LOC.json`
- NO features not explicitly listed in this guide

### Municipal Structure
The platform operates on a single-tier administrative structure:
1. **Municipal Level**: 13 individual municipalities with complete administrative independence and cross-municipal marketplace integration

**Zambales Municipalities Covered (EXACT LIST - AI MUST USE THESE NAMES):**
1. Botolan
2. Cabangan
3. Candelaria
4. Castillejos
5. Iba
6. Masinloc
7. Palauig
8. San Antonio
9. San Felipe
10. San Marcelino
11. San Narciso
12. Santa Cruz
13. Subic

> **AI NOTE**: Use these EXACT municipality names. Do not modify or add to this list.

## 🔧 TECHNICAL ARCHITECTURE (AI IMPLEMENTATION RULES)

> **AI DEVELOPER RULES**: 
> - Use EXACTLY the technologies listed below
> - Do not suggest alternative frameworks
> - Follow the specified architecture patterns
> - Maintain the exact file structure shown

### Project Structure: Monorepo Architecture

**Architecture Type**: Turborepo-style monorepo with separated apps and shared packages

```
munlink-zambales/                          # Root monorepo
├── apps/
│   ├── web/                              # Main public website (residents)
│   ├── admin/                            # Internal admin dashboard
│   └── api/                              # Backend API (Flask)
├── packages/
│   ├── database/                         # Shared database models
│   ├── ui/                               # Shared UI components
│   ├── types/                            # Shared TypeScript types
│   └── utils/                            # Shared utilities
├── tools/
│   └── scripts/                          # Setup and utility scripts
├── docker-compose.yml                    # Container orchestration
├── turbo.json                            # Turborepo configuration
└── package.json                          # Root package configuration
```

### Core Technology Stack (MANDATORY)

**Backend Infrastructure (apps/api/)**
- **Framework**: Python Flask with Flask-RESTful extensions
- **Database Layer**: PostgreSQL for production, SQLite for development with SQLAlchemy ORM
- **Authentication**: JWT implementation with bcrypt password hashing and token blacklisting
- **File Management**: Municipal-based hierarchical storage system with 10MB upload limits

**Frontend - Public Website (apps/web/)**
- **Framework**: React 18 with TypeScript for enhanced type safety
- **Build System**: Vite - providing lightning-fast development server and build optimization
- **Styling**: Tailwind CSS implementing utility-first design principles
- **Architecture**: Mobile-first responsive design with role-based access control
- **Integration**: 100% API-driven architecture with no mock data dependencies

**Frontend - Admin Dashboard (apps/admin/)**
- **Framework**: React 18 with TypeScript
- **Build System**: Vite
- **Styling**: Tailwind CSS (shared with main website)
- **Purpose**: Internal admin operations (user verification, admin creation, municipal management)
- **Network**: Internal network only - NOT accessible from public internet
- **Shared Components**: Uses UI components from packages/ui/

**Shared Packages (packages/)**
- **packages/database/**: SQLAlchemy models shared between API and scripts
- **packages/ui/**: React components used by both web and admin apps
- **packages/types/**: TypeScript type definitions shared across frontend apps
- **packages/utils/**: Validation functions, formatters, constants (Python + TypeScript)

### Database Architecture

The platform implements a streamlined data architecture with 15 core models:

**Core Models with Relationships**
```
User ──┬── ResidentProfile
       ├── Municipality (many-to-one)
       ├── Items (one-to-many)
       ├── Transactions (one-to-many as buyer/seller)
       ├── DocumentRequests (one-to-many)
       ├── BenefitApplications (one-to-many)
       └── Issues (one-to-many)

Municipality ──┬── Users (one-to-many)
               ├── DocumentTypes (one-to-many)
               ├── Benefits (one-to-many)
               └── Issues (one-to-many)

Item ──┬── User (many-to-one)
       ├── Category (many-to-one)
       ├── Photos (one-to-many)
       └── Transactions (one-to-many)

Transaction ──┬── Item (many-to-one)
              ├── Buyer (many-to-one User)
              └── Seller (many-to-one User)
```

**Location Management**
- Province: Zambales (single province focus)
- Municipalities: 13 municipalities with complete administrative coverage
- PSGC Integration: Philippine Standard Geographic Code compliance
- **Data Source**: Location data must be sourced from `data/PH_LOC.json`
- **Geographic Scope**: Only Zambales province and its 13 municipalities (NO other provinces or cities)
- **Logo Sources**: 
  - Municipal logos: `Municipality Logo/` directory
  - Zambales province logo: `Zambales Logo/` directory

**Core Models**
- **User Management**: User, ResidentProfile, JWTBlacklist
- **Location Hierarchy**: Province, Municipality models
- **Services**: Item, Transaction, Benefit, BenefitApplication
- **Document System**: DocumentType, DocumentRequest
- **Issue Reporting**: Issue (municipal-level emergency and community issues)
- **Communication**: Announcement, ActivityLog
- **QR System**: QRCode, QRValidation

### Multi-Tenant Architecture

**Municipal Level Isolation**
- Complete data separation between the 13 municipalities
- Individual municipal administrative access
- Isolated file storage and user management per municipality

**Cross-Municipal Integration**
- Cross-municipal marketplace functionality
- Shared resources and services across all 13 municipalities
- Inter-municipal communication through marketplace

## 📋 FEATURE SPECIFICATIONS (AI MUST IMPLEMENT EXACTLY)

> **CRITICAL**: Implement ALL features listed below. Do not add features not mentioned. Do not remove any features.

### 1. Multi-Municipal Infrastructure

**Data Isolation Rules**
- User data belongs to home municipality only
- Document requests processed by home municipality only
- Issues reported to home municipality only
- Benefits managed by home municipality only

**Cross-Municipal Sharing**
- Marketplace items visible across all municipalities
- User profiles visible in marketplace context only
- Transaction history maintained per user regardless of municipality

### 2. Zambales Community Marketplace

**Core Functionality**
- Item listing with photos and description
- Category browsing: electronics, furniture, clothing, books, tools, appliances, vehicles, sports, toys, other
- Search and filters: category, municipality, transaction type, keyword
- Contact system: in-app messaging only (no external contact sharing)
- Status tracking with specific workflows

**Transaction Types and Workflows**

**DONATE Transaction Flow:**
```
1. AVAILABLE → User posts item for donation
2. CLAIMED → Another user requests the item (first-come-first-served)
3. CONTACT_EXCHANGE → System facilitates contact exchange
4. DELIVERED → Donor marks as delivered
5. COMPLETED → Auto-complete after 7 days or recipient confirmation
```

**LEND Transaction Flow:**
```
1. AVAILABLE → User posts item with lending duration
2. REQUESTED → Another user requests to borrow (with proposed dates)
3. APPROVED → Owner approves the request
4. BORROWED → Item marked as borrowed on pickup
5. RETURNED → Item marked as returned
6. COMPLETED → Auto-complete after return confirmation
```

**SELL Transaction Flow:**
```
1. AVAILABLE → User posts item with fixed price
2. INTERESTED → Buyer expresses interest
3. NEGOTIATING → Price/terms negotiation (optional)
4. AGREED → Terms agreed upon
5. SOLD → Seller marks as sold after payment/pickup
6. COMPLETED → Transaction completed
```

**Business Rules**
- **Claiming**: First-come-first-served for donations
- **Timeout Rules**: 
  - Claimed items revert to available after 48 hours if not contacted
  - Contact exchange expires after 7 days if not completed
- **Photo Limits**: Maximum 5 photos per item
- **Contact Privacy**: No external contact info sharing - all communication through platform
- **Cross-Municipal**: Items visible across all 13 municipalities

**User Experience Features**
- **Social Feed**: Facebook-like browsing with "User shared [item]" format
- **Item Gallery**: Multiple photos with swipe/navigation
- **User Attribution**: Profile name and municipality display
- **Search & Filter**: Category, location, transaction type, price range (for sell items)
- **Responsive Design**: Mobile-first with touch-friendly interface

### 3. Municipal Document Services

**Document Processing Workflow**

**Request Submission Process:**
1. User selects document type from municipal catalog
2. System displays specific requirements for selected document
3. User uploads required supporting documents
4. User selects delivery method (pickup or digital)
5. System validates file formats and completeness
6. Request submitted to municipal admin queue

**Admin Review Process:**
1. Admin reviews uploaded documents for authenticity
2. Admin cross-references with municipal records (manual process)
3. Admin approves/rejects with specific reason codes
4. If approved, system generates document with municipal branding (using logos from `Municipality Logo/` directory)
5. User receives notification of completion

**Document Categories and Requirements**

**BARANGAY LEVEL DOCUMENTS (Physical Pickup Only):**
- **Barangay Clearance**
  - Requirements: Proof of residency + Government ID
  - Processing: 1-3 business days
  - Pickup: Barangay office only
  - Expiration: 6 months

- **Barangay Indigency**
  - Requirements: Purpose statement + Government ID
  - Processing: 1-3 business days
  - Pickup: Barangay office only
  - Expiration: 1 year

- **Barangay Attestation**
  - Requirements: Purpose statement +  Government ID
  - Processing: 1-3 business days
  - Pickup: Barangay office only
  - Expiration: 6 months

**MUNICIPAL LEVEL DOCUMENTS (Pickup OR Digital Delivery):**

**Identity/Residency Certificates:**
- **Certificate of Residency**
  - Requirements: Utility bills (last 3 months) + Government ID
  - Processing: 3-5 business days
  - Expiration: 6 months (physical) / 30 days (digital)

- **Certificate of Good Moral Character**
  - Requirements: Character references + Government ID
  - Processing: 5-7 business days
  - Expiration: 1 year (physical) / 30 days (digital)

**Economic Status Certificates:**
- **Certificate of Indigency**
  - Requirements: Income documents + Government ID
  - Processing: 5-7 business days
  - Expiration: 1 year (physical) / 30 days (digital)

- **Certificate of No Property**
  - Requirements: Self-declaration + Government ID
  - Processing: 3-5 business days
  - Expiration: 6 months (physical) / 30 days (digital)

- **Certificate of No Income**
  - Requirements: Unemployment proof + Family composition + Government ID
  - Processing: 5-7 business days
  - Expiration: 6 months (physical) / 30 days (digital)

**Family Status Certificates:**
- **Certificate of Solo Parent**
  - Requirements: Children's birth certificates + Single parent proof + Government ID
  - Processing: 7-10 business days
  - Expiration: 1 year (physical) / 30 days (digital)

**Business/Property Permits:**
- **Business Permit**
  - Requirements: Business registration + Location proof + Government ID
  - Processing: 10-15 business days
  - Expiration: 1 year (no digital option)

- **Building Permit**
  - Requirements: Property documents + Construction plans + Government ID
  - Processing: 15-30 business days
  - Expiration: 2 years (no digital option)

- **Occupancy Permit**
  - Requirements: Building permit + Completion certificate + Government ID
  - Processing: 10-15 business days
  - Expiration: Permanent (no digital option)

**Specialized Permits:**
- **Zoning Clearance**
  - Requirements: Property documents + Land use plan + Government ID
  - Processing: 7-10 business days
  - Expiration: 1 year (no digital option)

- **Sanitary Permit**
  - Requirements: Business permit + Health certificate + Government ID
  - Processing: 5-7 business days
  - Expiration: 1 year (no digital option)

**Tax/Clearance Documents:**
- **Tax Clearance**
  - Requirements: Tax payment records + Government ID
  - Processing: 3-5 business days
  - Expiration: 1 year (physical) / 30 days (digital)

**ID Documents:**
- **Senior Citizen ID**
  - Requirements: Birth certificate + Age proof (60+) + Government ID
  - Processing: 7-10 business days
  - Expiration: Permanent (no digital option)

- **PWD ID**
  - Requirements: Medical certificate + PWD assessment + Government ID
  - Processing: 10-15 business days
  - Expiration: 3 years (no digital option)

**Program-Specific IDs:**
- **4Ps ID**
  - Requirements: 4Ps enrollment + Family composition + Government ID
  - Processing: 5-7 business days
  - Expiration: Per program cycle (no digital option)

**Document Delivery System**

**Physical Pickup (All Documents):**
- Document printed with official municipal letterhead
- Municipal seal/dry stamp applied
- QR code embedded for verification
- Pickup at municipal office during business hours
- Valid government ID required for pickup

**Digital Delivery (Selected Documents Only):**
- PDF generated with municipal branding (using logos from `Municipality Logo/` directory)
- QR code embedded for online verification
- 30-day expiration from generation
- Download link sent via email
- Multiple downloads allowed within validity period

**Document Expiration and Renewal**

**Expiration Rules:**
- Digital documents: 30 days from generation
- Physical documents: As specified per document type
- QR codes become invalid after document expiration
- Expired documents cannot be downloaded or verified

**Renewal Process:**
1. User can request renewal 7 days before expiration
2. System sends expiration warnings at 7 days and 1 day
3. Renewal may require updated supporting documents
4. New QR code generated for renewed documents

**Quality Control Standards**

**Document Validation Requirements:**
- All uploaded files must be clear, readable images or PDFs
- Government IDs must show full face and details
- Utility bills must be within 3 months of request date
- Income documents must be recent and official
- Medical certificates must be current and licensed provider

**Rejection Reasons (Standardized):**
- Unclear/unreadable documents
- Expired supporting documents
- Incomplete requirements
- Inconsistent information
- Invalid government ID
- Insufficient proof of residency
- Does not meet eligibility criteria

### 4. Municipal Issue Reporting System

**Issue Categories**
- **Infrastructure**: Roads, bridges, public buildings, utilities
- **Public Safety**: Street lighting, traffic, emergency access
- **Environmental**: Waste management, pollution, flooding
- **Administrative**: Service complaints, process issues

**Issue Workflow**
```
1. REPORTED → User submits issue with photos/description
2. ACKNOWLEDGED → Municipal admin acknowledges receipt (24 hours)
3. INVESTIGATING → Admin assigns to relevant department
4. IN_PROGRESS → Work begins with progress updates
5. RESOLVED → Issue marked as completed
6. VERIFIED → User confirms resolution (optional)
```

**Issue Submission Requirements**
- Clear description of the problem
- Specific location within municipality
- At least 1 photo (maximum 5 photos)
- Category selection
- Urgency level: Low, Medium, High, Emergency

**Admin Response Standards**
- Acknowledgment: Within 24 hours
- Investigation start: Within 3 business days
- Progress updates: Weekly for ongoing issues
- Resolution target: 30 days for non-emergency issues

### 5. Municipal Benefits Management

**Benefit Program Structure**
- **Program Name**: Official program title
- **Description**: Detailed program information
- **Eligibility Criteria**: Specific requirements
- **Required Documents**: List of supporting documents
- **Application Period**: Start and end dates
- **Benefit Amount/Type**: What beneficiaries receive
- **Maximum Beneficiaries**: Program capacity limits

**Application Workflow**
```
1. SUBMITTED → User submits application with documents
2. UNDER_REVIEW → Admin reviews eligibility and documents
3. DOCUMENT_REQUEST → Admin may request additional documents
4. APPROVED/DENIED → Final decision with reason
5. DISBURSEMENT → Benefits provided to approved applicants
6. COMPLETED → Application process finished
```

**Common Municipal Benefits**
- Senior citizen assistance programs
- PWD support programs
- Solo parent assistance
- Educational scholarships
- Livelihood programs
- Emergency assistance
- Medical assistance
- Housing assistance

### 6. QR Code Validation System

**QR Code Data Structure**
```json
{
  "document_id": "unique_identifier",
  "municipality_code": "municipality_psgc",
  "document_type": "certificate_type",
  "issued_date": "YYYY-MM-DD",
  "expiry_date": "YYYY-MM-DD",
  "recipient_name": "full_name",
  "verification_hash": "security_hash"
}
```

**QR Code Generation Process:**
1. Create JSON payload with document details
2. Generate unique verification hash using document_id + municipality_code + timestamp
3. Encode JSON as QR code using standard QR library
4. Embed QR code in PDF document
5. Store QR data in database for validation

**Validation Process**
1. Scan QR code to extract data
2. Verify document exists in municipal database
3. Check expiration status
4. Validate security hash
5. Display verification result with document details

**Security Features**
- Unique verification hash per document
- Timestamp validation
- Municipality verification
- Anti-tampering detection
- Audit trail for all validations

## 🔌 COMPLETE API DOCUMENTATION (AI IMPLEMENTATION GUIDE)

> **API RULES**: 
> - Implement EXACTLY these endpoints
> - Use the specified HTTP methods and parameters
> - Include all error handling
> - Follow exact response formats

### Authentication & User Management

```
POST /api/auth/register
Body: {
  "email": "string",
  "username": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "municipality_id": "integer",
  "phone": "string",
  "date_of_birth": "YYYY-MM-DD",
  "address": "string (optional)"
}
Response: {
  "message": "Registration successful. Please check your email to verify your account before gaining access to the platform.",
  "email_sent": true
}

POST /api/auth/verify-email
Body: {
  "token": "string (from email)"
}
Response: {
  "token": "jwt_token",
  "user": {...},
  "municipality": {...},
  "message": "Email verified successfully. Please upload your government ID for full access to municipal services."
}

POST /api/auth/resend-verification
Body: {
  "email": "string"
}
Response: {
  "message": "Verification email sent successfully. Please check your inbox."
}

POST /api/auth/login
Body: {
  "email_or_username": "string",
  "password": "string"
}
Response: {
  "token": "jwt_token",
  "user": {...}
}

Error Response (Unverified Email):
{
  "error": {
    "code": "EMAIL_NOT_VERIFIED",
    "message": "Please verify your email address before logging in",
    "details": {
      "email": ["Email verification required"],
      "resend_available": true
    }
  }
}

POST /api/auth/logout
Headers: {"Authorization": "Bearer jwt_token"}
Response: {"message": "Successfully logged out"}

GET /api/users/profile
Headers: {"Authorization": "Bearer jwt_token"}
Response: {
  "user": {...},
  "municipality": {...},
  "stats": {...}
}

PUT /api/users/profile
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "first_name": "string",
  "last_name": "string",
  "phone": "string",
  "address": "string"
}

POST /api/users/profile/photo
Headers: {"Authorization": "Bearer jwt_token"}
Body: FormData with "photo" file
Response: {"photo_url": "string"}

POST /api/users/profile/government-id
Headers: {"Authorization": "Bearer jwt_token"}
Body: FormData with "government_id" file
Response: {
  "id_url": "string",
  "message": "Government ID uploaded successfully. Awaiting admin verification."
}
```

### Municipal Management

```
GET /api/municipalities
Response: {
  "municipalities": [
    {
      "id": 1,
      "name": "Iba",
      "code": "psgc_code",
      "is_capital": true
    },
    ...
  ]
}

GET /api/municipalities/{id}
Response: {
  "municipality": {...},
  "services": [...],
  "contact_info": {...}
}

GET /api/municipalities/{id}/stats
Headers: {"Authorization": "Bearer jwt_token"}
Response: {
  "residents": 1234,
  "active_issues": 56,
  "pending_documents": 78,
  "marketplace_items": 90
}
```

### Cross-Municipal Marketplace

```
GET /api/marketplace/items
Query: ?category=string&municipality=int&type=string&search=string&page=int
Response: {
  "items": [
    {
      "id": 1,
      "title": "string",
      "description": "string",
      "category": "electronics",
      "transaction_type": "donate",
      "status": "available",
      "photos": ["url1", "url2"],
      "user": {
        "name": "string",
        "municipality": "string"
      },
      "created_at": "timestamp"
    }
  ],
  "pagination": {...}
}

POST /api/marketplace/items
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "title": "string",
  "description": "string",
  "category": "string",
  "transaction_type": "donate|lend|sell",
  "price": "decimal (for sell only)",
  "lending_duration": "integer (for lend only)"
}

PUT /api/marketplace/items/{id}
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "title": "string",
  "description": "string",
  "status": "available|claimed|delivered"
}

DELETE /api/marketplace/items/{id}
Headers: {"Authorization": "Bearer jwt_token"}
Response: {"message": "Item deleted successfully"}

POST /api/marketplace/items/{id}/photos
Headers: {"Authorization": "Bearer jwt_token"}
Body: FormData with "photos" files (max 5)
Response: {"photo_urls": ["url1", "url2"]}

GET /api/marketplace/items/{id}/photos
Response: {"photos": ["url1", "url2"]}

DELETE /api/marketplace/items/{id}/photos/{photo_id}
Headers: {"Authorization": "Bearer jwt_token"}
Response: {"message": "Photo deleted successfully"}

POST /api/marketplace/transactions
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "item_id": "integer",
  "action": "claim|request|buy",
  "message": "string (optional)"
}

GET /api/marketplace/transactions
Headers: {"Authorization": "Bearer jwt_token"}
Response: {
  "transactions": [
    {
      "id": 1,
      "item": {...},
      "status": "pending",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}

PUT /api/marketplace/transactions/{id}
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "status": "approved|rejected|completed",
  "notes": "string (optional)"
}

GET /api/marketplace/feed
Query: ?page=int&municipality=int
Response: {
  "feed": [
    {
      "type": "item_shared",
      "user": {...},
      "item": {...},
      "timestamp": "datetime"
    }
  ]
}
```

### Municipal Document Services

```
GET /api/documents/types
Query: ?municipality_id=int
Response: {
  "document_types": [
    {
      "id": 1,
      "name": "Certificate of Residency",
      "category": "municipal",
      "requirements": [...],
      "processing_days": "3-5",
      "digital_available": true,
      "expiry_physical": "6 months",
      "expiry_digital": "30 days"
    }
  ]
}

POST /api/documents/requests
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "document_type_id": "integer",
  "delivery_method": "pickup|digital",
  "supporting_documents": ["file_ids"],
  "notes": "string (optional)"
}

GET /api/documents/requests
Headers: {"Authorization": "Bearer jwt_token"}
Query: ?status=string&page=int
Response: {
  "requests": [
    {
      "id": 1,
      "document_type": {...},
      "status": "pending",
      "delivery_method": "digital",
      "submitted_at": "timestamp",
      "processed_at": "timestamp",
      "expires_at": "timestamp"
    }
  ]
}

PUT /api/documents/requests/{id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "status": "approved|rejected|processing",
  "admin_notes": "string",
  "rejection_reason": "string (if rejected)"
}

POST /api/documents/generate
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "request_id": "integer"
}
Response: {
  "document_id": "string",
  "qr_code": "string",
  "download_url": "string (if digital)"
}

GET /api/documents/download/{id}
Headers: {"Authorization": "Bearer jwt_token"}
Response: PDF file or {"error": "Document expired/not found"}

GET /api/documents/expired
Headers: {"Authorization": "Bearer jwt_token"}
Response: {
  "expired_documents": [...]
}

POST /api/documents/{id}/renew
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "updated_documents": ["file_ids (if required)"]
}

GET /api/documents/expiring
Headers: {"Authorization": "Bearer jwt_token"}
Response: {
  "expiring_soon": [...]
}
```

### Municipal Benefits Management

```
GET /api/benefits/programs/{municipality_id}
Response: {
  "programs": [
    {
      "id": 1,
      "name": "Senior Citizen Assistance",
      "description": "string",
      "eligibility": [...],
      "required_documents": [...],
      "application_period": {...},
      "max_beneficiaries": 100,
      "current_beneficiaries": 45
    }
  ]
}

POST /api/benefits/applications
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "program_id": "integer",
  "supporting_documents": ["file_ids"],
  "application_data": {...}
}

GET /api/benefits/applications
Headers: {"Authorization": "Bearer jwt_token"}
Response: {
  "applications": [...]
}

PUT /api/benefits/applications/{id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "status": "approved|denied|under_review|document_request",
  "admin_notes": "string",
  "requested_documents": ["string (if document_request)"]
}
```

### Municipal Issue Reporting

```
POST /api/issues/submit
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "title": "string",
  "description": "string",
  "category": "infrastructure|public_safety|environmental|administrative",
  "location": "string",
  "urgency": "low|medium|high|emergency",
  "photos": ["file_ids"]
}

GET /api/issues/municipality/{id}
Query: ?status=string&category=string&page=int
Response: {
  "issues": [
    {
      "id": 1,
      "title": "string",
      "status": "reported",
      "category": "infrastructure",
      "urgency": "medium",
      "photos": [...],
      "submitted_by": "anonymous",
      "created_at": "timestamp"
    }
  ]
}

PUT /api/issues/{id}/status
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "status": "acknowledged|investigating|in_progress|resolved",
  "admin_notes": "string",
  "estimated_completion": "date (optional)"
}

POST /api/issues/{id}/photos
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: FormData with "photos" files
Response: {"photo_urls": [...]}

POST /api/issues/{id}/updates
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "update": "string",
  "photos": ["file_ids (optional)"]
}
```

### QR Code System

```
POST /api/qr/validate
Body: {
  "qr_data": "string"
}
Response: {
  "valid": true,
  "document": {
    "type": "Certificate of Residency",
    "recipient": "Juan Dela Cruz",
    "municipality": "Iba",
    "issued_date": "2024-01-15",
    "expiry_date": "2024-07-15"
  }
}

GET /api/qr/{token}
Response: {
  "document_info": {...},
  "verification_status": "valid|expired|invalid"
}

POST /api/qr/generate
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "document_id": "string",
  "document_type": "string",
  "recipient_name": "string",
  "expiry_date": "date"
}

GET /api/qr/municipal/{municipality_id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Query: ?status=string&page=int
Response: {
  "qr_codes": [...]
}
```

### File Upload System

```
POST /api/files/upload
Headers: {"Authorization": "Bearer jwt_token"}
Body: FormData with "file" and "category"
Response: {
  "file_id": "string",
  "filename": "string",
  "url": "string",
  "size": 1024000
}

GET /api/files/{file_id}
Headers: {"Authorization": "Bearer jwt_token"}
Response: File content or {"error": "File not found"}

GET /api/files/user/{user_id}
Headers: {"Authorization": "Bearer jwt_token"}
Query: ?category=string&page=int
Response: {
  "files": [
    {
      "file_id": "string",
      "filename": "string",
      "category": "profile|document|item|issue",
      "url": "string",
      "size": 1024000,
      "uploaded_at": "timestamp"
    }
  ],
  "pagination": {...}
}

DELETE /api/files/{file_id}
Headers: {"Authorization": "Bearer jwt_token"}
Response: {"message": "File deleted successfully"}
```

### Announcements System

```
GET /api/announcements
Query: ?municipality_id=int&page=int&active=boolean
Response: {
  "announcements": [
    {
      "id": 1,
      "title": "string",
      "content": "string",
      "municipality": {...},
      "is_active": true,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "pagination": {...}
}

GET /api/announcements/{id}
Response: {
  "announcement": {...},
  "municipality": {...}
}

POST /api/announcements
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "title": "string",
  "content": "string",
  "municipality_id": "integer"
}

PUT /api/announcements/{id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "title": "string",
  "content": "string",
  "is_active": "boolean"
}

DELETE /api/announcements/{id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Response: {"message": "Announcement deleted successfully"}
```

### Activity Logs System

```
GET /api/activity-logs
Headers: {"Authorization": "Bearer jwt_token"}
Query: ?user_id=int&action=string&page=int&date_from=date&date_to=date
Response: {
  "logs": [
    {
      "id": 1,
      "user": {...},
      "action": "login|logout|item_created|document_requested|issue_reported",
      "details": {...},
      "ip_address": "string",
      "user_agent": "string",
      "created_at": "timestamp"
    }
  ],
  "pagination": {...}
}

POST /api/activity-logs
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "action": "string",
  "details": {...}
}
```

### Municipal Admin Dashboard

```
GET /api/admin/dashboard/{municipality_id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Response: {
  "overview": {
    "total_residents": 1234,
    "active_residents": 1100,
    "pending_documents": 45,
    "active_issues": 23,
    "marketplace_items": 156,
    "benefit_applications": 67
  },
  "recent_activity": [
    {
      "type": "document_request|issue_report|benefit_application|marketplace_item",
      "user": {...},
      "description": "string",
      "timestamp": "datetime"
    }
  ],
  "statistics": {
    "documents_processed_this_month": 89,
    "issues_resolved_this_month": 34,
    "marketplace_transactions": 45,
    "benefit_disbursements": 12
  },
  "pending_actions": [
    {
      "type": "document_review|issue_assignment|benefit_approval",
      "count": 15,
      "priority": "high|medium|low"
    }
  ]
}

GET /api/admin/analytics/{municipality_id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Query: ?period=week|month|quarter|year
Response: {
  "user_registrations": [...],
  "document_requests": [...],
  "issue_reports": [...],
  "marketplace_activity": [...],
  "benefit_applications": [...]
}

### Admin Account Management (Internal Only)

```
POST /api/admin/create-admin
Headers: {
  "Authorization": "Bearer jwt_token (admin only)",
  "X-Admin-Secret": "ADMIN_SECRET_KEY"
}
Body: {
  "username": "string",
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "municipality_id": "integer",
  "phone": "string",
  "date_of_birth": "YYYY-MM-DD",
  "password": "string (optional - auto-generated if empty)"
}
Response: {
  "message": "Admin account created successfully",
  "admin": {
    "id": 1,
    "username": "string",
    "email": "string",
    "municipality": {...},
    "temporary_password": "string (if auto-generated)"
  }
}

# Security Requirements:
# - Must be called from internal network (Docker internal network)
# - Requires valid admin JWT token
# - Requires X-Admin-Secret header matching ADMIN_SECRET_KEY
# - Creates user with: role='admin', email_verified=true, is_verified=true
```

### Admin User ID Verification

```
GET /api/users/admin/{municipality_id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Query: ?verification_status=pending|approved|rejected&page=int&per_page=int
Response: {
  "users": [
    {
      "id": 1,
      "username": "string",
      "email": "string",
      "full_name": "string",
      "date_of_birth": "YYYY-MM-DD",
      "government_id_url": "string",
      "id_verification_status": "pending",
      "created_at": "timestamp"
    }
  ],
  "pagination": {...}
}

PUT /api/users/admin/{user_id}/verify-id
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "status": "approved|rejected",
  "notes": "string (optional)"
}
Response: {
  "message": "User ID verification updated successfully",
  "user": {...}
}

GET /api/users/admin/{user_id}/government-id
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Response: File content or {"error": "Government ID not found"}
```

### Marketplace Contact System

```
POST /api/marketplace/messages
Headers: {"Authorization": "Bearer jwt_token"}
Body: {
  "transaction_id": "integer",
  "message": "string",
  "message_type": "text|image|file"
}

GET /api/marketplace/messages/{transaction_id}
Headers: {"Authorization": "Bearer jwt_token"}
Query: ?page=int
Response: {
  "messages": [
    {
      "id": 1,
      "sender": {...},
      "message": "string",
      "message_type": "text",
      "attachments": [...],
      "created_at": "timestamp",
      "is_read": false
    }
  ],
  "pagination": {...}
}

PUT /api/marketplace/messages/{message_id}/read
Headers: {"Authorization": "Bearer jwt_token"}
Response: {"message": "Message marked as read"}

GET /api/marketplace/conversations
Headers: {"Authorization": "Bearer jwt_token"}
Response: {
  "conversations": [
    {
      "transaction_id": 1,
      "item": {...},
      "other_user": {...},
      "last_message": {...},
      "unread_count": 3,
      "updated_at": "timestamp"
    }
  ]
}
```

### Notification System

```
GET /api/notifications
Headers: {"Authorization": "Bearer jwt_token"}
Query: ?type=string&unread_only=boolean&page=int
Response: {
  "notifications": [
    {
      "id": 1,
      "title": "string",
      "message": "string",
      "notification_type": "document_ready|issue_update|benefit_approved|marketplace_contact",
      "related_id": 123,
      "is_read": false,
      "created_at": "timestamp"
    }
  ],
  "pagination": {...}
}

PUT /api/notifications/{id}/read
Headers: {"Authorization": "Bearer jwt_token"}
Response: {"message": "Notification marked as read"}

PUT /api/notifications/read-all
Headers: {"Authorization": "Bearer jwt_token"}
Response: {"message": "All notifications marked as read"}

GET /api/notifications/unread-count
Headers: {"Authorization": "Bearer jwt_token"}
Response: {
  "unread_count": 5
}
```

### Document Template Management

```
GET /api/admin/document-templates/{municipality_id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Response: {
  "templates": [
    {
      "id": 1,
      "name": "Certificate of Residency Template",
      "municipality": {...},
      "is_active": true,
      "created_at": "timestamp"
    }
  ]
}

POST /api/admin/document-templates
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "name": "string",
  "municipality_id": "integer",
  "template_content": "string",
  "header_image": "string",
  "footer_text": "string"
}

PUT /api/admin/document-templates/{id}
Headers: {"Authorization": "Bearer jwt_token (admin only)"}
Body: {
  "name": "string",
  "template_content": "string",
  "is_active": "boolean"
}
```

## 🔄 BUSINESS LOGIC AND WORKFLOWS

### Document Processing Workflow (Complete)

**Request Submission Process:**
1. User selects document type from municipal catalog
2. System displays specific requirements for selected document
3. User uploads required supporting documents
4. User selects delivery method (pickup or digital)
5. System validates file formats and completeness
6. Request submitted to municipal admin queue
7. **Activity log created**: "document_requested"
8. **Notification sent**: Admin receives new request notification

**Admin Review Process:**
1. Admin reviews uploaded documents for authenticity
2. Admin cross-references with municipal records (manual process)
3. **Three possible outcomes:**
   - **APPROVED**: System generates document with municipal branding
   - **REJECTED**: Admin provides specific rejection reason
   - **NEEDS_MORE_INFO**: Admin requests additional documents

**Document Generation Process:**
1. System retrieves municipal logo from `Municipality Logo/` directory
   - Use municipal seal files (marked as SEAL in directory structure)
   - Default to 256px size for document generation
   - Fallback to 512px if 256px not available
   - Use provincial Zambales logo for cross-municipal documents
2. PDF generated with official letterhead and municipal seal
3. QR code embedded with unique verification hash
4. Document stored in municipal file system
5. **If digital delivery**: Download link generated with 30-day expiry
6. **If physical pickup**: Document queued for printing and stamping
7. **Notification sent**: User receives completion notification
8. **Activity log created**: "document_generated"

**Document Rejection Process:**
1. Admin provides specific rejection reason from standardized list
2. User receives rejection notification with reason
3. **User can resubmit** with corrections within 30 days
4. **Activity log created**: "document_rejected"
5. **Notification sent**: User receives rejection notification

### Marketplace Communication Workflow

**Contact Exchange Process:**
1. User A expresses interest in User B's item (claim/request/buy)
2. System creates transaction record with "pending" status
3. **Both users receive notification** with transaction ID
4. **Contact exchange facilitated** through in-app messaging system:
   - Users can message each other using transaction ID as context
   - No external contact info (phone/email) is ever shared
   - All communication happens within the platform's messaging system
5. Users can exchange messages, photos, and files within transaction context
6. **Activity logs created** for both users: "marketplace_contact_initiated"

**Transaction Completion Process:**
1. **For DONATE**: Donor marks as delivered → Auto-complete after 7 days
2. **For LEND**: Item marked as borrowed → Returned → Auto-complete
3. **For SELL**: Seller marks as sold after payment/pickup → Auto-complete
4. **Activity logs created**: "transaction_completed"
5. **Notifications sent**: Both users receive completion notification

### User Verification Workflow (Two-Tier System)

**Registration and Verification Process:**

1. **User Registration:**
   - User provides basic information (name, email, phone, municipality, date of birth)
   - Account created with `email_verified = false` and `is_verified = false`
   - Email verification token generated and sent to user's email
   - User receives message: "Please check your email to verify your account"

2. **Email Verification (Tier 1 - Basic Access):**
   - User clicks verification link in email
   - `email_verified = true` and `email_verification_token` cleared
   - User receives JWT token and gains BASIC ACCESS to platform
   - User can now access: marketplace browsing, profile management, basic features

3. **Government ID Upload (Tier 2 - Full Access):**
   - User uploads government ID (driver's license, passport, national ID, etc.)
   - File stored in municipal file system with secure naming convention
   - `government_id_url` field updated in user record
   - `id_verification_status = 'pending'`
   - User receives confirmation: "ID uploaded successfully. Awaiting admin verification."

4. **Admin Review Process:**
   - Admin receives notification of new ID upload
   - Admin reviews uploaded government ID for:
     - Document authenticity and clarity
     - Name matches registration information
     - Document is valid and not expired
     - Photo matches user (if applicable)
   - Admin makes decision: APPROVED or REJECTED

5. **Admin Verification Decision:**
   - **APPROVED**: 
     - `is_verified = true`
     - `id_verification_status = 'approved'`
     - User receives notification: "Your account has been fully verified"
     - User gains FULL ACCESS to all municipal services
   - **REJECTED**:
     - `id_verification_status = 'rejected'`
     - `id_verification_notes` contains rejection reason
     - User receives notification with specific rejection reason
     - User can upload new ID document for re-verification

6. **Re-verification Process:**
   - User can upload new government ID if previous was rejected
   - Process repeats from step 4
   - No limit on re-verification attempts

**Access Levels:**

**NO ACCESS (Unverified Email):**
- Cannot login to platform
- Must verify email first

**READ_ONLY_MARKETPLACE ACCESS (Under 18 or No Age Info):**
- ✅ View announcements
- ✅ Update profile information
- ✅ Upload profile photo
- ✅ View municipality information
- ✅ Browse marketplace items (read-only)
- ✅ View item details and search
- ❌ Create marketplace listings
- ❌ Participate in transactions
- ❌ Request documents
- ❌ Apply for benefits
- ❌ Report issues

**BASIC ACCESS (18+ Years Old, Email Verified, Admin Not Verified):**
- ✅ Browse marketplace items
- ✅ View item details and search
- ✅ Update profile information
- ✅ Upload profile photo
- ✅ View announcements
- ❌ Create marketplace listings
- ❌ Request documents
- ❌ Apply for benefits
- ❌ Report issues

**FULL ACCESS (18+ Years Old, Email + Admin Verified):**
- ✅ All basic access features
- ✅ Create marketplace listings
- ✅ Complete marketplace transactions
- ✅ Request municipal documents
- ✅ Apply for benefit programs
- ✅ Report municipal issues
- ✅ Access all municipal services

**Business Rules:**
- Email verification is required for any platform access
- Users under 18 can register and browse marketplace in read-only mode
- Users under 18 cannot create listings or participate in transactions
- Users 18+ can create marketplace listings after email verification
- Admin verification is required for municipal services (18+ only)
- Age-based benefits (Senior Citizen) automatically check date of birth against eligibility
- All verification activities are logged for audit purposes

### User Municipality Transfer Process

**When User Changes Municipality:**
1. **Profile Update**: User updates municipality in profile
2. **Data Migration**: 
   - User data remains in original municipality
   - New municipality assignment takes effect immediately
   - Cross-municipal marketplace access maintained
3. **Document Requests**: New requests go to new municipality
4. **Existing Documents**: Remain valid with original municipality branding
5. **Issues**: New issues reported to new municipality
6. **Benefits**: Can apply for benefits in new municipality only
7. **Activity log created**: "municipality_transferred"

### Expired Document Handling

**Digital Document Expiration:**
1. **30 days after generation**: Document becomes inaccessible
2. **QR codes invalidated**: Cannot be verified after expiry
3. **User notification**: 7 days and 1 day before expiry
4. **Renewal process**: User can request renewal with updated documents
5. **Activity log created**: "document_expired"

**Physical Document Expiration:**
1. **Per document type**: As specified in document requirements
2. **No system expiry**: Physical documents don't expire in system
3. **QR validation**: Still works for verification purposes
4. **Replacement requests**: Users can request new copies

### Deactivated User Handling

**When User Account is Deactivated:**
1. **Marketplace Items**: 
   - Items marked as "unavailable"
   - Existing transactions continue with contact info preserved
   - Items can be reactivated if user account is restored
2. **Document Requests**: 
   - Pending requests remain in admin queue
   - Completed documents remain accessible
3. **Issues**: 
   - Reported issues remain in system
   - Admin can still update status
4. **Benefits**: 
   - Pending applications remain in review
   - Approved benefits continue as scheduled
5. **Activity log created**: "user_deactivated"

## 🚨 ERROR HANDLING AND EDGE CASES

### Standard HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate data)
- 422: Unprocessable Entity (business logic errors)
- 500: Internal Server Error

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": {
      "field": ["error message"]
    }
  }
}
```

### Specific Error Scenarios

**Document Processing Errors:**
```json
{
  "error": {
    "code": "DOCUMENT_REJECTED",
    "message": "Document request rejected",
    "details": {
      "rejection_reason": "Incomplete supporting documents",
      "required_documents": ["Updated utility bill", "Valid government ID"]
    }
  }
}
```

**Marketplace Errors:**
```json
{
  "error": {
    "code": "ITEM_UNAVAILABLE",
    "message": "Item is no longer available",
    "details": {
      "reason": "Already claimed by another user",
      "alternative_items": [...]
    }
  }
}
```

**File Upload Errors:**
```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File exceeds maximum size limit",
    "details": {
      "max_size": "10MB",
      "current_size": "15MB"
    }
  }
}
```

**Municipality Access Errors:**
```json
{
  "error": {
    "code": "MUNICIPALITY_ACCESS_DENIED",
    "message": "Access denied to municipality data",
    "details": {
      "user_municipality": "Iba",
      "requested_municipality": "Botolan"
    }
  }
}
```

### Edge Case Handling

**Concurrent Document Requests:**
- System prevents duplicate requests for same document type within 24 hours
- Error: "DUPLICATE_REQUEST" with existing request details

**Marketplace Item Conflicts:**
- First-come-first-served for donations
- System prevents multiple claims on same item
- Error: "ITEM_ALREADY_CLAIMED" with claim timestamp

**File Storage Issues:**
- Automatic cleanup of orphaned files after 30 days
- Error handling for disk space issues
- Fallback to cloud storage if local storage full

**Municipality Data Inconsistencies:**
- Validation against `data/PH_LOC.json` on startup
- Error logging for data mismatches
- Fallback to hardcoded municipality list if JSON invalid

**QR Code Validation Failures:**
- Graceful handling of corrupted QR codes
- Error: "INVALID_QR_CODE" with suggested actions
- Audit trail for all validation attempts

**User Session Management:**
- Automatic logout after 24 hours of inactivity
- Token refresh mechanism for active users
- Error: "SESSION_EXPIRED" with redirect to login

**Database Connection Issues:**
- Connection pooling with automatic retry
- Graceful degradation for read-only operations
- Error: "SERVICE_UNAVAILABLE" with estimated recovery time

## 🔍 DATA VALIDATION AND BUSINESS RULES

### Input Validation Standards

**User Registration Validation:**
```python
# Email validation
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
EMAIL_MAX_LENGTH = 255

# Username validation
USERNAME_REGEX = r'^[a-zA-Z0-9._-]{3,30}$'
USERNAME_MIN_LENGTH = 3
USERNAME_MAX_LENGTH = 30

# Phone validation (Philippine format)
PHONE_REGEX = r'^(\+63|0)[0-9]{10}$'
PHONE_MAX_LENGTH = 20

# Name validation
NAME_REGEX = r'^[a-zA-Z\s\'-]+$'
NAME_MIN_LENGTH = 2
NAME_MAX_LENGTH = 100

# Date of birth validation
DATE_OF_BIRTH_MIN_AGE = 0  # No minimum age for registration
DATE_OF_BIRTH_MAX_AGE = 120  # Maximum reasonable age
MARKETPLACE_MIN_AGE = 18  # Minimum age for marketplace access

# Password validation
PASSWORD_MIN_LENGTH = 8
PASSWORD_REQUIREMENTS = {
    'min_length': 8,
    'require_uppercase': True,
    'require_lowercase': True,
    'require_digit': True,
    'require_special_char': False  # Optional for better UX
}

# Government ID validation
GOVERNMENT_ID_ALLOWED_TYPES = ['jpg', 'jpeg', 'png', 'pdf']
GOVERNMENT_ID_MAX_SIZE = 5 * 1024 * 1024  # 5MB
```

**File Upload Validation:**
```python
# File size limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_PHOTOS_PER_ITEM = 5

# Allowed file types
ALLOWED_EXTENSIONS = {
    'images': ['jpg', 'jpeg', 'png', 'gif'],
    'documents': ['pdf', 'doc', 'docx'],
    'all': ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
}

# File validation rules
def validate_file_upload(file, category):
    # Check file extension
    # Check file size
    # Scan for malicious content
    # Verify file type matches extension
    # Validate image dimensions (if image)
    pass
```

**Document Request Validation:**
```python
# Document type validation
VALID_DOCUMENT_TYPES = [
    'Certificate of Residency',
    'Certificate of Indigency',
    'Business Permit',
    # ... all 22 document types
]

# Delivery method validation
VALID_DELIVERY_METHODS = ['pickup', 'digital']

# Supporting document validation
def validate_supporting_documents(documents, document_type):
    required_docs = get_required_documents(document_type)
    # Validate all required documents are present
    # Validate document quality and readability
    # Check document expiration dates
    pass
```

**Marketplace Item Validation:**
```python
# Item title validation
ITEM_TITLE_MIN_LENGTH = 5
ITEM_TITLE_MAX_LENGTH = 200

# Description validation
DESCRIPTION_MAX_LENGTH = 1000

# Price validation (for sell items)
PRICE_MIN_VALUE = 0.01
PRICE_MAX_VALUE = 999999.99

# Category validation
VALID_CATEGORIES = [
    'electronics', 'furniture', 'clothing', 'books',
    'tools', 'appliances', 'vehicles', 'sports', 'toys', 'other'
]

# Transaction type validation
VALID_TRANSACTION_TYPES = ['donate', 'lend', 'sell']
```

### Business Rule Validation

**Municipality Access Rules:**
```python
def validate_municipality_access(user, target_municipality):
    # Users can only access their own municipality data
    # Except for marketplace (cross-municipal)
    # Admins can access their municipality only
    if user.municipality_id != target_municipality and user.role != 'admin':
        raise MunicipalityAccessError()
```

**Document Request Rules:**
```python
def validate_document_request(user, document_type, municipality):
    # User must belong to the municipality
    if user.municipality_id != municipality:
        raise InvalidMunicipalityError()
    
    # Check for duplicate requests within 24 hours
    if has_recent_request(user, document_type, 24):
        raise DuplicateRequestError()
    
    # Validate document type is available for municipality
    if not is_document_available(document_type, municipality):
        raise DocumentNotAvailableError()
```

**Marketplace Transaction Rules:**
```python
def validate_marketplace_transaction(user, item, action):
    # User cannot transact with their own items
    if user.id == item.user_id:
        raise SelfTransactionError()
    
    # Item must be available
    if item.status != 'available':
        raise ItemNotAvailableError()
    
    # Check for existing pending transactions
    if has_pending_transaction(item):
        raise PendingTransactionError()
```

### Data Consistency Rules

**User Data Consistency:**
- User municipality must exist in municipalities table
- User email must be unique across all municipalities
- User username must be unique across all municipalities
- User phone must be unique within municipality
- Profile photo must be valid file URL

**Document Data Consistency:**
- Document request must reference valid document type
- Supporting documents must be uploaded before submission
- QR codes must be unique across all municipalities
- Document expiration must be calculated correctly

**Marketplace Data Consistency:**
- Item photos must be valid file URLs
- Transaction status must follow defined workflow
- Messages must be associated with valid transactions
- User attribution must be preserved in marketplace context

### Audit Trail Requirements

**Mandatory Activity Logging:**
```python
# User actions that must be logged
LOGGED_ACTIONS = [
    'user_login', 'user_logout', 'user_register',
    'document_requested', 'document_approved', 'document_rejected',
    'item_created', 'item_claimed', 'transaction_completed',
    'issue_reported', 'issue_resolved',
    'benefit_applied', 'benefit_approved', 'benefit_denied',
    'profile_updated', 'municipality_changed'
]

# Admin actions that must be logged
ADMIN_LOGGED_ACTIONS = [
    'document_reviewed', 'document_generated', 'user_verified',
    'issue_assigned', 'benefit_processed', 'announcement_created'
]
```

**Data Retention Policies:**
- Activity logs: 2 years
- Expired documents: 1 year after expiry
- Deleted items: 30 days (soft delete)
- User sessions: 24 hours
- QR validation logs: 1 year

This comprehensive validation framework ensures data integrity, prevents common errors, and maintains audit trails for all system operations.

## 👥 USER ROLES AND PERMISSIONS MATRIX

> **USER ROLE RULES**: 
> - Implement EXACTLY these user types and permissions
> - Each role has specific access levels
> - Do not add additional user roles

### User Types and Access Levels

**Public (No Authentication Required)**
- View municipality information
- Browse marketplace (read-only)
- View public announcements
- Access registration page

**Resident (Authenticated Municipal Residents)**

*Profile Management:*
- ✅ Update personal information
- ✅ Upload profile photo
- ✅ Change password
- ✅ View activity history

*Marketplace (18+ Only):*
- ✅ Create item listings (donate, lend, sell)
- ✅ Browse all municipality items
- ✅ Claim/request items
- ✅ Manage own transactions
- ✅ Upload item photos
- ✅ Contact other users through platform

*Read-Only Marketplace Access (Under 18):*
- ✅ View announcements
- ✅ Update profile information
- ✅ Upload profile photo
- ✅ Browse marketplace items (read-only)
- ✅ View item details and search
- ❌ Create marketplace listings
- ❌ Participate in transactions
- ❌ No municipal services access

*Documents (18+ Only):*
- ✅ Request documents from home municipality
- ✅ Upload supporting documents
- ✅ Download approved documents
- ✅ View request history and status
- ❌ Access other users' documents

*Benefits (18+ Only):*
- ✅ View available programs in home municipality
- ✅ Submit benefit applications
- ✅ Track application status
- ✅ Upload required documents

*Issues (18+ Only):*
- ✅ Report issues in home municipality
- ✅ Upload photos for issue reports
- ✅ View own submitted issues
- ✅ View public issue status (anonymized)

*QR Validation:*
- ✅ Validate any QR code
- ✅ View validation results

*Notifications:*
- ✅ View all notifications
- ✅ Mark notifications as read
- ✅ Receive system notifications

*Activity Logs:*
- ✅ View own activity history
- ✅ Track account actions

**Municipal Admin (Municipal Government Officials)**

*User Management:*
- ✅ View municipality residents
- ✅ Verify resident accounts
- ✅ Review and approve/reject government ID uploads
- ✅ Reset user passwords
- ✅ View user activity logs
- ✅ Access uploaded government ID documents
- ❌ Access residents from other municipalities

*Document Processing:*
- ✅ Review document requests
- ✅ Approve/reject applications
- ✅ Generate official documents
- ✅ Manage document templates
- ✅ View processing statistics
- ✅ Handle document renewals

*Benefits Management:*
- ✅ Create/edit benefit programs
- ✅ Review applications
- ✅ Approve/deny benefits
- ✅ Manage program budgets and limits
- ✅ Generate beneficiary reports

*Issue Management:*
- ✅ View all municipality issues
- ✅ Update issue status
- ✅ Assign issues to departments
- ✅ Add progress updates and photos
- ✅ Communicate with reporters

*Marketplace Moderation:*
- ✅ Remove inappropriate listings
- ✅ View all marketplace activity in municipality
- ✅ Suspend problematic users
- ✅ Generate marketplace reports

*Analytics & Reports:*
- ✅ View municipal dashboard
- ✅ Generate service statistics
- ✅ Export resident data
- ✅ Monitor system usage
- ✅ Track performance metrics

*QR Management:*
- ✅ Generate QR codes for documents
- ✅ Validate municipal QR codes
- ✅ Extend QR validity periods
- ✅ View QR verification logs

*Announcements:*
- ✅ Create/edit announcements
- ✅ Manage announcement visibility
- ✅ View announcement statistics

*Activity Monitoring:*
- ✅ View all municipality activity logs
- ✅ Monitor user actions
- ✅ Track system usage patterns

*Notifications:*
- ✅ Send system notifications
- ✅ Manage notification templates
- ✅ View notification delivery statistics

*Document Templates:*
- ✅ Create/edit document templates
- ✅ Manage template versions
- ✅ Preview generated documents

### 🔐 ADMIN ACCOUNT CREATION (SECURITY-CRITICAL)

> **SECURITY POLICY**: Admin accounts are created through the **Internal Admin Dashboard** (apps/admin/), accessible ONLY via internal network or SSH tunnel. NO public API endpoint exists for admin registration.

**Creation Method**: Internal Admin Dashboard (apps/admin/) - Network-isolated web interface

**Architecture Overview:**
```
Public Internet
     ↓
apps/web/ (Port 80/443)           → Residents access this
     ✅ Public website
     ❌ NO admin creation

Internal Network Only
     ↓
apps/admin/ (Port 3001)            → Admins access this
     ✅ Admin dashboard
     ✅ Admin creation interface
     ❌ NOT accessible from internet
     ↓
apps/api/ (Port 5000)              → Backend API
     ✅ Has secure admin creation endpoint
     ✅ Requires internal network + secret key
```

**Security Rationale:**
- **Network Isolation**: Admin dashboard runs on internal network only (Docker internal network)
- **No Public Access**: Port 3001 NOT exposed to internet, blocked by firewall
- **SSH Tunnel Required**: External access only via secure SSH tunnel
- **Double Authentication**: Requires both admin login + special secret key
- **No Privilege Escalation**: Impossible for residents to access admin dashboard
- **Audit Trail**: All admin creations logged with IP address and timestamp
- **Compliance**: Meets security best practices for government digital systems

**Admin Creation Process:**

**Method 1: SSH Tunnel (Recommended for Remote Access)**
```bash
# From your local computer, create SSH tunnel
ssh -L 3001:localhost:3001 admin@munlink-server.com

# Open browser and access admin dashboard
# Browser: http://localhost:3001

# Login to admin dashboard
# Navigate to: Admin Creation → Create New Admin
# Fill form with admin details
# Submit → Admin created instantly
```

**Method 2: Direct Server Access (On-Site)**
```bash
# SSH into production server
ssh admin@munlink-server.com

# Admin dashboard already running on port 3001
# Access via server browser or SSH tunnel
```

**Method 3: VPN Access (If Configured)**
```bash
# Connect to municipality VPN
# Access: http://internal-admin.munlink:3001
```

**Method 4: CLI Script (Fallback)**
```bash
# Navigate to tools directory
cd tools/scripts

# Run admin creation script
python create_admin_account.py

# Interactive prompts for admin details
```

**Admin Dashboard Features (apps/admin/):**
- ✅ User-friendly web form for admin creation
- ✅ Full input validation (email, phone, username, etc.)
- ✅ Municipality selection dropdown (13 Zambales municipalities)
- ✅ Secure password generation or custom password input
- ✅ Real-time validation feedback
- ✅ Pre-verified status (email_verified=true, is_verified=true)
- ✅ Automatic role assignment (role='admin')
- ✅ Success/error notifications
- ✅ Activity logging for audit trail

**API Endpoint (Internal Only):**
```python
# apps/api/routes/admin.py

POST /api/admin/create-admin
Headers: {
  "Authorization": "Bearer jwt_token (current admin)",
  "X-Admin-Secret": "ADMIN_SECRET_KEY from .env"
}
Body: {
  "username": "string",
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "municipality_id": "integer",
  "phone": "string",
  "date_of_birth": "YYYY-MM-DD",
  "password": "string (optional - auto-generated if empty)"
}

# Security checks:
# 1. Verify request from internal network IP
# 2. Validate X-Admin-Secret header
# 3. Verify current user is admin
# 4. All checks pass → Create admin
```

**Network Security Configuration:**

**Docker Compose Setup:**
```yaml
# docker-compose.yml
services:
  api:
    build: ./apps/api
    ports:
      - "5000:5000"
    networks:
      - internal
  
  web:
    build: ./apps/web
    ports:
      - "80:3000"              # Public website
    networks:
      - public
      - internal
  
  admin:
    build: ./apps/admin
    ports:
      - "3001:3000"            # Admin dashboard
    networks:
      - internal               # Internal network ONLY
    environment:
      - ADMIN_SECRET_KEY=${ADMIN_SECRET_KEY}
      - VITE_API_BASE_URL=http://api:5000

networks:
  public:
    driver: bridge
  internal:
    driver: bridge
    internal: true             # Blocks external access
```

**Firewall Rules:**
```bash
# Allow public access to web app
ufw allow 80/tcp
ufw allow 443/tcp

# Block public access to admin dashboard
ufw deny 3001/tcp

# Allow SSH (for tunneling)
ufw allow 22/tcp
```

**Who Can Create Admins:**
1. **Existing Admins**: Can create other admins via internal dashboard
2. **System Administrators**: Can use SSH tunnel to access admin dashboard
3. **Database Administrators**: Can use CLI script as fallback
4. **NOT via Public Website**: Residents have no access to admin creation

**Initial Setup Workflow:**
1. System admin runs `docker-compose up -d` to start all services
2. System admin runs `python tools/scripts/seed_data.py` to populate municipalities
3. System admin runs `python tools/scripts/create_admin_account.py` to create first admin
4. First admin logs into admin dashboard via SSH tunnel
5. First admin creates additional admins for other municipalities via web interface

**Activity Log Entry:**
```json
{
  "action": "admin_account_created",
  "details": {
    "created_by": "admin_username",
    "created_via": "admin_dashboard",
    "municipality": "Municipality Name",
    "role": "admin",
    "verification_status": "pre_approved"
  },
  "ip_address": "10.0.0.5 (internal)",
  "user_agent": "Mozilla/5.0 (Admin Dashboard)"
}
```

**Security Best Practices:**
- ✅ Keep ADMIN_SECRET_KEY secure in .env (never commit to git)
- ✅ Use strong passwords (minimum 12 characters recommended)
- ✅ Document all admin creations for audit purposes
- ✅ Regular review of admin accounts and access logs
- ✅ Enable SSH key-based authentication (disable password auth)
- ✅ Configure VPN for additional security layer
- ✅ Monitor failed login attempts to admin dashboard
- ✅ Implement rate limiting on admin creation endpoint

**Admin Dashboard UI (apps/admin/) Features:**
- 📊 Dashboard: Municipal statistics and recent activity
- 👥 User Management: Verify residents, review government IDs
- 🔐 Admin Creation: Create new municipal administrators
- 📄 Document Management: Bulk approve/reject document requests
- 🚨 Issue Management: Assign and track municipal issues
- 💰 Benefits Management: Review and approve benefit applications
- 📢 Announcements: Create municipality-wide announcements
- 📈 Analytics: View usage statistics and reports

> **⚠️ CRITICAL SECURITY NOTES**: 
> - Admin dashboard (apps/admin/) must NEVER be accessible from public internet
> - Always run on internal Docker network or behind VPN
> - Port 3001 must be blocked by firewall for external access
> - SSH tunnel is the recommended remote access method
> - CLI script (tools/scripts/create_admin_account.py) remains as emergency fallback

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### Monorepo File Structure (Complete)

```
munlink-zambales/                          # Root monorepo directory
├── apps/
│   ├── web/                              # Public website (residents)
│   │   ├── src/
│   │   │   ├── main.tsx                  # App entry point
│   │   │   ├── App.tsx                   # Main app component
│   │   │   ├── components/               # React components
│   │   │   │   ├── common/               # Shared UI elements
│   │   │   │   ├── marketplace/          # Marketplace features
│   │   │   │   ├── documents/            # Document services
│   │   │   │   ├── issues/               # Issue reporting
│   │   │   │   └── benefits/             # Benefits application
│   │   │   ├── pages/                    # Page components
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── Marketplace.tsx
│   │   │   │   └── Profile.tsx
│   │   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── services/                 # API service functions
│   │   │   └── utils/                    # Utility functions
│   │   ├── public/                       # Static assets
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   │
│   ├── admin/                            # Admin dashboard (internal)
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── components/               # Admin-specific components
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── UserManagement.tsx
│   │   │   │   ├── AdminCreation.tsx     # Admin creation form
│   │   │   │   ├── DocumentReview.tsx
│   │   │   │   ├── IssueManagement.tsx
│   │   │   │   └── Analytics.tsx
│   │   │   ├── pages/
│   │   │   │   ├── AdminLogin.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   └── CreateAdmin.tsx       # Admin creation page
│   │   │   └── services/                 # Admin API services
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/                              # Backend API (Flask)
│       ├── app.py                        # Main Flask application
│       ├── config.py                     # Configuration settings
│       ├── requirements.txt              # Python dependencies
│       ├── models/                       # SQLAlchemy models
│       │   ├── __init__.py
│       │   ├── user.py
│       │   ├── municipality.py
│       │   ├── marketplace.py
│       │   ├── documents.py
│       │   ├── benefits.py
│       │   ├── issues.py
│       │   └── qr_codes.py
│       ├── routes/                       # API route handlers
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   ├── municipalities.py
│       │   ├── marketplace.py
│       │   ├── documents.py
│       │   ├── benefits.py
│       │   ├── issues.py
│       │   ├── admin.py                  # Admin routes (internal)
│       │   ├── qr.py
│       │   └── files.py
│       ├── utils/                        # Utility functions
│       │   ├── __init__.py
│       │   ├── auth.py                   # JWT handling
│       │   ├── file_handler.py           # File operations
│       │   ├── qr_generator.py           # QR code generation
│       │   ├── pdf_generator.py          # Document PDF generation
│       │   └── validators.py             # Input validation
│       ├── migrations/                   # Database migrations
│       └── tests/                        # API tests
│
├── packages/                             # Shared packages
│   ├── database/                         # Shared database models
│   │   ├── models.py                     # SQLAlchemy models
│   │   ├── schemas.py                    # Pydantic schemas
│   │   └── connection.py                 # Database connection
│   │
│   ├── ui/                               # Shared React components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   └── Form.tsx
│   │
│   ├── types/                            # Shared TypeScript types
│   │   ├── user.ts
│   │   ├── municipality.ts
│   │   ├── marketplace.ts
│   │   ├── documents.ts
│   │   └── api.ts
│   │
│   └── utils/                            # Shared utilities
│       ├── validators.py                 # Python validators
│       ├── validators.ts                 # TypeScript validators
│       ├── formatters.ts                 # Data formatters
│       └── constants.ts                  # Shared constants
│
├── tools/                                # Scripts and utilities
│   └── scripts/
│       ├── seed_data.py                  # Seed municipalities data
│       ├── create_admin_account.py       # CLI admin creation (fallback)
│       ├── migrate_database.py           # Database migrations
│       └── setup_production.sh           # Production setup script
│
├── data/                                 # Data files
│   └── PH_LOC.json                       # Philippine location data
│
├── Municipality Logo/                    # Official municipal logos (PROVIDED)
│   ├── Botolan/
│   │   ├── Ph_seal_zambales_botolan.png (SEAL)
│   │   ├── Flag_of_Botolan,_Zambales.png
│   │   └── [various sizes: 960px, 1080px]
│   ├── Cabangan/
│   │   ├── Cabangan_Zambales_seal.png (SEAL)
│   │   ├── Cabangan_Zambales 32px.png (logo)
│   │   ├── Flag_of_Cabangan_Zambales.jpg
│   │   └── [seal sizes: 32px, 64px, 128px, 256px, 512px]
│   ├── Candelaria/
│   │   ├── Candelaria_Zambales_Seal.png (SEAL)
│   │   ├── Flag_of_Candelaria,_Zambales.png
│   │   └── [seal sizes: 500px, 960px, 1080px]
│   ├── Castillejos/
│   │   ├── Castillejos_Zambales_seal.png (SEAL)
│   │   ├── Flag_of_Castillejos,_Zambales.png
│   │   └── [various sizes: 960px, 1280px]
│   ├── Iba/
│   │   ├── Iba_Zambales_seal.png (SEAL)
│   │   ├── Flag_of_Iba,_Zambales.png
│   │   └── [various sizes: 960px]
│   ├── Masinloc/
│   │   ├── Masinloc_Zambales_seal.png (SEAL)
│   │   ├── Flag_of_Masinloc,_Zambales.png
│   │   └── [various sizes: 960px]
│   ├── Palauig/
│   │   ├── Palauig_Zambales_seal.png (SEAL)
│   │   ├── Flag_of_Palauig_Zambales.png
│   │   └── [various sizes: 960px, 1279px]
│   ├── San Felipe/
│   │   ├── Seal San Felipe.png (SEAL)
│   │   └── [seal sizes: 32px, 64px, 92px, 128px, 256px]
│   ├── San Marcelino/
│   │   ├── smz-logo-512px.png (LOGO - use as seal)
│   │   ├── san-marcelino_flag.png
│   │   └── [logo sizes: 32px, 64px, 128px, 256px, 500px, 512px]
│   ├── San Narciso/
│   │   ├── san-narciso-seal 512px.png (SEAL)
│   │   ├── Flag_of_San_Narciso,_Zambales.png
│   │   └── [seal sizes: 32px, 64px, 128px, 256px, 960px]
│   ├── SanAntonio/
│   │   └── SanAntonio,102Zambalesjf.png (LOGO - use as seal)
│   ├── Santa-Cruz/
│   │   └── Santa_Cruz_Zambales.png (LOGO - use as seal)
│   └── Subic/
│       ├── subic seal 512px.png (SEAL)
│       ├── Subic Flag.png
│       ├── subic logo.png
│       └── [seal sizes: 32px, 64px, 128px, 256px, 516px, 960px]
│
├── Zambales Logo/                        # Zambales province logo (PROVIDED)
│   ├── Seal_of_Province_of_Zambales.svg
│   ├── 32px-Seal_of_Province_of_Zambales.svg.png
│   └── 512px-Seal_of_Province_of_Zambales.svg.png
│
├── Nature.jpg                           # Hero section background image (PROVIDED)
│   └── Coastal landscape of Zambales with hills, sea, and boats
│
├── docker-compose.yml                      # Container orchestration
├── turbo.json                              # Turborepo configuration  
├── package.json                            # Root package.json (workspace)
├── .env.example                            # Environment variables template
└── uploads/                                # File storage structure (Docker volume)
    └── zambales/
        ├── municipalities/
        │   ├── botolan/
        │   │   ├── residents/
        │   │   │   └── {user_id}/
        │   │   │       ├── profile/
        │   │   │       │   └── profile_{user_id}_{timestamp}.{ext}
        │   │   │       ├── government_id/
        │   │   │       │   └── gov_id_{user_id}_{timestamp}.{ext}
        │   │   │       └── documents/
        │   │   │           └── doc_{request_id}_{timestamp}.{ext}
        │   │   ├── issues/
        │   │   │   └── {issue_id}/
        │   │   │       └── issue_{issue_id}_{photo_number}_{timestamp}.{ext}
        │   │   ├── documents/
        │   │   │   └── generated/
        │   │   └── admin/
        │   ├── cabangan/
        │   │   ├── residents/
        │   │   ├── issues/
        │   │   ├── documents/
        │   │   └── admin/
        │   └── ... (all 13 municipalities)
        └── marketplace/
            ├── items/
            │   └── {item_id}/
            │       ├── photos/
            │       │   ├── item_{item_id}_1_{timestamp}.{ext}
            │       │   ├── item_{item_id}_2_{timestamp}.{ext}
            │       │   └── ... (max 5)
            │       └── metadata.json
            └── categories/
                ├── electronics/
                ├── furniture/
                ├── clothing/
                ├── books/
                ├── tools/
                ├── appliances/
                ├── vehicles/
                ├── sports/
                ├── toys/
                └── other/

**File Naming Conventions:**
- Profile photos: `profile_{user_id}_{timestamp}.{ext}`
- Government ID: `gov_id_{user_id}_{timestamp}.{ext}`
- Document uploads: `doc_{request_id}_{timestamp}.{ext}`
- Item photos: `item_{item_id}_{photo_number}_{timestamp}.{ext}`
- Issue photos: `issue_{issue_id}_{photo_number}_{timestamp}.{ext}`
```

### Database Schema Specifications

**Core Tables (SQLAlchemy Models)**

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    municipality_id INTEGER REFERENCES municipalities(id),
    date_of_birth DATE,
    address TEXT,
    role VARCHAR(50) DEFAULT 'resident',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE, -- admin verification for full access
    profile_photo VARCHAR(255),
    government_id_url VARCHAR(255),
    id_verification_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    id_verification_notes TEXT,
    verified_by INTEGER REFERENCES users(id), -- admin who verified
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Municipalities table
CREATE TABLE municipalities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    psgc_code VARCHAR(20) UNIQUE,
    is_capital BOOLEAN DEFAULT FALSE,
    logo_path VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    office_hours VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- donate, lend, sell
    price DECIMAL(10,2), -- for sell items only
    lending_duration INTEGER, -- days for lend items
    status VARCHAR(20) DEFAULT 'available',
    user_id INTEGER REFERENCES users(id),
    municipality_id INTEGER REFERENCES municipalities(id),
    photos JSON, -- array of photo URLs
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id),
    buyer_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    transaction_type VARCHAR(20) NOT NULL,
    agreed_price DECIMAL(10,2),
    pickup_date DATE,
    return_date DATE, -- for lending
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Document types table
CREATE TABLE document_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- municipal, barangay
    municipality_id INTEGER REFERENCES municipalities(id),
    requirements JSON, -- array of requirement strings
    processing_days VARCHAR(20),
    digital_available BOOLEAN DEFAULT TRUE,
    expiry_physical VARCHAR(50), -- e.g., "6 months"
    expiry_digital VARCHAR(50), -- e.g., "30 days"
    fee DECIMAL(8,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE
);

-- Document requests table
CREATE TABLE document_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    municipality_id INTEGER REFERENCES municipalities(id),
    document_type_id INTEGER REFERENCES document_types(id),
    delivery_method VARCHAR(20) NOT NULL, -- pickup, digital
    status VARCHAR(20) DEFAULT 'pending',
    supporting_documents JSON, -- array of file URLs
    generated_document_url VARCHAR(255),
    qr_token VARCHAR(100) UNIQUE,
    admin_notes TEXT,
    rejection_reason VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- Issues table
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    urgency VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'reported',
    user_id INTEGER REFERENCES users(id),
    municipality_id INTEGER REFERENCES municipalities(id),
    photos JSON, -- array of photo URLs
    assigned_to VARCHAR(100),
    admin_notes TEXT,
    estimated_completion DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Benefits table
CREATE TABLE benefits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    municipality_id INTEGER REFERENCES municipalities(id),
    eligibility_criteria JSON,
    required_documents JSON,
    application_start DATE,
    application_end DATE,
    benefit_amount DECIMAL(10,2),
    benefit_type VARCHAR(50),
    max_beneficiaries INTEGER,
    current_beneficiaries INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Benefit applications table
CREATE TABLE benefit_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    benefit_id INTEGER REFERENCES benefits(id),
    status VARCHAR(20) DEFAULT 'submitted',
    application_data JSON,
    supporting_documents JSON,
    admin_notes TEXT,
    approved_amount DECIMAL(10,2),
    disbursement_date DATE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- QR codes table
CREATE TABLE qr_codes (
    id SERIAL PRIMARY KEY,
    token VARCHAR(100) UNIQUE NOT NULL,
    document_request_id INTEGER REFERENCES document_requests(id),
    municipality_id INTEGER REFERENCES municipalities(id),
    qr_data JSON,
    verification_hash VARCHAR(255),
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    last_validated_at TIMESTAMP
);

-- JWT blacklist table
CREATE TABLE jwt_blacklist (
    id SERIAL PRIMARY KEY,
    token_jti VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Email verification tokens table
CREATE TABLE email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements table
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    municipality_id INTEGER REFERENCES municipalities(id),
    created_by INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table (for marketplace communication)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id),
    sender_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file
    attachments JSON, -- array of file URLs
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document templates table
CREATE TABLE document_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    municipality_id INTEGER REFERENCES municipalities(id),
    template_content TEXT NOT NULL, -- HTML template
    header_image VARCHAR(255),
    footer_text TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- document_ready, issue_update, benefit_approved, etc.
    related_id INTEGER, -- ID of related entity (document_request_id, issue_id, etc.)
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Monorepo Configuration Files

**Root Package.json (Workspace Configuration)**
```json
{
  "name": "munlink-zambales",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "deploy": "docker-compose up -d --build"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.0.0"
  }
}
```

**Turbo.json (Turborepo Configuration)**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Docker Compose Configuration**
```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: munlink_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: munlink_zambales
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal
    ports:
      - "5432:5432"

  # Flask API Backend
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://munlink_user:${DB_PASSWORD}@db:5432/munlink_zambales
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - ADMIN_SECRET_KEY=${ADMIN_SECRET_KEY}
      - FLASK_ENV=production
    volumes:
      - ./uploads:/app/uploads
      - ./Municipality Logo:/app/Municipality Logo:ro
      - ./Zambales Logo:/app/Zambales Logo:ro
      - ./data:/app/data:ro
    networks:
      - internal
      - public
    ports:
      - "5000:5000"
    depends_on:
      - db

  # Public Website (Residents)
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    environment:
      - VITE_API_BASE_URL=http://api:5000/api
    networks:
      - public
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api

  # Admin Dashboard (Internal Only)
  admin:
    build:
      context: ./apps/admin
      dockerfile: Dockerfile
    environment:
      - VITE_API_BASE_URL=http://api:5000/api
      - ADMIN_SECRET_KEY=${ADMIN_SECRET_KEY}
    networks:
      - internal  # Internal network ONLY
    ports:
      - "3001:80"  # NOT exposed to internet
    depends_on:
      - api

networks:
  public:
    driver: bridge
  internal:
    driver: bridge
    internal: true  # Blocks external access

volumes:
  postgres_data:
    driver: local
```

**Environment Variables (.env.example)**
```env
# Database Configuration
DB_PASSWORD=your_secure_database_password

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES=86400

# Admin Dashboard Security
ADMIN_SECRET_KEY=your-admin-dashboard-secret-key-change-this

# Email Configuration (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
FROM_EMAIL=your-email@gmail.com

# Application Configuration
APP_NAME=MunLink Zambales
FLASK_ENV=production
DEBUG=False

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_EXTENSIONS=pdf,jpg,jpeg,png,doc,docx

# QR Code Configuration
QR_BASE_URL=https://your-domain.com/verify
QR_EXPIRY_DAYS=30
```

**Shared TypeScript Config (tsconfig.base.json)**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@munlink/ui": ["./packages/ui"],
      "@munlink/types": ["./packages/types"],
      "@munlink/utils": ["./packages/utils"]
    }
  }
}
```

**Shared Tailwind Config (tailwind.config.base.js)**
```javascript
// packages/ui/tailwind.config.base.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        zambales: {
          green: '#2d5016',
          gold: '#d4af37',
          blue: '#1e40af',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Security Implementation

**Authentication & Authorization**
```python
# JWT Configuration
JWT_SECRET_KEY = "your-secret-key"
JWT_ACCESS_TOKEN_EXPIRES = 24 * 60 * 60  # 24 hours
JWT_ALGORITHM = "HS256"

# Password Hashing
BCRYPT_ROUNDS = 12

# File Upload Security
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
UPLOAD_FOLDER_STRUCTURE = "uploads/zambales/municipalities/{municipality_name}/"
```

**Input Validation Rules**
```python
# User Registration Validation
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
PHONE_REGEX = r'^(\+63|0)[0-9]{10}  # Philippine phone format
PASSWORD_MIN_LENGTH = 8
PASSWORD_REQUIREMENTS = {
    'min_length': 8,
    'require_uppercase': True,
    'require_lowercase': True,
    'require_digit': True
}

# File Upload Validation
def validate_file_upload(file):
    # Check file extension
    # Check file size
    # Scan for malicious content
    # Verify file type matches extension
    pass
```

**Data Access Control**
```python
# Municipality-based data isolation
def require_municipality_access(municipality_id):
    def decorator(f):
        def wrapper(*args, **kwargs):
            user = get_current_user()
            if user.municipality_id != municipality_id and user.role != 'admin':
                return {'error': 'Access denied'}, 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

# Role-based access control
def require_role(required_role):
    def decorator(f):
        def wrapper(*args, **kwargs):
            user = get_current_user()
            if user.role != required_role:
                return {'error': 'Insufficient permissions'}, 403
            return f(*args, **kwargs)
        return wrapper
    return decorator
```

## 📱 USER INTERFACE SPECIFICATIONS

> **DESIGN REFERENCE**: All UI/UX specifications are detailed in `DESIGN_TEMPLATE.md`. This section contains only technical implementation notes.

### Frontend Technology Stack
- **Framework**: React 18 with TypeScript
- **Build System**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form with validation

### Component Architecture
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── marketplace/     # Marketplace-specific components
│   ├── documents/       # Document request components
│   ├── issues/          # Issue reporting components
│   └── admin/           # Admin dashboard components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── services/            # API service functions
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

### Responsive Design Implementation
- **Mobile-First**: Base styles for mobile (320px+)
- **Breakpoints**: 768px (tablet), 1024px (desktop), 1280px (large)
- **Grid System**: CSS Grid with Tailwind utilities
- **Flexbox**: For component layouts and alignment

### State Management
```typescript
// Global state structure
interface AppState {
  auth: AuthState;
  user: UserState;
  marketplace: MarketplaceState;
  documents: DocumentState;
  issues: IssueState;
  municipalities: MunicipalityState;
}
```

### API Integration
- **Base URL**: Environment-based API endpoints
- **Authentication**: JWT token in Authorization header
- **Error Handling**: Centralized error boundary and toast notifications
- **Loading States**: Skeleton loaders and loading indicators
- **Caching**: React Query for data fetching and caching

## 🚀 DEPLOYMENT AND ENVIRONMENT SETUP

### Quick Start Guide (Monorepo)

**Get Up and Running in 5 Minutes:**

```bash
# 1. Clone and install
git clone https://github.com/your-org/munlink-zambales.git
cd munlink-zambales
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start with Docker (Easiest)
docker-compose up -d

# 4. Seed data
docker-compose exec api python tools/scripts/seed_data.py

# 5. Create first admin
docker-compose exec api python tools/scripts/create_admin_account.py

# 6. Access applications
# Public Website: http://localhost
# Admin Dashboard: http://localhost:3001 (SSH tunnel required in production)
# API: http://localhost:5000
```

**Development Commands:**
```bash
npm run dev          # Start all apps in development
npm run build        # Build all apps for production
npm run test         # Run all tests
npm run lint         # Lint all code
docker-compose up -d # Run with Docker
```

### Development Environment Setup (Monorepo)

**Prerequisites Installation**
```bash
# Install Python 3.8+
python --version  # Verify >= 3.8

# Install Node.js 18+
node --version   # Verify >= 18
npm --version    # Verify npm is available

# Install Docker & Docker Compose
docker --version
docker-compose --version

# Verify location data file exists
ls data/PH_LOC.json  # Must be present in project root

# Verify logo directories exist
ls "Municipality Logo/"  # Must contain 13 municipal subdirectories
ls "Zambales Logo/"      # Must contain Zambales province logo
```

**Monorepo Setup (All Apps)**
```bash
# Clone repository
git clone https://github.com/your-org/munlink-zambales.git
cd munlink-zambales

# Install root dependencies (Turborepo)
npm install

# Create environment configuration
cp .env.example .env
# Edit .env with your development configuration

# Install all app dependencies with Turborepo
npm run install:all

# Or manually install per app:
cd apps/api && pip install -r requirements.txt && cd ../..
cd apps/web && npm install && cd ../..
cd apps/admin && npm install && cd ../..
```

**Database Setup (Development)**
```bash
# Option 1: Use Docker (Recommended)
docker-compose up -d db

# Option 2: Use Local PostgreSQL or SQLite
# Configure DATABASE_URL in .env

# Run migrations
cd apps/api
flask db upgrade

# Seed municipality data
python ../../tools/scripts/seed_data.py

# Create first admin (for testing)
python ../../tools/scripts/create_admin_account.py
```

**Development Servers (All Apps)**

**Method 1: Turborepo (Runs Everything)**
```bash
# From monorepo root - runs all apps in parallel
npm run dev

# Services will be available at:
# - API: http://localhost:5000
# - Web: http://localhost:3000
# - Admin: http://localhost:3001
```

**Method 2: Individual Apps**
```bash
# Terminal 1 - API (Backend)
cd apps/api
python app.py
# API: http://localhost:5000

# Terminal 2 - Web (Public Website)
cd apps/web
npm run dev
# Web: http://localhost:3000

# Terminal 3 - Admin Dashboard
cd apps/admin
npm run dev
# Admin: http://localhost:3001
```

**Method 3: Docker Compose (Full Stack)**
```bash
# Run everything with Docker
docker-compose up

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f
```

**Development Workflow:**
```bash
# Start all services
npm run dev

# Run tests
npm run test

# Lint code
npm run lint

# Build for production
npm run build

# Clean all build artifacts
npm run clean
```

### Configuration Files

**Backend Configuration (.env)**
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/munlink_zambales
# For development:
DATABASE_URL=sqlite:///munlink_zambales.db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES=86400

# File Upload Configuration
UPLOAD_FOLDER=uploads/zambales
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_EXTENSIONS=pdf,jpg,jpeg,png,doc,docx

# Email Configuration (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=pauljohn.antigo@gmail.com
SMTP_PASSWORD=ogjm vcmy dres yprm
FROM_EMAIL=pauljohn.antigo@gmail.com

# Application Configuration
FLASK_ENV=development
SECRET_KEY=your-flask-secret-key-change-this
DEBUG=True
APP_NAME=MunLink Zambales

# Logo Paths
MUNICIPALITY_LOGO_PATH=Municipality Logo/
ZAMBALES_LOGO_PATH=Zambales Logo/

# QR Code Configuration
QR_BASE_URL=https://your-domain.com/verify
QR_EXPIRY_DAYS=30  # for digital documents
```

**Frontend Configuration (.env.local)**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# Application Configuration
VITE_APP_NAME=MunLink Zambales
VITE_APP_VERSION=1.0.0

# File Upload Configuration
VITE_MAX_FILE_SIZE=10485760  # 10MB
VITE_ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx
VITE_MAX_PHOTOS_PER_ITEM=5

# Municipality Configuration
VITE_PROVINCE_NAME=Zambales
VITE_TOTAL_MUNICIPALITIES=13
```

### Production Deployment

**Deployment Platform: Render.com (Recommended)**

MunLink Zambales is optimized for deployment on Render.com, a modern cloud platform that simplifies deployment with automatic SSL, built-in PostgreSQL, and Docker support.

**🚀 Quick Deploy to Render:**
1. Push monorepo to GitHub
2. Create Render account (free)
3. Follow [Step-by-Step Guide](#rendercom-deployment-guide-step-by-step) below
4. Or use [render.yaml](#renderyaml-infrastructure-as-code) for one-click deployment
5. Total time: ~15-30 minutes

**Render Services Required:**
- 1x PostgreSQL Database (Starter plan or higher)
- 1x Web Service (API - Flask Backend)
- 1x Web Service (Main Website - React Frontend)
- 1x Private Service (Admin Dashboard - Internal only)

**💰 Render Pricing Options:**

**Option 1: COMPLETELY FREE (Limited Features)**
- PostgreSQL: FREE tier (90-day trial, then expires)
- API Backend: FREE tier (750 hours/month, sleeps after inactivity)
- Main Website: FREE (Static Site)
- Admin Dashboard: NOT AVAILABLE (no free private services)
- **Total Cost**: $0/month
- **Limitations**: 
  - Database limited to 90 days
  - Services sleep after 15 min inactivity
  - Slow cold starts (30-60 seconds)
  - Admin must use CLI script (no dashboard)

**Option 2: HYBRID FREE + PAID (Recommended for Free Tier)**
- PostgreSQL: Use FREE external database (Supabase/Neon/ElephantSQL)
- API Backend: FREE tier (750 hours/month)
- Main Website: FREE (Static Site)
- Admin Dashboard: Skip (use CLI script only)
- **Total Cost**: $0/month
- **Better**: Free database never expires

**Option 3: MINIMAL PAID (Production-Ready)**
- PostgreSQL (Starter): $7/month
- API Backend: $7/month (always-on)
- Main Website: FREE (Static Site)
- Admin Dashboard: $7/month (Private Service)
- **Total**: ~$21-28/month

**Alternative FREE Deployment Options:**
- **Railway.app**: $5 free credit monthly (limited)
- **Fly.io**: Free tier with better limits
- **Self-hosted VPS**: DigitalOcean/Linode ($6/month with student pack)
- **Vercel + Supabase**: Frontend FREE, backend Supabase FREE tier

---

### FREE TIER Deployment Guide (100% Free)

**This guide shows how to deploy MunLink Zambales completely FREE using external free database.**

#### **Step 1: Create Free PostgreSQL Database (External)**

**Option A: Supabase (Recommended - Never Expires)**
1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Create new project:
   - **Name**: munlink-zambales
   - **Database Password**: [save this!]
   - **Region**: Singapore (closest to Philippines)
3. Go to Settings → Database → Connection String
4. Copy **Connection pooling** URL (starts with `postgresql://`)
5. Save this URL for later

**Option B: Neon.tech (Alternative)**
1. Go to [neon.tech](https://neon.tech) → Sign up (free)
2. Create project → Get connection string
3. Free: 0.5GB storage, always active

**Option C: ElephantSQL (Alternative)**
1. Go to [elephantsql.com](https://elephantsql.com) → Sign up (free)
2. Create Tiny Turtle instance (20MB free)
3. Get connection URL

#### **Step 2: Deploy API Backend (Render FREE Tier)**

1. Go to Render Dashboard → New → Web Service
2. Connect GitHub repository
3. Configure:
   - **Name**: `munlink-api`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `apps/api`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt && flask db upgrade`
   - **Start Command**: `gunicorn -w 2 -b 0.0.0.0:$PORT app:app --timeout 120`
   - **Plan**: FREE (⚠️ Will sleep after 15 min inactivity)

4. **Environment Variables**:
   ```
   DATABASE_URL=[paste Supabase/Neon connection string]
   JWT_SECRET_KEY=[any random string - e.g., use: openssl rand -hex 32]
   ADMIN_SECRET_KEY=[another random string]
   FLASK_ENV=production
   SECRET_KEY=[another random string]
   MUNICIPALITY_LOGO_PATH=../../Municipality Logo/
   ZAMBALES_LOGO_PATH=../../Zambales Logo/
   ```

5. Click **Create Web Service** (will be FREE)

**⚠️ FREE Tier Limitations:**
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- 750 hours/month limit (more than enough for single service)

#### **Step 3: Seed Database**

After API deploys (wait 5-10 min):

1. Go to munlink-api service → Shell
2. Run:
   ```bash
   python ../../tools/scripts/seed_data.py
   python ../../tools/scripts/create_admin_account.py
   ```

#### **Step 4: Deploy Main Website (FREE Static Site)**

1. Go to Render Dashboard → New → Static Site
2. Connect same GitHub repository
3. Configure:
   - **Name**: `munlink-web`
   - **Branch**: `main`
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: FREE (always active!)

4. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://munlink-api.onrender.com/api
   VITE_APP_NAME=MunLink Zambales
   VITE_PROVINCE_NAME=Zambales
   VITE_TOTAL_MUNICIPALITIES=13
   ```

5. Click **Create Static Site** (100% FREE forever!)

#### **Step 5: Admin Access (No Dashboard - Use CLI)**

Since FREE tier doesn't support private services:

**Method 1: Render Shell (In Browser)**
```bash
# Go to munlink-api service → Shell
python ../../tools/scripts/create_admin_account.py
```

**Method 2: Render CLI (Local Machine)**
```bash
npm install -g @render/cli
render login
render shell munlink-api
python ../../tools/scripts/create_admin_account.py
```

#### **Step 6: Keep Service Awake (Prevent Sleep)**

**Option A: UptimeRobot (Free Monitoring)**
1. Sign up at [uptimerobot.com](https://uptimerobot.com) (free)
2. Add New Monitor:
   - **Type**: HTTP(S)
   - **URL**: `https://munlink-api.onrender.com/health`
   - **Interval**: 5 minutes
3. Pings your API every 5 min → prevents sleep

**Option B: Cron-job.org**
1. Sign up at [cron-job.org](https://cron-job.org) (free)
2. Create job to ping your API every 10 minutes

**Option C: GitHub Actions (Free)**
Create `.github/workflows/keep-alive.yml`:
```yaml
name: Keep Render Service Awake
on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping API
        run: curl https://munlink-api.onrender.com/health
```

#### **FREE Tier Architecture:**

```
Internet
    ↓
munlink-web (FREE Static Site - Always On)
    ↓
munlink-api (FREE Web Service - Sleeps when idle)
    ↓
Supabase/Neon PostgreSQL (FREE - Always On)

Admin Access: Via Render Shell (CLI script only)
```

#### **FREE Tier Trade-offs:**

| Feature | FREE Tier | Paid Tier |
|---------|-----------|-----------|
| **Cost** | $0/month | $21-46/month |
| **Database** | External (Supabase) | Render PostgreSQL |
| **API Uptime** | Sleeps after 15 min | Always on |
| **Cold Start** | 30-60 seconds | Instant |
| **Website** | Always fast | Always fast |
| **Admin Dashboard** | CLI only | Web interface |
| **File Uploads** | Limited/External storage | Persistent disk |
| **Production Ready** | Testing/Demo | Yes |

**💡 FREE Tier Best For:**
- Development/Testing
- Demo/Portfolio projects
- Low-traffic applications
- Learning/Student projects

**💰 Upgrade to Paid When:**
- Need 24/7 uptime
- Can't tolerate cold starts
- Need admin web dashboard
- Production deployment with SLA

---

### Render.com Deployment Guide (Paid Tier - Step-by-Step)

**Prerequisites:**
- GitHub account with your monorepo pushed
- Render.com account (free to create)
- Repository structure follows the monorepo layout
- **Payment method** for paid services

#### **Step 1: Create PostgreSQL Database**

1. Go to Render Dashboard → New → PostgreSQL
2. Configure:
   - **Name**: `munlink-zambales-db`
   - **Region**: Choose closest to your users (e.g., Singapore for Philippines)
   - **Plan**: Starter ($7/month) - includes 1GB storage
3. Click **Create Database**
4. Copy the **Internal Database URL** (starts with `postgresql://...`)

#### **Step 2: Deploy Flask API Backend**

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `munlink-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `apps/api`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt && flask db upgrade`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
   - **Plan**: Starter ($7/month) or Standard ($25/month)

4. **Environment Variables**:
   ```
   DATABASE_URL=[paste Internal Database URL from Step 1]
   JWT_SECRET_KEY=[generate strong random key]
   ADMIN_SECRET_KEY=[generate strong random key]
   FLASK_ENV=production
   SECRET_KEY=[generate strong random key]
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=[your email]
   SMTP_PASSWORD=[your app password]
   FROM_EMAIL=[your email]
   MUNICIPALITY_LOGO_PATH=../../Municipality Logo/
   ZAMBALES_LOGO_PATH=../../Zambales Logo/
   ```

5. **Add Persistent Disk** (for file uploads):
   - Go to service Settings → Disks
   - Add disk: `/app/uploads` (1GB+)

6. Click **Create Web Service**

#### **Step 3: Seed Database (One-Time Setup)**

After API service deploys successfully:

1. Go to service → Shell (in Render dashboard)
2. Run seeding commands:
   ```bash
   # Seed municipality data
   python ../../tools/scripts/seed_data.py
   
   # Create first admin account
   python ../../tools/scripts/create_admin_account.py
   ```

#### **Step 4: Deploy Main Website (Public)**

1. Go to Render Dashboard → New → Static Site (Free) or Web Service
2. Connect same GitHub repository
3. Configure:
   - **Name**: `munlink-web`
   - **Region**: Same as API
   - **Branch**: `main`
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://munlink-api.onrender.com/api
   VITE_APP_NAME=MunLink Zambales
   VITE_APP_VERSION=1.0.0
   VITE_MAX_FILE_SIZE=10485760
   VITE_PROVINCE_NAME=Zambales
   VITE_TOTAL_MUNICIPALITIES=13
   ```

5. Click **Create Static Site** or **Create Web Service**

#### **Step 5: Deploy Admin Dashboard (Private Service)**

1. Go to Render Dashboard → New → Private Service
2. Connect same GitHub repository
3. Configure:
   - **Name**: `munlink-admin`
   - **Region**: Same as API
   - **Branch**: `main`
   - **Root Directory**: `apps/admin`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --port $PORT --host 0.0.0.0`
   - **Plan**: Starter ($7/month)

4. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://munlink-api.onrender.com/api
   ADMIN_SECRET_KEY=[same as API service]
   ```

5. Click **Create Private Service**

6. **Important**: Private Services are only accessible:
   - From other Render services in same account
   - Via Render's private network
   - Through SSH tunnel (for admin access)

#### **Step 6: Setup Custom Domain (Optional)**

1. Go to Main Website service → Settings → Custom Domains
2. Add your domain: `munlink-zambales.gov.ph`
3. Update DNS records with your registrar:
   ```
   Type: CNAME
   Name: @
   Value: munlink-web.onrender.com
   ```
4. Render automatically provisions SSL certificate

#### **Step 7: Configure File Uploads**

For each service that handles files (API service):

1. Go to service Settings → Disks
2. Mount persistent disk:
   - **Mount Path**: `/app/uploads`
   - **Size**: 5GB (or more based on needs)
3. Add another disk for logos:
   - **Mount Path**: `/app/Municipality Logo`
   - Upload logo files manually or via git

#### **Step 8: Access Admin Dashboard**

**Method 1: SSH Tunnel (Recommended)**
```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Create SSH tunnel to admin service
render ssh munlink-admin -L 3001:localhost:10000

# Access in browser: http://localhost:3001
```

**Method 2: From Another Render Service**
```javascript
// From API service, access admin dashboard
const adminUrl = 'http://munlink-admin:10000';
```

#### **Step 9: Environment-Specific Configuration**

**Production Environment Variables Summary:**

```env
# API Service (munlink-api)
DATABASE_URL=postgresql://...  (from Render PostgreSQL)
JWT_SECRET_KEY=your-super-secret-jwt-key
ADMIN_SECRET_KEY=your-admin-secret-key
FLASK_ENV=production
SECRET_KEY=your-flask-secret-key
DEBUG=False
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com

# Web Service (munlink-web)
VITE_API_BASE_URL=https://munlink-api.onrender.com/api
VITE_APP_NAME=MunLink Zambales

# Admin Service (munlink-admin) - Private
VITE_API_BASE_URL=https://munlink-api.onrender.com/api
ADMIN_SECRET_KEY=your-admin-secret-key
```

#### **Step 10: Post-Deployment Checklist**

- [ ] Database created and accessible
- [ ] API service deployed and health check passing
- [ ] Database seeded with 13 municipalities
- [ ] First admin account created
- [ ] Main website deployed and accessible
- [ ] Admin dashboard deployed (private service)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate provisioned automatically
- [ ] File uploads working (persistent disk mounted)
- [ ] Test all features: registration, login, marketplace, documents
- [ ] Test admin access via SSH tunnel
- [ ] Configure backups (Render PostgreSQL auto-backups)

#### **Render-Specific Features:**

✅ **Automatic HTTPS**: Free SSL certificates with auto-renewal  
✅ **Auto-Deploy**: Pushes to `main` branch trigger deployments  
✅ **Managed PostgreSQL**: Automatic backups, point-in-time recovery  
✅ **Private Networking**: Admin dashboard isolated from public  
✅ **Zero-Downtime Deploys**: Rolling updates with health checks  
✅ **Environment Variables**: Secure storage, not in git  
✅ **Persistent Disks**: File uploads survive deployments  
✅ **DDoS Protection**: Built-in security features  

#### **Render Deployment Architecture:**

```
Internet
    ↓
Render Load Balancer (SSL Termination)
    ↓
    ├─→ munlink-web (Public)
    │   └─→ Static files served
    │
    ├─→ munlink-api (Public)
    │   ├─→ Handles API requests
    │   └─→ Connects to PostgreSQL (private network)
    │
    └─→ munlink-admin (Private Service)
        ├─→ Only accessible via SSH tunnel
        └─→ Connects to munlink-api (private network)

PostgreSQL Database (Private)
    └─→ Only accessible by Render services
```

#### **Monitoring and Logs**

Access logs for each service:
```bash
# Via Render Dashboard
Go to service → Logs tab

# Via Render CLI
render logs munlink-api --tail
render logs munlink-web --tail
render logs munlink-admin --tail
```

#### **Backup Strategy on Render**

**Database Backups:**
- Render PostgreSQL: Automatic daily backups (7-day retention on Starter)
- Manual backup: Dashboard → Database → Backups → Create Backup

**File Upload Backups:**
```bash
# Schedule with GitHub Actions or external service
# Download from persistent disk periodically
render ssh munlink-api
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /app/uploads
# Download to local machine
```

#### **Scaling on Render**

**Vertical Scaling (Upgrade plan):**
- Starter → Standard: More CPU/RAM
- Standard → Pro: Dedicated resources

**Horizontal Scaling (Multiple instances):**
- Go to service → Settings → Scaling
- Increase instance count (Standard plan+)
- Render handles load balancing automatically

#### **Cost Optimization Tips**

1. **Use Static Site for Frontend**: Free tier instead of Web Service
2. **Start with Starter Plans**: Upgrade only when needed
3. **Optimize Image Sizes**: Reduce disk space usage
4. **Use Free Tier for Staging**: Deploy staging environment for free
5. **Monitor Usage**: Render dashboard shows resource consumption

---

#### **Render.yaml (Infrastructure as Code)**

Create `render.yaml` in monorepo root for one-click deployment:

```yaml
# render.yaml - MunLink Zambales Infrastructure
services:
  # PostgreSQL Database
  - type: pserv
    name: munlink-db
    plan: starter
    region: singapore
    databaseName: munlink_zambales
    databaseUser: munlink_user

  # Flask API Backend
  - type: web
    name: munlink-api
    runtime: python
    plan: starter
    region: singapore
    rootDir: apps/api
    buildCommand: pip install -r requirements.txt && flask db upgrade
    startCommand: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: munlink-db
          property: connectionString
      - key: JWT_SECRET_KEY
        generateValue: true
      - key: ADMIN_SECRET_KEY
        generateValue: true
      - key: FLASK_ENV
        value: production
      - key: SECRET_KEY
        generateValue: true
      - key: MUNICIPALITY_LOGO_PATH
        value: ../../Municipality Logo/
      - key: ZAMBALES_LOGO_PATH
        value: ../../Zambales Logo/
    disk:
      name: uploads
      mountPath: /app/uploads
      sizeGB: 5

  # Main Website (Static Site - Free!)
  - type: web
    name: munlink-web
    runtime: static
    plan: free
    region: singapore
    rootDir: apps/web
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: VITE_API_BASE_URL
        value: https://munlink-api.onrender.com/api
      - key: VITE_APP_NAME
        value: MunLink Zambales
      - key: VITE_PROVINCE_NAME
        value: Zambales
      - key: VITE_TOTAL_MUNICIPALITIES
        value: 13

  # Admin Dashboard (Private Service)
  - type: pserv
    name: munlink-admin
    runtime: node
    plan: starter
    region: singapore
    rootDir: apps/admin
    buildCommand: npm install && npm run build
    startCommand: npm run preview -- --port $PORT --host 0.0.0.0
    envVars:
      - key: VITE_API_BASE_URL
        value: https://munlink-api.onrender.com/api
      - key: ADMIN_SECRET_KEY
        sync: false  # Must match API service
```

**Deploy with render.yaml:**
```bash
# Push render.yaml to GitHub
git add render.yaml
git commit -m "Add Render infrastructure config"
git push

# In Render Dashboard:
# 1. New → Blueprint
# 2. Connect repository
# 3. Render reads render.yaml and creates all services
# 4. Click "Apply" to deploy everything
```

---

**Production Admin Creation Workflow (Render):**

**Method 1: Render Shell (Easiest)**
```bash
# Go to Render Dashboard
# Navigate to: munlink-api service → Shell tab
# Run command in web terminal:
python ../../tools/scripts/create_admin_account.py

# Follow interactive prompts in browser terminal
```

**Method 2: Render CLI (From Local Machine)**
```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# SSH into API service
render shell munlink-api

# Run admin creation script
python ../../tools/scripts/create_admin_account.py
```

**Method 3: SSH Tunnel to Admin Dashboard (Advanced)**
```bash
# Install Render CLI
npm install -g @render/cli

# Create tunnel to admin service
render ssh munlink-admin -L 3001:localhost:10000

# Open browser: http://localhost:3001
# Login to admin dashboard
# Navigate to: Create Admin
# Fill form and submit
```

**Method 4: Direct Database Insert (Emergency Only)**
```bash
# Get database credentials from Render Dashboard
# Connect using psql or database client
psql [DATABASE_URL from Render]

# Insert admin manually (hash password first!)
INSERT INTO users (username, email, password_hash, ...)
VALUES (...);
```

**Access Control for Production:**
- Only authorized system administrators have SSH access to production server
- Admin creation requires proper credentials (SSH keys, passwords, MFA)
- All SSH sessions are logged for security auditing
- Admin creation scripts are not web-accessible (located outside web root)

**Alternative Production Methods:**

**Method 1: Direct Database Access (Advanced)**
```bash
# For database administrators only
psql -h production-db-host -U db_admin -d munlink_zambales

-- Manually insert admin with pre-hashed password
INSERT INTO users (username, email, password_hash, first_name, last_name, 
                   municipality_id, phone, role, email_verified, is_verified, 
                   is_active, id_verification_status)
VALUES ('admin_username', 'admin@municipality.gov.ph', 'bcrypt_hash', 
        'First', 'Last', 1, '+639123456789', 'admin', TRUE, TRUE, 
        TRUE, 'approved');
```

**Method 2: Container Execution (Docker/Kubernetes)**
```bash
# If deployed with Docker
docker exec -it munlink-backend python create_admin_account.py

# If deployed with Kubernetes
kubectl exec -it deployment/munlink-backend -- python create_admin_account.py
```

**Method 3: Server Management Panel (Optional)**
- cPanel/Plesk: Use terminal access feature
- Cloud providers (AWS/Azure/GCP): Use web-based SSH or cloud shell
- VPS providers: Use console access

**Initial Production Setup Checklist (Monorepo):**

**1. Clone and Configure**
```bash
# Clone repository
git clone https://github.com/your-org/munlink-zambales.git
cd munlink-zambales

# Copy environment template
cp .env.example .env

# Edit .env with production values
nano .env
```

**2. Install Dependencies**
```bash
# Install root dependencies (Turborepo)
npm install

# Install app dependencies
cd apps/api && pip install -r requirements.txt
cd ../web && npm install
cd ../admin && npm install
```

**3. Setup Database**
```bash
# Start database container
docker-compose up -d db

# Run migrations
cd apps/api
flask db upgrade

# Seed municipality data
python tools/scripts/seed_data.py
```

**4. Build and Deploy**
```bash
# From monorepo root
docker-compose up -d --build

# Verify services are running
docker-compose ps
```

**5. Create First Admin**
```bash
# Method A: CLI Script
docker-compose exec api python tools/scripts/create_admin_account.py

# Method B: SSH Tunnel + Admin Dashboard
ssh -L 3001:localhost:3001 admin@munlink-server.com
# Then access http://localhost:3001 in browser
```

**6. Configure Nginx (Reverse Proxy)**
```nginx
# /etc/nginx/sites-available/munlink-zambales
server {
    listen 80;
    listen 443 ssl http2;
    server_name munlink-zambales.gov.ph;

    ssl_certificate /etc/letsencrypt/live/munlink-zambales.gov.ph/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/munlink-zambales.gov.ph/privkey.pem;

    # Public website
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API endpoints
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Block external access to admin dashboard
    location /admin {
        deny all;
        return 403;
    }
}
```

**7. Enable Monitoring**
```bash
# Setup logging
mkdir -p /var/log/munlink
docker-compose logs -f > /var/log/munlink/app.log &

# Setup automated backups
# Add to crontab
0 2 * * * docker exec munlink-zambales-db-1 pg_dump -U munlink_user munlink_zambales > /backups/munlink_$(date +\%Y\%m\%d).sql
```

**Security Considerations (Monorepo):**
- ✅ Admin dashboard runs on internal Docker network only
- ✅ Port 3001 NOT exposed in production nginx config
- ✅ Firewall blocks external access to port 3001
- ✅ SSH access restricted with key-based authentication
- ✅ All sensitive env variables in .env (gitignored)
- ✅ Admin creation events logged with IP and timestamp
- ✅ Regular security audits of Docker containers
- ✅ Automated database backups daily

**Production Backend Deployment**
```bash
# Install production dependencies
pip install -r requirements-prod.txt

# Configure Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app

# Configure Nginx reverse proxy
# /etc/nginx/sites-available/munlink
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        root /var/www/munlink/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

**Production Frontend Deployment**
```bash
# Build for production
npm run build

# Serve static files with Nginx
# Files will be in ./dist/ directory
```

### Database Migration and Seeding

**Initial Database Setup**
```python
# seed_data.py - Initial municipality data
# IMPORTANT: Location data must be sourced from data/PH_LOC.json
# Filter and extract ONLY Zambales province and its 13 municipalities

import json

def load_zambales_data():
    """Load Zambales province and municipalities from PH_LOC.json"""
    with open('data/PH_LOC.json', 'r') as f:
        ph_data = json.load(f)
    
    # Filter for Zambales province only
    zambales_data = [item for item in ph_data if item.get('province') == 'Zambales']
    
    # Extract municipalities (exclude cities like Olongapo)
    zambales_municipalities = [
        item for item in zambales_data 
        if item.get('level') == 'municipality' and item.get('name') in [
            'Botolan', 'Cabangan', 'Candelaria', 'Castillejos', 'Iba',
            'Masinloc', 'Palauig', 'San Antonio', 'San Felipe', 
            'San Marcelino', 'San Narciso', 'Santa Cruz', 'Subic'
        ]
    ]
    
    return zambales_municipalities

# Use the filtered data instead of hardcoded list
ZAMBALES_MUNICIPALITIES = load_zambales_data()

# Document types seeding
DOCUMENT_TYPES = [
    {
        "name": "Certificate of Residency",
        "category": "municipal",
        "requirements": ["Utility Bills (last 3 months)", "Government ID"],
        "processing_days": "3-5",
        "digital_available": True,
        "expiry_physical": "6 months",
        "expiry_digital": "30 days",