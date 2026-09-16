<div align="center">

# 🛡️ WORLD MONITOR SECURITY ASSESSMENT PLATFORM

<p><strong>Authorized Web Application Security Assessment & Proof-of-Concept Documentation System</strong></p>

<p>
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-workflow">Workflow</a> •
  <a href="#-technology-stack">Technology</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-setup">Setup</a> •
  <a href="#-security-assessment">Assessment</a>
</p>

</div>

---

## 📌 Overview

**World Monitor Security Assessment Platform** is a prototype security-assessment application designed to organize, document, and present authorized security testing results for the World Monitor web application.

The platform provides a structured workflow in which an assessor enters:

- 🌐 **Application / Project URL**
- 🔎 **Vulnerability name**

The system then checks the available vulnerability dataset/evidence. When a matching vulnerability is available, the platform presents the complete assessment record in one place, including the vulnerability description, affected component, severity, reproduction procedure, proof-of-concept evidence, business impact, remediation guidance, and supporting screenshots/evidence.

If the requested vulnerability is not present in the dataset, the interface displays a clear **Not Found** state rather than showing unrelated assessment information.

> ⚠️ **Authorized testing statement:** Testing must be performed only on systems for which authorization has been obtained. No actions should affect production users or production data. Exploitation is limited to controlled proof-of-concept validation and must comply with applicable laws, organizational policies, and ethical-hacking guidelines.

---

## 🎯 Project Objectives

The prototype is intended to support an authorized security assessment covering:

- 🔐 Authentication and session management
- 👤 Authorization and access control
- 🧾 Input validation and data handling
- 🔌 API security
- 🖥️ Client-side security controls
- 🔒 Secure communication mechanisms
- 🗄️ Data storage and privacy protections
- 📊 Vulnerability evidence and reporting

### Success Criteria

The assessment workflow is considered successful when:

- At least one valid vulnerability is identified and documented.
- Evidence supports the existence of the vulnerability.
- Risk and impact are clearly explained.
- A safe proof-of-concept is documented.
- Practical remediation recommendations are provided.
- Evidence can be viewed and downloaded for reporting.

---

## ✨ Features

### 🔎 Vulnerability Search

The initial screen intentionally stays simple. The assessor enters:

1. Project / application URL
2. Vulnerability name
3. Search

Only after a matching vulnerability is found does the complete evidence/report view appear.

### 📋 Complete Vulnerability Record

Each discovered vulnerability can contain:

- Vulnerability title
- Description
- Affected component
- Affected URL
- Parameter / input vector
- Severity
- Confidence
- CVSS score
- CWE ID
- WASC ID
- OWASP category
- Alert reference
- Steps to reproduce
- Proof of concept
- Evidence screenshots
- Business impact
- Remediation recommendations
- Testing constraints
- Authorization / compliance notes

### 🖼️ Evidence

Assessment evidence can include:

- ZAP screenshots
- Browser/DevTools screenshots
- HTTP request/response evidence
- Application screenshots
- Controlled PoC output
- Additional supporting images

### 📥 Downloadable Evidence

The prototype is designed so evidence can be downloaded individually or included in a generated assessment report.

---

## 🔄 Workflow

```text
                    👤 Security Analyst
                           │
                           ▼
              ┌─────────────────────────┐
              │   Assessment Search UI  │
              │                         │
              │  Project URL             │
              │  Vulnerability Name     │
              └────────────┬────────────┘
                           │
                     Search Request
                           │
                           ▼
              ┌─────────────────────────┐
              │ Vulnerability Dataset   │
              │ / Local Test Environment│
              │      (Dummy Data)       │
              └────────────┬────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
              Found                Not Found
                │                     │
                ▼                     ▼
      ┌───────────────────┐     ┌──────────────┐
      │ Evidence / PoC    │     │ Not Found    │
      │ Generator / Viewer│     │ Message      │
      └─────────┬─────────┘     └──────────────┘
                │
                ▼
      ┌─────────────────────────────┐
      │ Complete Assessment Record  │
      │                             │
      │ CVSS • Impact • PoC          │
      │ Evidence • Screenshots      │
      │ Reproduction • Remediation  │
      └─────────────┬───────────────┘
                    │
                    ▼
              📥 Download Report
```

---

## 🧪 Example Assessment

The prototype can contain controlled/dummy assessment records before real authorized assessment data is imported.

### Example Vulnerability

**Content Security Policy — Missing/Weak Directive Configuration**

| Field | Example |
|---|---|
| Title | CSP Directive Configuration Issue |
| Category | Client-side Security |
| Affected Component | Web application response headers |
| Severity | Medium |
| Confidence | High |
| CWE | CWE-693 |
| Evidence Source | Authorized security assessment |
| Validation | HTTP response / security scanner evidence |

### Evidence

A supporting screenshot may show the security scanner alert and the relevant HTTP response header.

For example:

```text
Content-Security-Policy:
default-src 'self';
connect-src 'self' https: wss: blob: data:;
img-src 'self' data: blob: https:;
style-src 'self' 'unsafe-inline';
script-src 'self' 'strict-dynamic' 'nonce-...';
frame-src 'self' https://www.worldmonitor.app;
```

