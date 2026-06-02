# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## AI Agent untuk Sistem E-Voting OSIS

**Versi:** 1.0  
**Tanggal Publikasi:** Juni 2026  
**Status:** Active Development  
**Owner:** Tim Development E-Voting OSIS  

---

## 1. EXECUTIVE SUMMARY

### 1.1 Deskripsi Produk
AI Agent untuk Sistem E-Voting OSIS adalah sistem cerdas yang mengotomatisasi, memantau, dan mengoptimalkan seluruh alur pemilihan digital mulai dari persiapan hingga audit hasil. Agent ini beroperasi sebagai "orchestrator" terpusat yang mengelola logika bisnis, validasi keamanan, dan interaksi antar komponen sistem.

### 1.2 Visi
Menciptakan ekosistem E-Voting yang **aman, transparan, dan amanah** dengan menggunakan kecerdasan buatan untuk:
- Mengurangi kesalahan manual petugas
- Meningkatkan keamanan sistem secara real-time
- Memberikan audit trail yang lengkap dan terverifikasi
- Meningkatkan pengalaman pengguna (siswa, petugas, panitia)

### 1.3 Value Proposition
- ✅ **Automasi End-to-End:** Mengeliminasi tugas-tugas berulang dan error-prone
- ✅ **Keamanan Berlapis:** Validasi real-time dengan multiple checkpoints
- ✅ **Transparansi Total:** Setiap aksi tercatat dan dapat diaudit
- ✅ **Skalabilitas:** Dapat menangani ratusan siswa dan bilik voting secara bersamaan
- ✅ **Resilience:** System fallback dan manual override jika terjadi kegagalan

---

## 2. PRODUCT GOALS & OBJECTIVES

### 2.1 Primary Goals
1. **Memastikan Integritas Voting**
   - Setiap suara tercatat dengan akurat dan tidak dapat diubah
   - NIS tidak pernah tersimpan dalam database hasil akhir
   - Append-only database untuk mencegah manipulasi data

2. **Mengotomatisasi Alur Voting Kompleks**
   - Dari QR generation hingga token verification berjalan seamless
   - Reduce manual intervention dari petugas
   - Standardisasi proses di semua bilik

3. **Menyediakan Audit Trail Komprehensif**
   - Setiap aksi tercatat dengan timestamp dan user ID
   - Dashboard audit real-time untuk monitoring
   - Historical logs untuk forensik pasca-pemilu

4. **Meningkatkan UX & Aksesibilitas**
   - Interface yang mudah dipahami siswa
   - Support untuk berbagai perangkat (mobile, tablet, desktop)
   - Kiosk mode untuk bilik voting yang secure

### 2.2 Secondary Goals
- Mengurangi waktu setup dan breakdown pemilu
- Memberikan insight analytics real-time kepada panitia
- Mendeteksi anomali dan potensi fraud secara otomatis
- Meningkatkan kepercayaan stakeholder terhadap sistem e-voting

---

## 3. SCOPE & DELIVERABLES

### 3.1 In-Scope (AI Agent)
```
┌─────────────────────────────────────────────────────┐
│          AI Agent Core Responsibilities             │
├─────────────────────────────────────────────────────┤
│ ✓ User & Session Management                        │
│ ✓ QR Code Generation & Validation                  │
│ ✓ Voter Authentication & Verification              │
│ ✓ Booth Activation & Synchronization               │
│ ✓ Vote Recording & Tokenization                    │
│ ✓ Audit Trail Management                           │
│ ✓ Real-time Monitoring & Alerts                    │
│ ✓ Data Validation & Integrity Check                │
│ ✓ Security Policy Enforcement                      │
│ ✓ Anomaly Detection                                │
│ ✓ Report Generation & Analytics                    │
│ ✓ System Health Monitoring                         │
└─────────────────────────────────────────────────────┘
```

### 3.2 Out-of-Scope
- Physical infrastructure design (bilik, hardware)
- UI/UX Design (handled by frontend team)
- Network infrastructure
- Backup & disaster recovery infrastructure (will be handled by DevOps)
- Legal compliance documentation

### 3.3 Key Deliverables
1. **AI Agent Core Engine**
   - Business logic orchestrator
   - State management system
   - Event processing pipeline

2. **API Specification & Implementation**
   - RESTful endpoints untuk semua operasi
   - WebSocket support untuk real-time updates (optional V2)
   - Request/response validation

3. **Database Schema & Migrations**
   - Complete Supabase PostgreSQL schema
   - Indexes untuk performance optimization
   - Audit log structure

4. **Security Module**
   - Encryption/Decryption utilities
   - Hash generation & validation
   - Token management system

5. **Monitoring & Logging System**
   - Comprehensive logging infrastructure
   - Real-time alerts mechanism
   - Audit dashboard backend

6. **Testing Suite**
   - Unit tests (>80% coverage)
   - Integration tests
   - Security tests

7. **Documentation**
   - API documentation (OpenAPI/Swagger)
   - Developer guide
   - Operational runbook

---

## 4. USER ROLES & PERSONAS

