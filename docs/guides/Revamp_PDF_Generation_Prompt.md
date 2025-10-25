# 🧠 AI PROMPT: Revamp PDF Generation System (No Template)

You are an expert full-stack developer.  
Your task is to **redesign and improve the PDF generation system** for the digital document request feature.  
This project currently generates PDF certifications, but the goal is to make them **look professional, formal, and government-style**, without using any external `.docx` templates.

---

## 🏗️ OVERALL OBJECTIVE
Completely rework the PDF generation logic to produce **clean, official certificates** for both Barangay and Municipal levels.  
All document elements (header, body, watermark, footer, QR code) must be programmatically generated — **no `.docx` or template files**.

---


---
## Locations and Fallback if there is no Municipality Mayor and Punong Barangay

# 🧠 PDF Generation Fallback Enhancement (No Template)

## Goal
Ensure that all generated PDFs (certificates, certifications, clearances, etc.) are **complete, readable, and professional** even if certain municipality or barangay information is missing in the system database.

This enhancement adds **fallback defaults** for missing official data (e.g., Municipal Mayor, Punong Barangay, Municipality Name) and adjusts the signatory section accordingly.

---
## Zambales Municipality with their Barangay locations
data/locations/philippines_full_locations.json

## 🧩 Requirements

### 1. Fallback Handling

When generating the document, verify all dynamic fields such as municipality, barangay, and official names.  
If any field is **missing, null, or empty**, use the following **default fallback values**:

| Field | Default Value |
|-------|----------------|
| Municipality Name | Municipality of Zambales |
| Barangay Name | Barangay Hall |
| Punong Barangay Name | Barangay Kagawad |
| Punong Barangay Title | Punong Barangay |
| Municipal Mayor Name | Mayor |
| Municipal Mayor Title | Municipal Mayor |
| Admin Name | Municipal Records Officer |

These defaults are **temporary** and used only during PDF generation (not stored in the database).

---

### 2. Dynamic Signatory Logic

The **signatory** at the bottom of the PDF should dynamically adjust based on the document’s level (Municipal or Barangay).

#### 🏛 Municipal Level:
For and in behalf of the Municipal Mayor,
{Admin Name}
Municipal Admin
Municipality of {Municipality Name}


#### 🏘 Barangay Level:
For and in behalf of the Punong Barangay,
{Admin Name}
Barangay Admin
Barangay {Barangay Name}


If the document level cannot be identified, default to **Municipal level**.

---

### 3. Fallback Text Substitution

When populating text placeholders (e.g., `{Municipality Name}`, `{Barangay Name}`, `{Admin Name}`), apply this logic:

```js
const safeValue = (value, fallback) => value && value.trim() !== '' ? value : fallback;

const municipality = safeValue(request.municipalityName, 'Municipality of Zambales');
const barangay = safeValue(request.barangayName, 'Barangay Hall');
const punongBarangay = safeValue(request.punongBarangay, 'Barangay Kagawad');
const mayor = safeValue(request.mayorName, 'Mayor');
const admin = safeValue(request.adminName, 'Municipal Records Officer');
Use these sanitized values when constructing the text blocks for the document.

4. Example Generated Text with Fallbacks

If certain data is missing, the PDF output should still render cleanly:
Republic of the Philippines
Province of Zambales
Municipality of Zambales

CERTIFICATE OF INDIGENCY

This is to certify that Maria Santos, a bona fide resident of Barangay Hall, Municipality of Zambales,
Province of Zambales, has requested a Certificate of Indigency for educational assistance.

Issued this 24th day of October, 2025, at the Office of the Municipal Mayor, Municipality of Zambales.

For and in behalf of the Municipal Mayor,
Municipal Records Officer
Municipal Admin
Municipality of Zambales


---

## 🧾 PDF DOCUMENT DESIGN ENHANCEMENT (NO TEMPLATE)

The document generation already works, but I want to **improve its design and structure** to make it look more professional.

### 1. **Header**
- Keep the **Zambales logo** at the top (left or centered).
- Below or beside it, include:
  ```
  Republic of the Philippines
  Province of Zambales
  Municipality of {Municipality Name}
  {If Barangay-level: Barangay {Barangay Name}}
  ```
- If the document is municipal-level, show:
  ```
  OFFICE OF THE MUNICIPAL MAYOR
  ```
- If barangay-level:
  ```
  OFFICE OF THE PUNONG BARANGAY
  ```

---

### 2. **Title**
- The title should be in the center and bold:
  ```
  {Name of the Document Requested}
  ```
- Example:
  ```
  CERTIFICATE OF INDIGENCY
  ```
- Font should be professional and in uppercase (e.g., Times New Roman, bold, 16–18pt).

---

### 3. **Body Content**
Replace the short/lame text with a **formal, structured paragraph** that includes relevant dynamic data.

Example structure:
```
TO WHOM IT MAY CONCERN:

This is to certify that {Resident Name}, {Age or Civil Status if available}, a bona fide resident of Barangay {Barangay Name}, Municipality of {Municipality Name}, Province of Zambales, has requested a {Document Type} for the purpose of {Purpose}.

{If Additional Details exist: Add them as a separate sentence for context.}

