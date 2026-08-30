# miTRANZ Portal (box-portal) — Status Sistem

URL: https://mitranz.com
Terakhir diupdate: 2026-08-30
Namespace K8s: box-portal

---

## Halaman yang Tersedia

### Public
- / — Landing page utama
- /faq — FAQ
- /kontak — Kontak
- /tentang — Tentang miTRANZ
- /syarat — Syarat dan Ketentuan
- /privasi — Kebijakan Privasi
- /refund — Kebijakan Refund

### Auth
- /auth/login — Login
- /auth/forgot-password — Lupa password
- /auth/reset-password — Reset password

### User (butuh login)
- /dashboard — Dashboard user
- /profile — Profil user
- /invoices — Daftar invoice
- /orders — Riwayat order
- /services — Layanan aktif
- /services/order — Order layanan baru
- /tickets — Support ticket
- /tickets/[id] — Detail ticket

### PPOB (butuh login)
- /ppob — Halaman utama PPOB
- /ppob/games — Daftar game
- /ppob/games/[slug] — Detail game (Free Fire, Mobile Legends, dll)
- /ppob/pln — Token PLN
- /ppob/pulsa — Pulsa & Paket Data
- /ppob/emoney — E-Money (GoPay, OVO, DANA, ShopeePay)
- /ppob/tv — TV Kabel
- /ppob/riwayat — Riwayat transaksi PPOB (dengan OTP email)

### Admin (butuh role admin)
- /admin/dashboard — Dashboard admin dengan real-time stats
- /admin/users — Kelola user
- /admin/tickets — Kelola support ticket
- /admin/chat — Live chat
- /admin/products — Kelola produk layanan
- /admin/markup — Kelola markup PPOB
- /admin/ppob-brands — Kelola brand PPOB (Game + Pulsa + EMoney)
- /admin/ppob-categories — Kelola kategori PPOB
- /admin/ppob-game-brands — Kelola brand game
- /admin/ppob-operators — Kelola operator
- /admin/ppob-products — Kelola produk PPOB

---

## API Endpoints

### Auth
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/register
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/change-password
- POST /api/auth/update-profile
- POST /api/auth/refresh
- GET  /api/auth/me

### PPOB
- GET  /api/ppob/categories — Kategori PPOB (cached Redis)
- GET  /api/ppob/game-brands — Brand game aktif (cached Redis)
- GET  /api/ppob/operator-brands?category=Pulsa|EMoney (cached Redis)
- GET  /api/ppob/products?category=PLN|Games|Pulsa|Data (cached Redis)
- GET  /api/ppob/products-pulsa — Pulsa+Data gabungan (cached Redis)
- GET  /api/ppob/pln/products
- GET  /api/ppob/emoney/products
- GET  /api/ppob/games/products
- GET  /api/ppob/pulsa/products
- GET  /api/ppob/tv/products
- GET  /api/ppob/markup — Markup per kategori
- GET  /api/ppob/product-configs
- POST /api/ppob/order — Buat order PPOB
- POST /api/ppob/transaction — Proses transaksi Digiflazz
- GET  /api/ppob/riwayat — Riwayat transaksi
- POST /api/ppob/otp-send — Kirim OTP email untuk riwayat
- POST /api/ppob/otp-verify — Verifikasi OTP
- GET  /api/ppob/check-pending — Cron: cek transaksi pending (*/2 menit)
- GET  /api/ppob/auto-cancel — Cron: auto cancel transaksi expired (tiap jam)
- POST /api/ppob/webhook — Webhook dari Digiflazz

### Billing (integrasi dengan paymen.mitranz.com)
- POST /api/billing/create-invoice — Buat invoice di billing portal
- GET  /api/billing/invoices — Daftar invoice user
- GET  /api/billing/services — Layanan aktif user
- POST /api/billing/webhook — Terima webhook dari billing portal

### Tickets
- GET  /api/tickets — Daftar ticket user
- POST /api/tickets — Buat ticket baru
- GET  /api/tickets/[id] — Detail ticket
- POST /api/tickets/[id]/reply — Balas ticket

### Chat
- POST /api/chat/send — Kirim pesan chat
- GET  /api/chat/listen — SSE listener chat
- POST /api/chat/end — Akhiri sesi chat
- POST /api/chat/webhook — Webhook Telegram chat

### Email
- POST /api/email/notify — Kirim notifikasi email
- POST /api/email/test — Test SMTP

### Admin
- GET/POST /api/admin/markup — Kelola markup PPOB
- GET/POST /api/admin/ppob-categories — Kelola kategori
- GET/POST /api/admin/ppob-game-brands — Kelola brand game
- GET/POST /api/admin/ppob-operator-brands — Kelola operator
- GET/POST /api/admin/ppob-product-configs — Kelola konfigurasi produk
- GET/PATCH/DELETE /api/admin/markup/[id]
- GET /api/admin/tickets — Daftar semua ticket
- PATCH /api/admin/tickets/[id] — Update status ticket
- GET /api/admin/users — Daftar user
- PATCH /api/admin/users/[id] — Update user
- POST /api/admin/upload-asset — Upload asset ke MinIO
- POST /api/admin/chat/* — Kelola chat

---

## Integrasi Eksternal

| Layanan | Fungsi | Status |
|---|---|---|
| Digiflazz | Provider PPOB (Pulsa, PLN, Games, EMoney, TV) | Aktif |
| paymen.mitranz.com | Billing portal (invoice, payment) | Aktif |
| Mailcow (hestia VM) | SMTP relay email | Aktif |
| Telegram Bot | Live chat + notifikasi admin | Aktif |
| MinIO (data-layer) | Asset storage (logo, banner) | Aktif |
| Redis | Cache produk PPOB + session | Aktif |

---

## Cron Jobs

| Interval | Endpoint | Fungsi |
|---|---|---|
| */2 menit | /api/ppob/check-pending | Cek & update transaksi pending Digiflazz |
| tiap jam | /api/ppob/auto-cancel | Auto cancel transaksi expired |
| 01:00 harian | /root/backup-mitranz.sh | Backup DB ke lokal + MinIO |

---

## Infrastruktur

| Komponen | Resource K8s | Keterangan |
|---|---|---|
| Nuxt 3 App | deployment/mitranz-portal | SSR, namespace box-portal |
| Hasura GraphQL | deployment/hasura-box | Port NodePort 32084 |
| PostgreSQL | statefulset/postgres-box-0 | DB utama box_portal |
| Redis | deployment/redis-box | Cache PPOB + session |

---

## Backup

- Code: GitHub fadlan18/box-portal (private)
- Database: harian jam 01:00 → /root/backup-mitranz/ (lokal 7 hari) + MinIO (30 hari)
- Hasura metadata: ikut backup harian

---

Lihat CHANGELOG.md untuk riwayat perubahan.