### 4.1 User Roles
```
┌──────────────┬────────────────────────────────┬──────────────────────┐
│ Role         │ Responsibilities               │ Access Level         │
├──────────────┼────────────────────────────────┼──────────────────────┤
│ Siswa        │ Generate QR, Vote              │ Public + Token Auth  │
│ Petugas      │ Scan QR, Aktivasi Bilik        │ Protected (/staff)   │
│ Panitia      │ Monitor, Unlock Bilik, Review  │ Admin Panel          │
│ Admin        │ Setup, Config, Emergency Reset │ Super Admin          │
│ Auditor      │ Verify Token, Check Integrity  │ Read-only Dashboard  │
└──────────────┴────────────────────────────────┴──────────────────────┘
```

### 4.2 Personas Detail

**Persona 1: Andi (Siswa)**
- Usia: 16-17 tahun
- Tech-Savvy: Medium
- Goal: Voting dengan mudah dan aman tanpa khawatir suara tidak tercatat
- Pain Point: Takut QR code hilang, tidak paham token

**Persona 2: Ibu Siti (Petugas)**
- Usia: 35-40 tahun
- Tech-Savvy: Low-Medium
- Goal: Menjalankan tugas scanning dengan cepat dan benar
- Pain Point: Gagal scan QR, bingung dengan error messages

**Persona 3: Pak Hendra (Panitia)**
- Usia: 25-30 tahun
- Tech-Savvy: High
- Goal: Monitor real-time, detect issues, ensure integrity
- Pain Point: Data tidak akurat, tidak ada visibility terhadap anomali

**Persona 4: Bu Dewi (Auditor Independen)**
- Usia: 40-45 tahun
- Tech-Savvy: Medium
- Goal: Verify hasil tanpa akses ke backend, maintain transparency
- Pain Point: Trust issues, need easy-to-understand verification mechanism

---

## 5. FUNCTIONAL REQUIREMENTS

### 5.1 QR Code Management Module

#### FR-QR-001: QR Code Generation
**Description:** Sistem men-generate QR Code yang berisi NIS + security hash untuk setiap siswa.

**Functional Requirements:**
- Input: NIS (dari database siswa)
- Process:
  - Generate unique salt untuk setiap NIS
  - Create hash: SHA256(NIS + salt + SECRET_KEY)
  - Encode QR dengan format: `NIS:HASH:SALT`
- Output: QR Code image (PNG/SVG)
- Storage: Simpan di Supabase dengan status `qr_generated`

**Data Structure:**
```sql
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY,
  nis VARCHAR(20) NOT NULL UNIQUE,
  hash VARCHAR(64) NOT NULL,
  salt VARCHAR(32) NOT NULL,
  qr_data TEXT NOT NULL,
  status ENUM ('active', 'used', 'revoked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  generated_by VARCHAR(50) DEFAULT 'system',
  metadata JSONB
);
```

#### FR-QR-002: QR Code Validation
**Description:** Validate QR Code saat petugas scan.

**Functional Requirements:**
- Input: Raw QR scan data
- Validation Steps:
  1. Parse QR data (extract NIS, HASH, SALT)
  2. Verify format correctness
  3. Recalculate hash: SHA256(NIS + SALT + SECRET_KEY)
  4. Compare calculated hash dengan scanned hash
  5. Check QR status (must be 'active')
  6. Verify QR hasn't been used before
- Output: 
  - ✓ VALID: Return NIS + student profile
  - ✗ INVALID: Return error message + code
- Side Effects: Log validation attempt

**Error Codes:**
- `QR_INVALID_FORMAT`: Data dalam QR tidak sesuai format
- `QR_HASH_MISMATCH`: Hash validation gagal
- `QR_ALREADY_USED`: QR sudah pernah digunakan
- `QR_REVOKED`: QR telah di-revoke
- `QR_NOT_FOUND`: NIS tidak ditemukan

---

### 5.2 Student Authentication & Verification Module

#### FR-AUTH-001: Voter Profile Lookup
**Description:** Retrieve profil siswa dari database untuk verifikasi petugas.

**Functional Requirements:**
- Input: NIS (dari QR validation)
- Query: SELECT name, class, photo, registration_status FROM students WHERE nis = ?
- Return: Student object dengan fields:
  ```json
  {
    "id": "uuid",
    "nis": "12345",
    "name": "Andi Wijaya",
    "class": "XI-A",
    "photo_url": "https://...",
    "status": "eligible",
    "registration_date": "2026-06-01",
    "last_verified": null
  }
  ```
- Validation: Pastikan siswa masuk dalam daftar pemilih

#### FR-AUTH-002: Physical Verification Logging
**Description:** Catat bahwa siswa telah diverifikasi secara fisik oleh petugas.

**Functional Requirements:**
- Input: NIS, petugas ID, booth ID, verification status (approved/rejected)
- Process:
  - Create verification record
  - If approved: Unlock booth dengan time-bound session (5 menit)
  - If rejected: Reject access, log reason
- Output: Verification token (untuk menghubungkan QR scan dengan voting session)
- Side Effects:
  - Update QR code status ke 'used'
  - Update student table dengan `verified_at` timestamp
  - Create audit log entry

**Data Structure:**
```sql
CREATE TABLE verifications (
  id UUID PRIMARY KEY,
  nis VARCHAR(20) NOT NULL,
  staff_id VARCHAR(50) NOT NULL,
  booth_id INT NOT NULL,
  status ENUM ('approved', 'rejected', 'timeout') DEFAULT 'approved',
  approval_reason VARCHAR(255),
  rejection_reason VARCHAR(255),
  session_token UUID UNIQUE,
  session_expires_at TIMESTAMP,
  verified_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  device_fingerprint VARCHAR(255)
);
```

