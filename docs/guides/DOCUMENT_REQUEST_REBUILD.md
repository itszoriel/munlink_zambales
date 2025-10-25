# 🧾 Munlink Zambales — Document Request System Revamp (No Template Mode)

## 🎯 Goal
Completely rebuild the **Document Request** and **PDF Generation** system to eliminate all `.docx` templates and switch to fully dynamic, code-based PDF generation.

The new implementation must:
- Produce professional, official-looking PDFs dynamically.
- Be reliable, responsive, and require no external templates.
- Simplify maintenance by centralizing layout and logic.

---

## 🧩 Overview

### 🧍 Resident Flow
1. Resident requests a document (selecting **digital** or **pickup**).
2. If **pickup**, admin manually marks the request as completed.
3. If **digital**, once approved by the admin:
   - A **PDF document** is generated automatically.
   - Saved in `/uploads/generated_docs/{municipality}/{requestId}.pdf`.
   - Resident sees a **“Download”** button when ready.

### 🧑‍💼 Admin Flow
1. Admin views document requests scoped to their municipality.
2. Each request shows: resident name, document type, purpose, mode (digital/pickup), date.
3. Admin actions:
   - **Approve** → triggers automatic PDF generation.
   - **Reject** → prompts for a reason and updates status.
4. For approved digital requests:
   - The backend generates and stores the document.
   - Status transitions: `Pending → Processing → Ready → Completed`.

---

## ⚙️ Backend Implementation

### 1. Remove Template Logic
- Delete all `.docx` template usage, including:
  - `docxtpl`, `python-docx`, `docx` imports or dependencies.
  - Any Jinja-style placeholders (`{{name}}`, `{{address}}`, etc.).
  - Template directory references and fallback handling.
- The system must function **without any external file templates**.

### 2. Add Dynamic PDF Generator
Create a new module (Node or Python depending on backend):
```
/backend/utils/pdfGenerator.js
```
or  
```
/server/services/pdf_generator.py
```

This module should:
- Accept parameters:
  ```js
  {
    municipality,
    residentName,
    address,
    documentType,
    purpose,
    dateRequested,
    issuedBy,
    position,
    qrCodeUrl
  }
  ```
- Build a professional PDF using **pdfkit**, **reportlab**, or **pdf-lib**.
- Save the file to:
  ```
  /uploads/generated_docs/{municipality}/{requestId}.pdf
  ```
- Return `{ filePath, publicUrl }` to the database.

---

## 🧱 PDF Layout Specification

### Document Layout

```
┌────────────────────────────────────────────────────────────┐
│  [Municipal Seal]                                          │
│  Republic of the Philippines                               │
│  Province of Zambales                                      │
│  Municipality of [Name]                                    │
│  Office of the Municipal Mayor                             │
├────────────────────────────────────────────────────────────┤
│                   CERTIFICATE OF [TYPE]                    │
│                                                            │
│  This is to certify that **[Resident Name]**, of [Address], │
│  is a bona fide resident of this municipality.             │
│                                                            │
│  Purpose: [Purpose]                                        │
│  Date Requested: [Date]                                    │
│                                                            │
│  Issued by: [Official Name]                                │
│  [Position]                                                │
├────────────────────────────────────────────────────────────┤
│  This is a digitally issued document.                      │
│  No physical signature required.                           │
│  Generated via Munlink Zambales System                     │
└────────────────────────────────────────────────────────────┘
```

### Style & Aesthetics
- **Header**
  - Logo on the left, text aligned to the right/top.
  - Include standard government lines.
- **Border**
  - Solid rectangle border with color `#003399`.
- **Watermark**
  - Faint municipal seal centered behind text (opacity ~10%).
- **Fonts**
  - Use Times New Roman or similar serif font.
  - Title centered, bold, and uppercase.
- **Footer**
  - Include digital issuance note and optional QR code for verification.
- **Spacing**
  - Maintain proper margins and padding.
- **Responsiveness**
  - Generated PDF must look readable on mobile previews.

---

## 📜 Document Type Field Definitions

Each document type has a title, body text template, and optional signatory defaults.

Store definitions in a JSON file (for easy updates):
```
/config/documentTypes.json
```

