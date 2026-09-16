<div align="center">

# 🛡️ WORLD MONITOR

**Security Assessment & Proof-of-Concept Documentation Platform**

[![Live Demo](https://img.shields.io/badge/🚀%20LIVE%20DEMO-Open%20Application-success?style=for-the-badge)](https://world-monitor-ru3c.onrender.com/)
[![GitHub](https://img.shields.io/badge/💻%20GITHUB-Repository-black?style=for-the-badge&logo=github)](https://github.com/saranyareddy77/world-monitor)

</div>

## 🚀 Live Demo

🌐 **Security Assessment Application:** [Open World Monitor](https://world-monitor-ru3c.onrender.com/)

💻 **GitHub Repository:** [saranyareddy77/world-monitor](https://github.com/saranyareddy77/world-monitor)

The application provides a centralized interface for entering an application link and vulnerability name, searching assessment data, and displaying complete vulnerability findings with proof-of-concept evidence.

---

## 📖 About the Project

**WORLD MONITOR** is a security assessment platform designed to document vulnerabilities identified during authorized security testing.

The platform allows a security analyst to enter the application/project link and vulnerability name. When a matching finding exists, the platform displays the complete vulnerability assessment including technical details, severity, reproduction steps, proof of concept, evidence, business impact, and remediation recommendations.

---

## ✨ Key Features

- 🛡️ Security vulnerability assessment
- 🔎 Vulnerability search
- 🌐 Application/project link input
- 📋 Complete vulnerability findings
- ⚠️ Severity and CVSS information
- 🧪 Controlled proof-of-concept
- 📸 Screenshot evidence
- 🎥 PoC video evidence
- 💼 Business impact assessment
- 🛠️ Remediation recommendations
- 📄 Security report generation
- 📥 Evidence and report download
- 🗄️ Supabase database integration
- 🎨 Professional peach-themed interface
- ☁️ Render deployment

---

## 🛠️ Technology Stack

### 🎨 Frontend

- ⚛️ React
- ⚡ Vite
- 🔷 TypeScript
- 🎨 CSS

### ⚙️ Backend & Database

- 🟢 Node.js
- 🚀 Express.js
- 🗄️ Supabase
- 🐘 PostgreSQL

### 🛡️ Security Assessment

- OWASP ZAP
- Python
- Security assessment datasets
- Evidence collection

### ☁️ Deployment

- Render

---

## 🔄 How It Works

The application follows a simple security assessment workflow:

1. 🌐 Open the World Monitor Security Assessment platform.
2. 🔗 Enter the authorized application/project link.
3. 🔎 Enter the vulnerability name.
4. 🚀 Search the assessment dataset.
5. ✅ If found, display the complete vulnerability finding.
6. ❌ If not found, display **Not Found**.
7. 📋 Display vulnerability title and description.
8. 🎯 Display affected component and severity.
9. 📊 Display CVSS/CWE/WASC/OWASP information where available.
10. 🔄 Display steps to reproduce.
11. 🧪 Display the controlled proof of concept.
12. 📸 Display screenshots and supporting evidence.
13. 🎥 Display PoC video evidence where available.
14. 💼 Display business impact.
15. 🛠️ Display remediation recommendations.
16. 📥 Allow available reports and evidence to be downloaded.

---

## 🧪 Vulnerability Assessment

For every vulnerability found, the platform provides a complete assessment containing:

### Vulnerability Title

Name of the identified security vulnerability.

### Description

Technical explanation of the identified issue.

### Affected Component

Application component, endpoint, security control, or functionality affected by the vulnerability.

### Severity Rating

Severity classification and CVSS information where available.

### Steps to Reproduce

Clear steps required to reproduce and validate the finding in an authorized testing environment.

### Proof of Concept

A controlled proof-of-concept demonstrating the security issue without affecting production users or data.

### Evidence

Supporting screenshots, HTTP requests/responses, OWASP ZAP findings, browser evidence, and PoC videos where available.

### Business Impact Assessment

Description of the potential confidentiality, integrity, availability, privacy, or business impact associated with the finding.

### Remediation Recommendations

Practical recommendations for mitigating or resolving the identified security issue.

---

## 📋 Vulnerability Report

| Field | Information |
|---|---|
| Vulnerability Title | Security vulnerability name |
| Description | Technical vulnerability description |
| Affected Component | Affected application component |
| Affected URL | Relevant application URL |
| Parameter | Relevant input parameter |
| Severity | Vulnerability severity |
| CVSS | CVSS score/vector |
| CWE | CWE classification |
| WASC | WASC classification |
| OWASP | OWASP category |
| Detection Source | Security testing tool/source |
| Steps to Reproduce | Reproduction procedure |
| Proof of Concept | Controlled PoC |
| Screenshots | Visual evidence |
| Video | PoC video evidence |
| Business Impact | Potential impact |
| Remediation | Recommended mitigation |

---

## 🧪 Example Vulnerability

### ⚠️ CSP: Failure to Define Directive with No Fallback

**Description:**  
A Content Security Policy configuration issue identified during an authorized security assessment.

**Affected Component:**  
Web application security headers.

**Severity:** Medium

**Confidence:** High

**CWE:** CWE-693

**WASC:** WASC-15

**Detection Source:** OWASP ZAP

**Steps to Reproduce:**

1. Open the authorized application.
2. Inspect the HTTP response headers.
3. Locate the `Content-Security-Policy` header.
4. Review the configured directives.
5. Capture the relevant security-header evidence.

**Proof of Concept:**  
Controlled validation of the observed security-header configuration.

**Evidence:**  
OWASP ZAP alert screenshot, browser Developer Tools screenshot, HTTP response-header evidence, and supporting application screenshots.

**Business Impact:**  
Documents the potential security impact associated with the observed configuration.

**Remediation:**  
Review and appropriately configure the Content Security Policy directives.

---

## 🏗️ Project Architecture

```text
                         👤 Security Analyst
                                │
                                ▼
                     🌐 Security Assessment UI
                                │
                                ▼
                    🔗 Application / Project Link
                                +
                       🔎 Vulnerability Name
                                │
                                ▼
                       🔍 Vulnerability Search
                                │
                                ▼
                        🗄️ Assessment Dataset
                                │
                         ┌──────┴──────┐
                         │             │
                       FOUND       NOT FOUND
                         │             │
                         ▼             ▼
                 📋 Vulnerability   ❌ Not Found
                     Details
                         │
                         ▼
                    🧪 Proof of Concept
                         │
                         ▼
                    📸 Evidence
                         │
                         ▼
                  🎥 PoC Video
                         │
                         ▼
                  💼 Business Impact
                         │
                         ▼
                 🛠️ Remediation
                         │
                         ▼
                  📄 Security Report
                         │
                         ▼
                     📥 Download