---

### 5.3 Booth Management Module

#### FR-BOOTH-001: Booth Activation
**Description:** Unlock bilik voting setelah siswa terverifikasi.

**Functional Requirements:**
- Trigger: Panitia click "Konfirmasi" tombol di panel petugas
- Process:
  - Create session record dengan session_token
  - Set booth status ke 'active' dengan session binding
  - Set expiry time: current_time + 5 minutes
  - Send activation signal ke Supabase (akan di-poll oleh booth device)
- Output: 
  - Success response untuk petugas
  - Session data untuk booth device
- Side Effects:
  - Booth akan auto-redirect ke voting page
  - Log activation event

**Data Structure:**
```sql
CREATE TABLE booth_sessions (
  id UUID PRIMARY KEY,
  booth_id INT NOT NULL,
  session_token UUID NOT NULL UNIQUE,
  nis VARCHAR(20) NOT NULL,
  status ENUM ('pending', 'active', 'voting', 'completed', 'expired') DEFAULT 'pending',
  activated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  voting_started_at TIMESTAMP,
  voting_submitted_at TIMESTAMP,
  created_by VARCHAR(50) DEFAULT 'system'
);
```

#### FR-BOOTH-002: Booth Status Monitoring
**Description:** Monitor status real-time semua bilik di admin dashboard.

**Functional Requirements:**
- Endpoint: GET /api/booths/status
- Return:
  ```json
  {
    "booths": [
      {
        "booth_id": 1,
        "status": "voting", // idle, active, voting, maintenance
        "current_session_id": "uuid",
        "current_nis": "12345",
        "time_elapsed": "02:30",
        "last_update": "2026-06-01T14:30:45Z"
      }
    ]
  }
  ```
- Refresh Rate: Every 5 seconds (or on-demand via polling)

#### FR-BOOTH-003: Booth Idle State Management
**Description:** Booth kembali ke idle state setelah voting selesai atau timeout.

**Functional Requirements:**
- Trigger: 
  - Vote submitted successfully, OR
  - 5 minutes timeout without submission
- Process:
  - Clear session data
  - Reset booth display ke standby
  - Mark session sebagai 'completed' atau 'expired'
- Side Effects:
  - Booth siap untuk siswa berikutnya
  - Log session completion

---

### 5.4 Voting & Tokenization Module

#### FR-VOTE-001: Candidate List Retrieval
**Description:** Retrieve daftar kandidat untuk ditampilkan di bilik voting.

**Functional Requirements:**
- Input: None (static list)
- Query: SELECT id, name, number, photo, platform FROM candidates WHERE election_id = ? ORDER BY number
- Cache: Yes (use Redis if available, or in-memory cache)
- Return:
  ```json
  {
    "candidates": [
      {
        "id": "uuid",
        "name": "Budi Santoso",
        "number": 1,
        "photo_url": "https://...",
        "platform": "Platform singkat kami..."
      }
    ]
  }
  ```

#### FR-VOTE-002: Vote Submission
**Description:** Record vote dari siswa ke database.

**Functional Requirements:**
- Input:
  - session_token: UUID (dari booth activation)
  - candidate_id: UUID
  - timestamp_submission: ISO 8601
- Validation:
  1. Verify session_token exists dan active
  2. Verify session hasn't expired
  3. Verify candidate_id exists dan valid
  4. Verify belum ada vote untuk session ini (no double voting)
- Process:
  1. Create vote record di database dengan session_token
  2. DO NOT store NIS dalam vote record
  3. Generate Random UUID untuk Token Hash
  4. Create vote_token record: [Token Hash] -> [Candidate ID]
  5. Update booth_session status ke 'completed'
- Output:
  ```json
  {
    "status": "success",
    "token": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
    "message": "Suara Anda telah tercatat. Simpan token ini untuk verifikasi."
  }
  ```
- Side Effects:
  - Log vote event
  - Increment vote counter untuk candidate
  - Create audit log

**Data Structure:**
```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY,
  session_token UUID NOT NULL UNIQUE,
  candidate_id UUID NOT NULL,
  vote_token UUID NOT NULL UNIQUE,
  submitted_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  device_fingerprint VARCHAR(255),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

CREATE TABLE vote_tokens (
  id UUID PRIMARY KEY,
  token_hash UUID NOT NULL UNIQUE,
  candidate_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  INDEX idx_token_hash (token_hash)
);
```

#### FR-VOTE-003: Vote Counting (Real-time)
**Description:** Hitung real-time vote tally untuk monitoring panitia.

**Functional Requirements:**
- Endpoint: GET /api/results/current
- Query:
  ```sql
  SELECT 
    c.id, c.name, c.number,
    COUNT(v.id) as vote_count,
    ROUND(COUNT(v.id) * 100.0 / SUM(COUNT(v.id)) OVER (), 2) as percentage
  FROM candidates c
  LEFT JOIN votes v ON c.id = v.candidate_id
  WHERE c.election_id = ?
  GROUP BY c.id, c.name, c.number
  ORDER BY vote_count DESC
  ```
- Output:
  ```json
  {
    "total_votes": 500,
    "valid_votes": 498,
    "invalid_votes": 2,
    "eligible_voters": 550,
    "turnout": "90.5%",
    "results": [
      {
        "rank": 1,
        "name": "Budi Santoso",
        "number": 1,
        "votes": 250,
        "percentage": "50.2%"
      }
    ],
    "last_update": "2026-06-01T14:45:30Z"
  }
  ```