The exact evidence shown by the application should be taken from the authorized assessment record rather than fabricated as production evidence.

---

## 📸 Evidence Capture

For every confirmed vulnerability, the assessment record should support a screenshot/evidence item containing:

1. Target application or relevant testing screen.
2. Vulnerability/alert name.
3. Relevant request or response.
4. Relevant header, parameter, or application behavior.
5. Timestamp where appropriate.
6. Optional annotation explaining what proves the issue.

Example evidence organization:

```text
data/
└── evidence/
    ├── CSP/
    │   ├── screenshot-01.png
    │   ├── screenshot-02.png
    │   └── poc-notes.md
    │
    ├── Authentication/
    │   ├── screenshot-01.png
    │   └── poc-notes.md
    │
    └── Authorization/
        ├── screenshot-01.png
        └── poc-notes.md
```

---

## 🛠️ Technology Stack

### 🎨 Frontend

- ⚛️ React
- ⚡ Vite
- 🟨 TypeScript / JavaScript
- 🎨 CSS
- 🧩 Component-based UI

### 🗄️ Database

- Supabase
- PostgreSQL

The database can store structured vulnerability assessment records, metadata, PoC descriptions, evidence references, severity information, and remediation guidance.

### 🐍 Supporting Scripts

The project also contains supporting Python scripts for tasks such as dataset parsing and evidence extraction.

### 🔐 Security Assessment Tools

The assessment workflow can use authorized tools such as:

- OWASP ZAP
- Browser Developer Tools
- HTTP request/response inspection
- Controlled local test environments

---

## 🗃️ Data Model

A vulnerability record can contain fields such as:

```text
id
vulnerability_number
title
assessment_type
description
affected_component
affected_url
parameter
severity
confidence
cvss
cwe_id
wasc_id
owasp
alert_reference
steps_to_reproduce
proof_of_concept
business_impact
remediation
evidence
screenshot
video
authorization_note
created_at
updated_at
```

The prototype can initially use dummy records. These records can later be replaced with authorized assessment data.

---

## 📂 Project Structure

```text
worldmonitor/
│
├── data/
│   └── vulnerability datasets / dummy assessment data
│
├── extracted_evidence/
│   └── extracted security evidence
│
├── public/
│   └── public assets
│
├── src/
│   └── React/Vite application source
│
├── scripts/
│   ├── parse_dataset.py
│   └── extract_evidence.py
│
├── storage_assets/
│   └── screenshots / evidence assets
│
├── supabase/
│   └── schema.sql
│
├── dist/
│   └── production build
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd worldmonitor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`.

Example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit private credentials, service-role keys, passwords, or other secrets.

### 4. Start the development server

The project's Vite development script is:

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

---

## 🗄️ Supabase Setup

The project contains a Supabase schema under:

```text
supabase/schema.sql
```

The database can be used to store vulnerability assessment records.

A typical prototype flow is:

```text
React / Vite
     │
     │ Supabase client
     ▼
Supabase
     │
     ├── Vulnerabilities
     ├── Evidence
     ├── PoC metadata
     └── Assessment records
```

For local/demo development, the application may use dummy/local data as a fallback. Real assessment information should only be inserted after authorization and appropriate access controls are configured.

---

## 🔍 Assessment Search Experience

The intended UI sequence is deliberately minimal.

### Screen 1 — Search

```text
┌───────────────────────────────────────────────┐
│                                               │
│       🛡️ Security Assessment Platform        │
│                                               │
│  Project / Application URL                    │
│  ┌─────────────────────────────────────────┐  │
│  │ https://example.com                     │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Vulnerability Name                          │
│  ┌─────────────────────────────────────────┐  │
│  │ Content Security Policy                 │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│              [ Search Assessment ]             │
│                                               │
└───────────────────────────────────────────────┘
```

### Screen 2A — Vulnerability Found

Only after a matching record is found:

```text
┌───────────────────────────────────────────────┐
│ Vulnerability Found                           │
│                                               │
│ Title: CSP Directive Configuration Issue      │
│ Severity: Medium                              │
│ CVSS: 5.x                                     │
│                                               │
│ Description                                   │
│ Affected Component                            │
│ Steps to Reproduce                            │
│ Proof of Concept                              │
│ Evidence                                      │
│ Business Impact                               │
│ Remediation                                   │
│                                               │
│ [ View Screenshot ] [ Download Evidence ]     │
│ [ Download Report ]                           │
└───────────────────────────────────────────────┘
```

### Screen 2B — Vulnerability Not Found

