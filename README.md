# FixProof — "Reported. Repaired. Verified."

> **Core Principle**: A complaint being marked **"Fixed"** does not prove the underlying problem was actually fixed. FixProof helps citizens, independent reviewers, and participating authorities assess civic repair claims using photographic evidence, tamper checks, and transparent verification workflows.

---

## 🌟 Key Architecture & Capabilities

### 1. The 5 Core Civic Questions FixProof Answers
1. **What exactly was reported?** — Immutable original photograph, GPS geostamp, category, description, and cryptographic SHA-256 fingerprint.
2. **What evidence supports the repair claim?** — After-repair photograph submitted by authorized maintenance team with contractor credentials, materials used, and capture timestamp.
3. **Do the photographs plausibly show the same location?** — Stationary background landmark matching (curbs, utility poles, pavement seams, tree alignment) and geodetic Haversine distance threshold check (<150m).
4. **Does the visible defect appear resolved?** — Multimodal visual analysis (Gemini 1.5 Flash / Computer Vision Engine) evaluating surface continuity, asphalt compaction, and cavity depth.
5. **What happens if the repair cannot be verified?** — Citizens challenge false closures with live on-site reinspection evidence, triggering independent human review and case reopening.

---

## 🔄 Dual Independent State Machines

FixProof strictly maintains two separated state machines to prevent municipal authorities from declaring closure without independent proof:

| Work Status (Operational) | Evidence Verification Status (Independent) |
| :--- | :--- |
| `Submitted` | `Not yet assessed` |
| `Under review` | `Awaiting repair evidence` |
| `Work scheduled` | `AI assessment pending` |
| `In progress` | `Appears resolved` (AI) |
| `Repair claimed` | `Appears unresolved` (AI) |
| `Closed` (Authority) | `Partially resolved` (AI) |
| `Reopened` (Disputed) | `Insufficient evidence` (Scene mismatch / Blur) |
| | `Human review required` |
| | `Human verified resolved` (Reviewer) |
| | `Human verified unresolved` (Reviewer) |

> **Critical Design Principle**: A case can be marked **"Closed"** by an authority while remaining **"Appears Unresolved"** or **"Disputed"** in the public verification ledger.

---

## 🛡️ Image Integrity & Anti-Abuse System

- **SHA-256 Cryptographic Fingerprint**: Every uploaded file is hashed at the byte level to guarantee original evidence cannot be silently modified or swapped.
- **Perceptual Difference Hashing (`dHash`)**: Generates 64-bit structural hashes to catch identical or re-compressed images submitted as new evidence.
- **Duplicate-Photo Catch**: If an authority submits the citizen's original before photo as "after repair" proof, the engine detects the collision and flags fraudulent closure.
- **Optical Blur Detection**: Laplacian sharpness estimation rejects motion-smeared or unfocused evidence (`Insufficient evidence — recapture required`).
- **Geodetic Distance Validation**: Haversine distance calculation flags claimed repairs photographed >600m away from the reported defect site.

---

## 📱 Mobile-First User Interfaces

1. **Home Screen (`/`)**: Value proposition within seconds, live empirical audit metrics, quick action launcher, and featured civic case feed.
2. **Report a Defect (`/report`)**: Guided 4-step wizard:
   - Category picker (Potholes, Garbage, Footpaths, Drainage, Infrastructure)
   - Photographic evidence capture via in-app camera with consented GPS or standard file upload
   - Geotagging map with interactive pin placement
   - AI Smart Assist drafting description and summary
3. **Report Detail (`/reports/[id]`)**: Full case file, dual status badges, forensic evidence cards with copyable SHA-256 hashes, authority claim modal, citizen dispute modal, and immutable event history.
4. **AI Evidence Comparison Center (`/reports/[id]/compare`)**: Visual centerpiece featuring:
   - Interactive Before/After slider with draggable grab handle and keyboard navigation (`←` `→`)
   - Side-by-side comparison mode
   - Defect bounding box overlays
   - Evidence quality indicators (Scene match, Quality, Location plausibility, Remaining defect)
   - Structured JSON schema viewer
   - Strict distinction between AI assessment and human-verified ruling