- Refresh Rate: Every 10 seconds
- Access Control: Admin & Panitia only

---

### 5.5 Audit & Verification Module

#### FR-AUDIT-001: Token Hash Lookup
**Description:** Siswa dapat memverifikasi suaranya menggunakan token hash.

**Functional Requirements:**
- Access: Public (tidak perlu login)
- Input: token_hash (UUID)
- Process:
  1. Query: SELECT candidate_id, created_at FROM vote_tokens WHERE token_hash = ?
  2. If found: Return candidate info + submission timestamp
  3. If not found: Return "Token tidak ditemukan"
- Output:
  ```json
  {
    "status": "found",
    "token": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
    "candidate": {
      "name": "Budi Santoso",
      "number": 1
    },
    "submitted_at": "2026-06-01T14:35:22Z"
  }
  ```
- Rate Limiting: Yes (10 requests per minute per IP untuk prevent bruteforce)
- Logging: Log semua lookup attempts

#### FR-AUDIT-002: Comprehensive Audit Log
**Description:** Maintain audit trail lengkap untuk forensik.

**Functional Requirements:**
- Capture Events:
  - QR generation, validation, usage
  - Student verification (approved/rejected)
  - Booth activation/deactivation
  - Vote submission
  - Token lookup
  - Admin actions (reset, data export, etc.)
- Data Captured:
  - Event type
  - Actor (user ID / system)
  - Timestamp
  - IP address
  - Device fingerprint
  - Changes (before/after jika applicable)
  - Result (success/failure + error code)

**Data Structure:**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  actor_type ENUM ('student', 'staff', 'admin', 'system') DEFAULT 'system',
  actor_id VARCHAR(50),
  resource_type VARCHAR(100),
  resource_id VARCHAR(100),
  action VARCHAR(100),
  status ENUM ('success', 'failure') DEFAULT 'success',
  error_code VARCHAR(50),
  error_message TEXT,
  metadata JSONB,
  ip_address INET,
  device_fingerprint VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at),
  INDEX idx_actor (actor_type, actor_id)
);
```

#### FR-AUDIT-003: Audit Dashboard Report Generation
**Description:** Generate comprehensive reports untuk post-election analysis.

**Functional Requirements:**
- Endpoint: GET /api/audit/report?start_date=?&end_date=?
- Report Contents:
  - Total events logged
  - Breakdown by event type
  - Success/failure rates
  - Suspicious activities flagged
  - Timeline of key milestones
  - System health metrics
- Output Format: JSON + downloadable CSV
- Access Control: Admin only

---

### 5.6 Security & Integrity Module

#### FR-SEC-001: Database Read-Only Enforcement
**Description:** Prevent manipulation post-election dengan set database ke read-only mode.

**Functional Requirements:**
- Trigger: Admin command atau automatic pada election_end_time
- Process:
  - Revoke UPDATE/DELETE permissions untuk application user
  - Keep INSERT permission untuk audit logs (append-only)
  - Create immutable backup snapshot
- Verification:
  - Every write attempt dibuat fail safely dengan clear error message
  - Log semua attempted modifications

#### FR-SEC-002: Vote Integrity Verification
**Description:** Verify bahwa vote count matches dengan total submitted votes.

**Functional Requirements:**
- Calculation:
  - Total votes in votes table
  - Sum of vote_count dari candidate tally
  - Should be equal
- If mismatch detected:
  - Trigger alert to admin
  - Log inconsistency
  - Generate detailed report
- Run periodically: Every 5 minutes during voting + on-demand

**Algorithm:**
```sql
-- Check untuk data integrity
SELECT 
  (SELECT COUNT(*) FROM votes) as total_votes,
  (SELECT SUM(vote_count) FROM (
    SELECT COUNT(*) as vote_count 
    FROM votes 
    GROUP BY candidate_id
  ) tc) as sum_by_candidate,
  CASE 
    WHEN (SELECT COUNT(*) FROM votes) = 
         (SELECT SUM(vote_count) FROM (...)) 
    THEN 'VALID' 
    ELSE 'MISMATCH' 
  END as integrity_status;
