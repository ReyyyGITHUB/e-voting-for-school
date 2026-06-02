🛠️ FASE 1: INFRASTRUKTUR & DATABASE (FOUNDATION)
[ ] Setup Schema Supabase: Menulis SQL query untuk tabel: students, candidates, qr_codes, booth_sessions, votes, vote_tokens, dan audit_logs.

[ ] Database Constraints: Setup Read-Only mode untuk tabel votes setelah pemilu (prosedural) dan Append-only logic.

[ ] Supabase Client Setup: Integrasi React dengan Supabase (Client-side implementation).

🔐 FASE 2: AUTHENTICATION & QR ENGINE (GATEKEEPER)
[ ] QR Generator UI: Halaman buat siswa generate QR (berisi NIS + Hash).

[ ] QR Validator Engine: Logic backend/helper untuk memvalidasi hash QR (SHA256) agar tidak bisa dipalsukan.

[ ] Student Profile Lookup: Fungsi buat narik data siswa berdasarkan scan NIS (untuk verifikasi fisik petugas).

🗳️ FASE 3: CORE VOTING FLOW (THE ENGINE)
[ ] Staff Panel (QR Scanner UI): Implementasi kamera scanner untuk panitia.

[ ] Booth Binding Logic: Implementasi trigger "Unlock" dari panel petugas ke bilik (tabel booth_sessions).

[ ] Booth UI (Client Device): Halaman bilik dengan Manual Refresh Button dan auto-redirect setelah di-unlock panitia.

[ ] Voting Submission: Logic pengiriman vote + generate Token Hash (UUID) secara atomic (tidak simpan NIS).

🔍 FASE 4: AUDIT & TRANSPARENCY (TRUST)
[ ] Public Audit Dashboard: Halaman pencarian token (Token Lookup).

[ ] Real-time Results: Dashboard monitoring suara untuk panitia (hasil aggregat kandidat).

[ ] Audit Logger: Implementasi fungsi otomatis untuk mencatat setiap event penting (scan, unlock, vote) ke tabel audit_logs.

🛡️ FASE 5: SECURITY & POLISHING
[ ] Anomaly Detection Basic: Logic sederhana untuk mendeteksi rapid submission (spam).

[ ] UI/UX Polish: Responsivitas, step-back protocol (UI untuk petugas agar menjaga jarak privasi), dan error handling yang ramah.

[ ] Testing: Simulasi voting dari awal sampai akhir (E2E Test).