5. **Civic Map (`/map`)**: Interactive Leaflet map with category-specific colored pins, dual status filters, street search, and instant preview card drawers.
6. **My Cases & Alerts (`/my-reports`)**: Citizen portal tracking submitted reports, notifications inbox, and dispute status.
7. **Authority Operations Hub (`/authority`)**: Dispatch management, work status transitions, after-photo upload, and CSV data export.
8. **Civic Moderation Board (`/moderator`)**: Contested closures queue, integrity fraud flags, and documented human ruling panel with AI override capability.
9. **Public Transparency Analytics (`/analytics`)**: Real computed metrics (total cases, verified resolution rate, false closure catch rate, median verification time) with a toggle between all cases and live-only reports.

---

## 🧪 10 Synthetic Demonstration Cases (Pre-seeded)

FixProof comes preloaded with 10 synthetic cases covering the spectrum of real-world civic scenarios:

1. `FP-000101`: **Pothole properly repaired** — Clean hot-mix asphalt patch flush with pavement (`Appears Resolved`).
2. `FP-000102`: **Pothole visibly remains** — Authority marked "Closed", but photo shows gaping crater persists (`Appears Unresolved` - **False Closure Caught**).
3. `FP-000103`: **Pothole partial repair** — Loose gravel poured into inner pit without asphalt seal (`Partially Resolved`).
4. `FP-000104`: **Garbage dump cleared** — Refuse heap cleared, sidewalk swept clean (`Appears Resolved`).
5. `FP-000105`: **Garbage dump remains** — Refuse heap still present in contractor photo (`Appears Unresolved`).
6. `FP-000106`: **Wrong location submitted** — Contractor submitted a park photo for an MG Road storm drain (`Insufficient Evidence — Scene Mismatch`).
7. `FP-000107`: **Optical motion blur** — Blurry photo submitted (`Insufficient Evidence — Blur Detected`).
8. `FP-000108`: **Duplicate photo fraud attempt** — Contractor re-uploaded original complaint photo as completion proof (`Anti-Fraud Alert: Exact SHA-256 match`).
9. `FP-000109`: **Location mismatch** — Repair photo captured 13.8km away from Whitefield defect (`Location Inconsistency Flag`).
10. `FP-000110`: **Disputed & Overridden case** — Authority closed case, citizen disputed with fresh on-site photo, independent moderator upheld dispute and reopened case (`Human Verified Unresolved`).

---

## 🌐 Multilingual Accessibility & Persona Switcher

- **Languages Supported**: English, Hindi (हिंदी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ).
- **Instant Role Switcher**:
  - **Citizen** (`Aditi Sharma`) — report issues, track status, dispute claims.
  - **Authority Engineer** (`Rajesh Gowda, BBMP`) — update dispatch status, upload repair proof.
  - **Civic Moderator** (`Suresh Menon`) — review disputes, override AI assessments with justification.
  - **Public Visitor** — explore civic map and audit metrics without PII.

---

## 🚀 Running the Project

### Prerequisites
- Node.js v20+ (tested on Node.js v26.13)
- npm

### Quickstart
```bash
# 1. Install dependencies
npm install

# 2. Build production application
npm run build

# 3. Start production server
npm run start
# Server listens on http://localhost:3000

# Run automated integrity and verification test suite:
node scripts/test-database.js
node scripts/test-auth-rbac.js
node scripts/test-evidence-integrity.js
node scripts/test-ai-verifier.js
```

---

## ☁️ Cloud Architecture, Supabase & Render Deployment

FixProof supports dual-engine persistence (Supabase PostgreSQL in cloud production, embedded SQLite for local/offline execution):

* **Supabase PostgreSQL Schema**: [`supabase/schema.sql`](./supabase/schema.sql) with full DDL, RLS policies, and storage bucket definitions.
* **Supabase Demonstration Seed**: [`supabase/seed.sql`](./supabase/seed.sql) with 10 synthetic civic test cases, users, organizations, and evidence hashes.
* **Render Blueprint**: [`render.yaml`](./render.yaml) and production [`Dockerfile`](./Dockerfile).
* **Live Deployment**: **[https://fixproof-pi.vercel.app](https://fixproof-pi.vercel.app)**
* **Government Officials Directory**: **[https://fixproof-pi.vercel.app/contacts](https://fixproof-pi.vercel.app/contacts)**