```

#### FR-SEC-003: Anomaly Detection
**Description:** Automatically detect suspicious patterns dalam voting behavior.

**Functional Requirements:**
- Patterns to detect:
  1. **Rapid submissions:** Multiple votes dari same location dalam waktu singkat
  2. **Token lookup patterns:** Excessive token lookups dari same IP (bruteforce attempt)
  3. **Data inconsistencies:** Session records tanpa matching votes
  4. **Timestamp anomalies:** Votes submitted sebelum verification
  5. **Device fingerprint duplicates:** Multiple votes dengan identical device fingerprint

- Detection Logic:
  ```sql
  -- Detect rapid submissions (more than 10 votes per minute from same location)
  SELECT ip_address, COUNT(*) as vote_count
  FROM votes v
  WHERE v.submitted_at > NOW() - INTERVAL '1 minute'
  GROUP BY ip_address
  HAVING COUNT(*) > 10;
  ```

- Action on Detection:
  - Flag dalam audit log dengan severity level
  - Alert to admin in real-time
  - Potentially pause voting jika severity tinggi

---

### 5.7 System Resilience Module

#### FR-RESILIENCE-001: Manual Refresh Mechanism
**Description:** Booth dapat manually refresh data jika out of sync dengan server.

**Functional Requirements:**
- User Action: Petugas atau admin klik "Refresh" button di booth
- Process:
  1. Client-side: Clear cache
  2. Re-fetch current booth status dari API
  3. Reconcile dengan local state
  4. Update UI
- Fallback: Jika API tidak respond, display cached data + warning
- Logging: Log setiap refresh action

#### FR-RESILIENCE-002: Session Timeout Handling
**Description:** Gracefully handle voting session yang timeout.

**Functional Requirements:**
- Timeout Duration: 5 minutes dari booth activation
- On Timeout:
  - Update session status ke 'expired'
  - Display message: "Waktu voting Anda telah habis. Silakan hubungi petugas."
  - Return booth ke idle state
  - Log timeout event
  - If partial vote: Save draft (optional V2 feature)

#### FR-RESILIENCE-003: Network Failure Handling
**Description:** Graceful degradation jika network connectivity lost.

**Functional Requirements:**
- At Petugas Station:
  - If API unavailable: Show cached student list, allow manual entry fallback
  - Cache QR validation results
  - Queue actions untuk retry saat connectivity restored

- At Booth:
  - Show offline message: "Koneksi hilang. Menunggu reconnect..."
  - Don't allow new votes jika offline
  - Auto-retry setiap 5 detik

- At Admin Dashboard:
  - Show warning: "Real-time data unavailable. Last update: X ago"
  - Fall back ke manual refresh
  - Display cached results dengan timestamp

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance
| Requirement | Target | Justification |
|---|---|---|
| QR scan → student profile display | < 2 seconds | Must not frustrate users |
| Vote submission → token generation | < 3 seconds | Critical path |
| Dashboard real-time update | < 10 seconds | Acceptable latency for monitoring |
| API response time (p95) | < 500ms | Responsive feel |
| Concurrent users support | 500+ | Peak load during election |
| Database query latency | < 100ms | For frequently executed queries |

### 6.2 Scalability
- **Horizontal Scaling:** Database & API dapat di-scale independently
- **Database:** Supabase auto-scaling untuk PostgreSQL
- **API:** Stateless design, dapat di-deploy di multiple instances
- **Load Balancing:** Behind Vercel's global CDN
- **Cache Layer:** Implement Redis untuk frequently accessed data (V2)

### 6.3 Security

#### 6.3.1 Authentication & Authorization
- **Petugas & Admin:** 
  - Login dengan username + password
  - 2FA optional (V2)
  - Session management dengan secure cookies
  - Rate limiting: 5 failed attempts = 15 min lockout

- **Siswa (Voting):**
  - Token-based (session_token dari verification)
  - No password required
  - Token expires setelah 5 menit

#### 6.3.2 Data Protection
- **In Transit:**
  - HTTPS only (TLS 1.3)
  - No sensitive data dalam URL parameters

- **At Rest:**
  - Database encryption (Supabase default)
  - NIS tidak pernah stored dalam votes table
  - Sensitive fields encrypted dengan encryption key stored in environment

- **Encryption Algorithm:**
  - QR hash: SHA256
  - Token hash: UUID v4 (sufficient entropy)
  - Password: bcrypt dengan min 10 rounds

#### 6.3.3 Input Validation
- **All Inputs:** Whitelist validation, sanitize output
- **QR Parsing:** Strict format checking, prevent injection
- **Candidate Selection:** Verify candidate_id exists dalam database
- **Rate Limiting:** Per IP, per session, per user

#### 6.3.4 Access Control
```
┌─────────────────┬──────────────────┬──────────────────┐
│ Resource        │ Public | Student │ Staff | Admin    │
├─────────────────┼──────────────────┼──────────────────┤
│ QR Generation   │ -      | ✓       | ✓     | ✓        │
│ Voting Page     │ -      | ✓       | -     | -        │
│ Staff Panel     │ -      | -       | ✓     | ✓        │
│ Admin Dashboard │ -      | -       | -     | ✓        │
│ Audit Dashboard │ ✓      | ✓       | ✓     | ✓        │
│ Results (live)  │ -      | -       | ✓     | ✓        │
│ Audit Logs      │ -      | -       | -     | ✓        │
└─────────────────┴──────────────────┴──────────────────┘
```

### 6.4 Reliability & Availability
- **Uptime Target:** 99.5% (acceptable downtime: 22 minutes/month)
- **MTBF (Mean Time Between Failures):** > 720 hours
- **MTTR (Mean Time To Recovery):** < 5 minutes
- **Backup:** Automatic daily, tested quarterly
- **Disaster Recovery:** RTO < 4 hours, RPO < 15 minutes

### 6.5 Maintainability
- **Code Documentation:** 
  - JSDoc untuk setiap function
  - README untuk setiap module
  - API documentation dengan Swagger

- **Logging:**
  - Structured logging (JSON format)
  - Log levels: DEBUG, INFO, WARN, ERROR, FATAL
  - Centralized logging dengan timestamp

- **Testing:**
  - Unit test coverage: >80%
  - Integration test coverage: >60%
  - E2E tests untuk critical paths

### 6.6 Usability
- **UI Responsiveness:** Works on mobile (320px), tablet (768px), desktop (1920px)
- **Load Time:** First page load < 3 seconds
- **Accessibility:** WCAG 2.1 AA standard
- **Internationalization:** Support Indonesian language (Bahasa Indonesia)
- **Error Messages:** Clear, actionable, in user's language

---

## 7. SYSTEM ARCHITECTURE

### 7.1 High-Level Architecture
```
┌────────────────────────────────────────────────────────────────┐
│                    Frontend (React.js + Vite)                  │
│  ┌──────────┬────────────┬──────────┬──────────┬────────┐     │
│  │ Landing  │ Staff      │ Booth    │ Audit    │ Admin  │     │
│  │ Page     │ Panel      │ Device   │ Panel    │ Panel  │     │
│  └──────────┴────────────┴──────────┴──────────┴────────┘     │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     │ HTTP(S) REST API
                     │