Example:
```json
{
  "residency": {
    "title": "Certificate of Residency",
    "body": "This is to certify that {{residentName}}, of {{address}}, is a bona fide resident of this municipality.",
    "footer": "This document is issued upon request for {{purpose}}.",
    "signatory": {
      "name": "Hon. Ana Lopez",
      "position": "Municipal Secretary"
    }
  },
  "indigency": {
    "title": "Certificate of Indigency",
    "body": "This certifies that {{residentName}} of {{address}} is among the indigent residents of this municipality and is in need of assistance.",
    "footer": "Issued for {{purpose}}.",
    "signatory": {
      "name": "Hon. Ana Lopez",
      "position": "Municipal Secretary"
    }
  },
  "clearance": {
    "title": "Barangay Clearance",
    "body": "This is to certify that {{residentName}}, residing at {{address}}, has no pending violations or cases in this barangay.",
    "footer": "Issued for {{purpose}}.",
    "signatory": {
      "name": "Hon. Ana Lopez",
      "position": "Municipal Secretary"
    }
  },
  "business_permit": {
    "title": "Business Clearance",
    "body": "This certifies that the business {{businessName}}, owned by {{residentName}}, located at {{address}}, is registered and permitted to operate within this municipality.",
    "footer": "Valid until {{validity}}.",
    "signatory": {
      "name": "Hon. Ana Lopez",
      "position": "Municipal Secretary"
    }
  },
  "generic": {
    "title": "Certification",
    "body": "This certifies that {{residentName}} requested {{documentType}} for {{purpose}}.",
    "footer": "Issued this {{date}} at the Municipality of {{municipality}}.",
    "signatory": {
      "name": "Hon. Ana Lopez",
      "position": "Municipal Secretary"
    }
  }
}
```

> When new document types are added, just update `documentTypes.json` — no code or layout changes needed.

---

## 📁 File Handling
- Generated files saved under:
  ```
  /uploads/generated_docs/{municipality}/{requestId}.pdf
  ```
- Database fields:
  - `file_url`
  - `generated_at`
  - `status` (`processing`, `ready`, `completed`, `rejected`)
- Both resident and admin can access via `/api/files/:id` or direct file link.

---

## 💻 Frontend Integration

### Resident Side
- On “My Requests”:
  - **Download** button appears if `ready` or `completed`.
  - **Processing** badge if still generating.
  - **Rejected** with admin remarks if denied.
- Must be **mobile responsive**: text wraps, buttons stack properly.

### Admin Side
- “Document Requests”:
  - Approve triggers backend generation instantly.
  - Reject opens remark modal.
  - View/Download opens the PDF in new tab.
- Add **status badges** (Pending, Processing, Ready, Completed, Rejected).
- Fully responsive (cards and modals adjust for smaller screens).

---

## ⚡ Expected Behavior (End-to-End)

1. Resident requests a **digital Certificate of Residency**.
2. Admin reviews → clicks **Approve**.
3. Backend:
   - Generates a styled PDF.
   - Saves to `/uploads/generated_docs/...`.
   - Updates DB status to `"Ready"`.
4. Resident sees **Download Document** button.
5. Both admin and resident can open/view the document.
6. No missing templates or empty documents.
7. All layouts are mobile-friendly and visually professional.

---

## 🧠 Developer Notes
- Keep all PDF generation centralized in one function.
- No more per-municipality templates.
- Use a default seal if missing.
- Log generation errors and retry if needed.
- Always validate data (resident name, purpose, etc.).
- Use clean typography, consistent margins, and proper alignment.

---

## 🌐 Optional Enhancements (Phase 2)
- Add QR verification linking to `/api/verify/:requestId`.
- Add serial number or tracking ID in footer.
- Support multiple signatories dynamically.
- Allow re-generation after admin edits.
- Allow optional header customization per municipality.

---

## ✅ Summary
After this revamp:
- No `.docx` templates — 100% dynamic PDFs.
- Consistent, official layout for all documents.
- Clear admin and resident flows.
- Easier maintenance and faster generation.
- Mobile-friendly UI for both ends.

---

## 📦 Recommended File Structure

```
/backend
  /utils
    pdfGenerator.js
  /config
    documentTypes.json
  /controllers
    documentRequestController.js
/uploads
  /generated_docs/{municipality}/{requestId}.pdf
/docs
  DOCUMENT_REQUEST_REBUILD.md
```