```text
┌───────────────────────────────────────────────┐
│                                               │
│                 Not Found                     │
│                                               │
│ No assessment record matched the requested    │
│ project URL and vulnerability name.            │
│                                               │
│          [ Search Another Vulnerability ]     │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 📊 Vulnerability Documentation Format

Every confirmed vulnerability should follow the same reporting structure.

### 1. Vulnerability Title

Clear name of the identified issue.

### 2. Description

Technical explanation of what was observed and why it represents a security weakness.

### 3. Affected Component

The application component, endpoint, page, API, configuration, or control involved.

### 4. Severity / CVSS

Severity and CVSS information should be based on the evidence and the selected CVSS methodology/version.

### 5. Steps to Reproduce

Document only the minimum controlled steps necessary to validate the issue.

### 6. Proof of Concept

A safe demonstration showing the security behavior without causing damage or accessing unrelated data.

### 7. Evidence

Screenshots, HTTP request/response captures, logs, or other supporting material.

### 8. Business Impact

Explain potential confidentiality, integrity, availability, privacy, operational, or business consequences supported by the assessment.

### 9. Remediation

Provide practical mitigation and configuration recommendations.

### 10. Testing Constraints

```text
Testing must be performed only on authorized systems.

No actions should affect production users or data.

Exploitation should be limited to proof-of-concept validation.

Compliance with applicable laws, policies, and ethical hacking
guidelines is required.
```

---

## 🎨 UI Design

The prototype uses a professional **peach-based visual theme**.

Design principles:

- 🍑 Peach primary accent
- ⚪ Clean neutral surfaces
- 🖤 High-contrast text
- 🧩 Minimal cards
- 📱 Responsive layout
- 🖼️ Limited supporting imagery
- 📊 Clear evidence presentation
- 📥 Obvious download actions
- 🔎 Search-first experience

Images should support the security evidence rather than overwhelm the assessment interface.

---

## 📥 Evidence & Report Downloads

The application should provide download actions for available evidence.

Recommended download types:

```text
📷 Screenshot
🎥 PoC Video
📄 Vulnerability Report
📦 Evidence Bundle
```

A report bundle may contain:

```text
assessment/
├── vulnerability-report.pdf
├── evidence/
│   ├── screenshot-01.png
│   ├── screenshot-02.png
│   └── poc-video.mp4
└── metadata.json
```

Only evidence that has actually been captured or uploaded should be offered as downloadable evidence.

---

## 🔐 Security & Ethical Testing Constraints

This project is intended for **authorized security assessment and controlled proof-of-concept validation**.

### Required constraints

- ✅ Test only systems for which permission has been obtained.
- ✅ Prefer isolated/local test environments for demonstrations.
- ✅ Use dummy data whenever possible.
- ✅ Avoid destructive actions.
- ✅ Avoid modifying production records.
- ✅ Do not expose credentials, tokens, cookies, or personal information in screenshots.
- ✅ Redact sensitive information before publishing evidence.
- ✅ Keep PoCs limited to demonstrating the security issue.
- ✅ Follow applicable laws, organizational policies, and responsible-disclosure requirements.

---

## 🧪 Prototype → Real Assessment Data

The project is intentionally designed so the initial database can contain **dummy vulnerability records**.

Later, the dataset can be replaced with authorized assessment results:

```text
Dummy Dataset
      │
      ▼
Prototype Search
      │
      ▼
Validated UI / Database
      │
      ▼
Authorized Assessment Data
      │
      ▼
Evidence + PoC
      │
      ▼
Final Security Report
```

The UI and database schema should remain stable while the underlying records are replaced.

---

## 📝 Example Evidence Record

```json
{
  "title": "CSP Directive Configuration Issue",
  "assessment_type": "dynamic",
  "severity": "Medium",
  "confidence": "High",
  "affected_component": "Web application response headers",
  "affected_url": "https://example.com/",
  "steps_to_reproduce": [
    "Open the authorized application.",
    "Inspect the HTTP response headers.",
    "Locate the Content-Security-Policy header.",
    "Compare the configured directives with the expected security policy."
  ],
  "proof_of_concept": "Controlled evidence demonstrating the identified configuration weakness.",
  "business_impact": "Document the potential security impact supported by the assessment.",
  "remediation": "Review and appropriately restrict the affected CSP directives.",
  "evidence": [
    "evidence/screenshot-01.png"
  ]
}
```

> This example is a **prototype record**, not evidence that a particular production system contains the issue.

---

## 🧭 Recommended Assessment Lifecycle

```text
1. Obtain authorization
          │
          ▼
2. Define assessment scope
          │
          ▼
3. Identify application surface
          │
          ▼
4. Perform controlled testing
          │
          ▼
5. Validate suspected findings
          │
          ▼
6. Capture evidence
          │
          ▼
7. Document safe PoC
          │
          ▼
8. Assess impact
          │
          ▼
9. Provide remediation
          │
          ▼
10. Generate final report
```

---

## 🤝 Contribution

Contributions should preserve the project's security-assessment purpose.

When adding vulnerability records:

- Use clearly documented sources.
- Separate dummy data from verified evidence.
- Do not commit secrets or credentials.
- Do not include unauthorized personal or production data.
- Include reproducible evidence for verified findings.
- Keep PoCs controlled and non-destructive.

---

## 📄 License & Responsible Use

Use this project only for authorized security testing, education, research, and controlled assessment activities.

The maintainers do not authorize testing against systems simply because they are publicly accessible. Authorization and scope must be established independently before testing.

---

<div align="center">

### 🛡️ World Monitor Security Assessment Platform

**Search → Validate → Evidence → PoC → Report**

<p>Built for structured, authorized security assessment documentation.</p>

</div>