┌────────────────────┴─────────────────────────────────────────┐
│                  AI Agent / Backend (Node.js)                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Layer (Express.js)                             │   │
│  │  ├─ Authentication Routes                           │   │
│  │  ├─ QR Code Routes                                  │   │
│  │  ├─ Voting Routes                                   │   │
│  │  ├─ Booth Management Routes                         │   │
│  │  ├─ Audit Routes                                    │   │
│  │  ├─ Admin Routes                                    │   │
│  │  └─ Health Check Routes                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Business Logic Layer                              │   │
│  │  ├─ QR Handler                                      │   │
│  │  ├─ Authentication Handler                          │   │
│  │  ├─ Voting Handler                                  │   │
│  │  ├─ Booth Manager                                   │   │
│  │  ├─ Audit Manager                                   │   │
│  │  └─ Integrity Checker                               │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Security Layer                                    │   │
│  │  ├─ Encryption/Decryption                           │   │
│  │  ├─ Token Management                                │   │
│  │  ├─ Rate Limiting                                   │   │
│  │  └─ Input Validation                                │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Data Access Layer (Supabase/PostgreSQL)           │   │
│  │  ├─ Query Builder                                   │   │
│  │  ├─ Cache Layer                                     │   │
│  │  └─ Transaction Management                          │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Monitoring & Logging                              │   │
│  │  ├─ Event Logger                                    │   │
│  │  ├─ Anomaly Detector                                │   │
│  │  ├─ Health Monitor                                  │   │
│  │  └─ Performance Tracker                             │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
┌───────▼──┐  ┌────▼──┐  ┌────▼──────┐
│ Supabase │  │ Redis │  │   Email   │
│(Database)│  │(Cache)│  │ Service   │
└──────────┘  └───────┘  └───────────┘
```

### 7.2 Component Interaction Flow

#### QR Generation Flow
```
Student Browser
    │
    ├─ GET /api/qr/generate (NIS)
    │
    ▼ (AI Agent)
┌──────────────────────┐
│ Validate NIS         │
└──────────────────────┘
    │
    ▼
┌──────────────────────┐
│ Generate SALT        │
│ Calculate HASH       │
└──────────────────────┘
    │
    ▼
┌──────────────────────┐
│ Generate QR Image    │
│ Store in Database    │
└──────────────────────┘
    │
    ▼
Return QR PNG/Image
```

#### Voting Workflow
```
Booth Device      Staff Panel         AI Agent           Database
    │                 │                    │                 │
    ├─ Polling: GET /api/booth/1/status   │                 │
    │                 │                    │                 │
    │                 ├─ Scan QR           │                 │
    │                 │                    │                 │
    │                 ├─ POST /api/verify  │                 │
    │                 │──────────────────▶ │                 │
    │                 │  (NIS, staff_id)   │                 │
    │                 │                    ├─ Validate QR   │
    │                 │                    ├─ Get student   │
    │                 │◀───────────────────┤  profile       │
    │                 │  Return profile    │                 │
    │                 │                    │                 │
    │                 ├─ Confirm Button    │                 │
    │                 ├─ POST /api/unlock  │                 │
    │                 │──────────────────▶ │                 │
    │                 │  (booth_id, token) │                 │
    │                 │                    ├─ Create session│
    │                 │                    ├─ Update status │
    │                 │◀───────────────────┤  to 'active'   │
    │                 │  Success           │                 │
    │                 │                    │                 │
    │◀── Poll detects 'active' status     │                 │
    │    Auto-redirect to voting page      │                 │
    │                                      │                 │
    │    Display candidates               │                 │
    │    User selects candidate           │                 │
    │    Submit vote                      │                 │
    │                                      │                 │
    ├─ POST /api/vote                     │                 │
    │──────────────────────────────────▶ │                 │
    │  (session_token, candidate_id)      │                 │
    │                                      ├─ Validate      │
    │                                      ├─ Generate token│
    │                                      ├─ Create record │
    │                                      ├─ Update session│
    │◀──────────────────────────────────────────────────────┤
    │  Return token                       │                 │
    │                                      │                 │
    │ Display token on screen             │                 │
    │ (student takes photo/note)          │                 │