Issued this {Date Issued} at the {If Barangay: Office of the Punong Barangay, Barangay {Barangay Name}}{If Municipal: Office of the Municipal Mayor, Municipality of {Municipality Name}}, Province of Zambales.
```

✅ Make sure:
- Text is left-aligned with proper margins and spacing.
- Font is readable (e.g., Times New Roman, 12pt).
- Paragraphs are clearly separated.

---

### 4. **Watermark / Seal**
- Add a **transparent municipal or barangay logo** as a centered watermark.
- Opacity: around **10–15%**.
- The system must automatically use the correct seal based on the admin’s assigned municipality.
- The watermark should not block or distort text readability.

---

### 5. **Issued By Section**
- At the bottom, right-aligned:
  ```
  FOR: {Mayor or Punong Barangay Name}
  {Position Title}

  BY: {Admin Name}
  {Admin Role: Municipal Admin or Barangay Admin / Officer-in-Charge}
  ```
- If Barangay-level, use “Punong Barangay”.
- If Municipal-level, use “Municipal Mayor”.
- Add subtle spacing between lines and keep alignment neat.

---

### 6. **QR Code**
- Add a **scannable QR code** at the bottom (right or left corner).
- The QR code should link to:
  ```
  https://munlink.ph/verify/{requestId}
  ```
- Ensure it is:
  - Mobile-scannable.
  - Not distorted or cropped.
  - Positioned with consistent margins.

---

## ⚙️ FUNCTIONAL LOGIC ENHANCEMENTS

### Resident Request Form Enhancements:
Add the following input fields when a resident requests a document:

| Field | Type | Description | Example |
|--------|------|-------------|----------|
| **Document Type** | Select | Type of certificate requested | Certificate of Indigency |
| **Purpose** | Text | Purpose for the request | Educational Assistance |
| **Additional Details** | Textarea (optional) | Extra info for richer certification text | “Currently enrolled at PRMSU Iba Campus.” |
| **Civil Status / Age** | Optional text | Adds professional context | “22 years old, single” |
| **Request Level** | Auto (Barangay or Municipal) | Based on document type | “Barangay” or “Municipal” |

This allows for more natural and descriptive certificate paragraphs.

---

## 🎯 EXPECTED RESULT

The generated PDF must look **formal, clean, and government-standard**, similar to real-life barangay and municipal certificates.

Each document should include:
- ✅ Zambales logo (header)
- ✅ Proper “Republic of the Philippines” header text
- ✅ Centered document title
- ✅ Professional certification body text
- ✅ Transparent watermark/seal
- ✅ Correct footer with “FOR” and “BY” sections (Barangay or Municipal logic)
- ✅ Working, scannable QR code for verification
- ✅ No `.docx` templates — **pure programmatic generation**

---

## 💡 Example Outputs

### **Municipal Example**
```
Republic of the Philippines
Province of Zambales
Municipality of Masinloc
OFFICE OF THE MUNICIPAL MAYOR

CERTIFICATION OF INDIGENCY

TO WHOM IT MAY CONCERN:

This is to certify that Mr. Paul John Echon Antigo, 22 years old, single, a bona fide resident of Barangay Collat, Municipality of Masinloc, Province of Zambales, has requested a Certificate of Indigency for Educational Assistance purposes.

He is currently enrolled at President Ramon Magsaysay State University (PRMSU), proving that he belongs to an indigent family with limited income.

Issued this 24th day of October, 2025, at the Office of the Municipal Mayor, Municipality of Masinloc, Province of Zambales.

FOR: MARLON E. DELOS REYES
Municipal Mayor

BY: ROMCILL AQUINO
Municipal Admin / Officer-in-Charge
```

---

### **Barangay Example**
```
Republic of the Philippines
Province of Zambales
Municipality of Masinloc
BARANGAY COLLAT
OFFICE OF THE PUNONG BARANGAY

CERTIFICATION OF RESIDENCY

TO WHOM IT MAY CONCERN:

This is to certify that Ms. Jane Marie Santos, 25 years old, single, is a resident of Purok 1, Barangay Collat, Municipality of Masinloc, Province of Zambales, and has been living there for more than ten (10) years.

This certification is issued upon her request for employment purposes.

Issued this 24th day of October, 2025, at the Office of the Punong Barangay, Barangay Collat, Masinloc, Province of Zambales.

FOR: MARLON E. DELOS REYES
Punong Barangay

BY: RODOLFO G. APOSTOL JR.
Barangay Admin / Officer-in-Charge
```

## 🧩 Resident Request Form Enhancements (Frontend + Backend Integration)

Since the generated document now includes more detailed certification text,  
the **Resident Web Portal** (React frontend) must be updated to include the following new fields when creating a document request.

### 🧱 FRONTEND CHANGES (apps/web)
- Update the “Request Document” form to include the following fields:
  | Field | Type | Description | Example |
  |--------|------|-------------|----------|
  | **Document Type** | Select | Type of certificate requested | Certificate of Indigency |
  | **Purpose** | Text | Purpose for the request | Educational Assistance |
  | **Additional Details** | Textarea (optional) | Extra information for richer text | “Currently enrolled at PRMSU Iba Campus.” |
  | **Civil Status / Age** | Optional text | Adds professional context | “22 years old, single” |
  | **Request Level** | Auto (Barangay or Municipal) | Derived from selected document type | “Municipal” or “Barangay” |

- The form must:
  - Include basic validation (required fields, max length).
  - Be **mobile-responsive** and styled consistently with other web forms.
  - Pass all new fields in the API request body to the backend endpoint.

### ⚙️ BACKEND CHANGES (apps/api)
- Extend the document request model to accept and store:
  - `purpose`
  - `additional_details`
  - `civil_status`
  - `request_level`
- Modify existing `/api/residents/requests` POST endpoint to include these fields.
- Use these fields during **PDF generation** to produce richer, contextual text.

### ✅ EXPECTED BEHAVIOR
- Residents can now provide more context when requesting documents.
- Admins can see these extra details in the Admin Dashboard.
- PDF generation automatically uses them in the certification text body.