```

---

## 8. DATA MODEL

### 8.1 Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM ('student', 'staff', 'admin', 'panitia') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nis VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(50) NOT NULL,
  photo_url VARCHAR(255),
  registration_status ENUM ('pending', 'registered', 'ineligible') DEFAULT 'pending',
  registration_date TIMESTAMP,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Elections
CREATE TABLE elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM ('planning', 'active', 'closed', 'finalized') DEFAULT 'planning',
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Candidates
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id),
  name VARCHAR(255) NOT NULL,
  number INT NOT NULL,
  photo_url VARCHAR(255),
  platform TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- QR Codes
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nis VARCHAR(20) NOT NULL UNIQUE REFERENCES students(nis),
  hash VARCHAR(64) NOT NULL,
  salt VARCHAR(32) NOT NULL,
  qr_data TEXT NOT NULL,
  status ENUM ('active', 'used', 'revoked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  generated_by VARCHAR(50) DEFAULT 'system'
);

-- Verifications
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nis VARCHAR(20) NOT NULL REFERENCES students(nis),
  staff_id UUID NOT NULL REFERENCES users(id),
  booth_id INT NOT NULL,
  status ENUM ('approved', 'rejected') DEFAULT 'approved',
  session_token UUID NOT NULL UNIQUE,
  session_expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  device_fingerprint VARCHAR(255)
);

-- Booth Sessions
CREATE TABLE booth_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id),
  booth_id INT NOT NULL,
  session_token UUID NOT NULL UNIQUE,
  nis VARCHAR(20) REFERENCES students(nis),
  status ENUM ('pending', 'active', 'voting', 'completed', 'expired') DEFAULT 'pending',
  activated_at TIMESTAMP,
  expires_at TIMESTAMP,
  voting_started_at TIMESTAMP,
  voting_submitted_at TIMESTAMP
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id),
  session_token UUID NOT NULL UNIQUE REFERENCES booth_sessions(session_token),
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  vote_token UUID NOT NULL UNIQUE,
  submitted_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  device_fingerprint VARCHAR(255)
);

-- Vote Tokens (for public audit)
CREATE TABLE vote_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_hash UUID NOT NULL UNIQUE,
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID REFERENCES elections(id),
  event_type VARCHAR(100) NOT NULL,
  actor_type ENUM ('student', 'staff', 'admin', 'system') DEFAULT 'system',
  actor_id VARCHAR(50),
  resource_type VARCHAR(100),
  resource_id VARCHAR(100),
  action VARCHAR(100) NOT NULL,
  status ENUM ('success', 'failure') DEFAULT 'success',
  error_code VARCHAR(50),
  error_message TEXT,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_students_nis ON students(nis);
CREATE INDEX idx_qr_codes_nis ON qr_codes(nis);
CREATE INDEX idx_qr_codes_status ON qr_codes(status);
CREATE INDEX idx_votes_candidate ON votes(candidate_id);
CREATE INDEX idx_votes_election ON votes(election_id);
CREATE INDEX idx_booth_sessions_booth ON booth_sessions(booth_id);
CREATE INDEX idx_booth_sessions_status ON booth_sessions(status);
CREATE INDEX idx_audit_logs_event ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_vote_tokens_hash ON vote_tokens(token_hash);
```

---

## 9. API SPECIFICATION

### 9.1 Base URL
- Development: `http://localhost:3000/api`
- Production: `https://api.evoting-osis.com/api`

### 9.2 Authentication
```
Headers:
Authorization: Bearer <session_token> | <admin_token>
Content-Type: application/json
```

### 9.3 Key Endpoints

#### QR Code Endpoints
```
POST /qr/generate
  Body: { nis: "12345" }
  Response: { qr_image: "data:image/png;...", status: "success" }

POST /qr/validate
  Body: { qr_data: "12345:HASH:SALT" }
  Response: { nis: "12345", name: "Andi", class: "XI-A", status: "valid" }
```

#### Voting Endpoints
```
POST /verify
  Body: { nis: "12345", staff_id: "uuid", booth_id: 1 }
  Response: { session_token: "uuid", student: {...}, status: "approved" }

POST /unlock
  Body: { booth_id: 1, session_token: "uuid" }
  Response: { status: "success", message: "Bilik telah dibuka" }

GET /booth/:id/status
  Response: { status: "idle|active|voting", current_session: {...} }

POST /vote
  Body: { session_token: "uuid", candidate_id: "uuid" }
  Response: { status: "success", token: "uuid", message: "..." }

GET /candidates
  Response: { candidates: [{...}] }
```

#### Audit Endpoints
```
POST /audit/verify-token
  Body: { token: "uuid" }
  Response: { candidate: {...}, submitted_at: "...", status: "found|not_found" }

GET /audit/report
  Query: ?start_date=...&end_date=...
  Response: { total_events: 500, by_type: {...}, ... }
```

#### Admin Endpoints
```
GET /admin/results/current
  Response: { total_votes: 500, results: [{...}] }

GET /admin/booths/status
  Response: { booths: [{...}] }

GET /admin/audit-logs
  Query: ?limit=100&offset=0
  Response: { logs: [{...}], total: 1000 }

POST /admin/lock-database
  Response: { status: "success", message: "Database locked" }
```

---

## 10. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- [x] Database schema design & creation
- [x] API base structure (Express.js)
- [x] Authentication system (staff/admin)
- [x] QR code generation module
- [x] Student profile lookup

**Deliverables:**
- Functional API for QR generation
- Database ready with initial data
- Authentication working for staff panel

### Phase 2: Core Voting Flow (Week 3-4)
- [ ] QR validation & voter verification
- [ ] Booth session management
- [ ] Vote submission & tokenization
- [ ] Real-time vote counting
- [ ] Basic monitoring dashboard

**Deliverables:**
- Complete voting workflow operational
- Live results updating in real-time
- Admin can monitor all booths

### Phase 3: Audit & Security (Week 5)
- [ ] Audit log system
- [ ] Token verification endpoint
- [ ] Anomaly detection
- [ ] Data integrity checks
- [ ] Read-only database enforcement

**Deliverables:**
- Audit dashboard functional
- Public token verification working
- Security policies enforced

### Phase 4: Testing & Optimization (Week 6)
- [ ] Comprehensive test suite
- [ ] Load testing & performance tuning
- [ ] Security audit & penetration testing
- [ ] Documentation completion
- [ ] Deployment preparation

**Deliverables:**
- >80% test coverage
- API response time <500ms
- Security certification
- Deployment-ready system

### Phase 5: Deployment & Training (Week 7)
- [ ] Production deployment (Vercel + Supabase)
- [ ] Staff training & documentation
- [ ] User acceptance testing
- [ ] Final security sign-off

**Deliverables:**
- Live system in production
- All stakeholders trained
- Ready for election day

---

## 11. SUCCESS METRICS

### 11.1 Functional Metrics
| Metric | Target | Success Criteria |
|--------|--------|-----------------|
| Vote success rate | >99.5% | < 5 failed votes out of 1000 |
| System uptime | >99.5% | < 22 min downtime during election |
| QR validation success rate | >99% | < 10 invalid QRs out of 1000 |
| Token generation accuracy | 100% | All votes have corresponding tokens |
| Data integrity | 100% | Vote count = sum of candidate votes |

### 11.2 Performance Metrics
| Metric | Target | Success Criteria |
|--------|--------|-----------------|
| Vote submission latency | <3 sec | p95 < 3 seconds |
| API response time | <500ms | p95 < 500ms |
| Dashboard load time | <2 sec | First meaningful paint <2 sec |
| Concurrent users | 500+ | No degradation at peak load |

### 11.3 Security Metrics
| Metric | Target | Success Criteria |
|--------|--------|-----------------|
| Failed login attempts blocked | 100% | All 5+ attempts locked |
| Suspicious vote detection | >95% | At least 95% of anomalies flagged |
| Unauthorized access attempts | 0 | No successful unauthorized access |
| Data breach incidents | 0 | No data leaked post-election |

### 11.4 User Satisfaction
| Metric | Target | Success Criteria |
|--------|--------|-----------------|
| System ease of use (Likert 1-5) | 4.5+ | Average rating >4.5 |
| Student voting confidence | >90% | >90% feel votes were recorded correctly |
| Staff satisfaction | 4+/5 | Average >4/5 |
| Overall system trust | >95% | >95% trust the system |

---

## 12. ASSUMPTIONS & CONSTRAINTS

### 12.1 Assumptions
- Students have internet access to generate QR code pre-election
- Voting on election day uses stable internet connection (school WiFi)
- At least 1 trained staff member per booth
- Panitia responsible for physical security measures
- Student database (NIS, name, class, photo) available beforehand

### 12.2 Constraints
- **Time:** Development must complete in 6 weeks
- **Budget:** Use free/low-cost services (Supabase free-tier, Vercel free)
- **Infrastructure:** Single server deployment (no complex multi-region setup)
- **Dependencies:** Limited to common open-source libraries
- **Regulations:** Must comply with school's IT policies

### 12.3 Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| QR code forgery | Medium | High | Hash validation + physical check-in |
| Vote double submission | Low | High | Session-based access + database constraints |
| Data breach | Medium | Critical | Encryption + audit logs + minimal PII storage |
| System downtime on election day | Low | Critical | Backup plan + manual voting fallback |
| Petugas error (wrong student verified) | Medium | High | Photo verification + confirmation prompt |
| Network failure | Medium | Medium | Manual refresh + offline mode fallback |

---

## 13. COMPLIANCE & GOVERNANCE

### 13.1 Data Privacy
- Comply dengan school privacy policy
- GDPR principles applicable (minimize data collection)
- No personal data shared externally
- NIS encrypted dalam database

### 13.2 Audit Trail
- Every action logged dengan immutable records
- Logs retained untuk minimum 1 year post-election
- Accessible untuk independent audit

### 13.3 Change Management
- No code changes post-election
- Database locked as read-only
- All changes require multi-party approval
- Version control (Git) untuk transparency

---

## 14. APPENDICES

### 14.1 Glossary
- **NIS:** Nomor Induk Siswa (Student ID)
- **QR Code:** Quick Response Code (2D barcode)
- **Token:** Unique identifier untuk vote
- **Session:** Voting instance tied to a booth
- **Audit Trail:** Complete log of all system actions
- **Append-only:** Database configuration allowing inserts only

### 14.2 References
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js API Documentation](https://expressjs.com/api.html)
- [React Router Documentation](https://reactrouter.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [OWASP Security Guidelines](https://owasp.org/)

### 14.3 Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | __________ | __________ | __________ |
| Technical Lead | __________ | __________ | __________ |
| Security Officer | __________ | __________ | __________ |
| Panitia OSIS | __________ | __________ | __________ |

---

**END OF DOCUMENT**

---

**Document Version History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-01 | AI | Initial comprehensive PRD |
| 1.1 | TBD | Team | Reviews & approval |
| 2.0 | TBD | Team | Post-phase 1 updates |
