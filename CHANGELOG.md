# miTRANZ Box-Portal — Changelog

## [2026-08-24] — PPOB Payment Flow & Security Hardening

### ✅ Fitur Baru
- **Flow PPOB End-to-End** — user order → invoice billing → bayar → Digiflazz → token via email
- **Multi-metode pembayaran manual** — QRIS, ShopeePay, BCA (dikelola dari dashboard)
- **Bot Admin Telegram (@mitranz_admin_bot)** — `/stats`, `/pending`, `/update_qris` via foto
- **Notifikasi Telegram** — admin dapat notif instan saat user konfirmasi bayar
- **Update QRIS via Telegram** — kirim foto QR ke bot → langsung update di sistem
- **Halaman riwayat transaksi PPOB** — verifikasi OTP via email, session 30 menit
- **Link cek riwayat** di semua halaman PPOB
- **Auto-cancel invoice** pending_confirmation lebih dari 24 jam (cron setiap jam)
- **Template email PPOB** — token listrik tampil di email dengan format jelas
- **Template email OTP** — verifikasi riwayat transaksi

### 🔒 Security
- **Webhook signature wajib** — tolak webhook tanpa signature
- **Validasi harga di server** — harga divalidasi dari cache Redis, bukan dari frontend
- **Idempotency webhook** — cegah proses duplikat dengan Redis lock 24 jam
- **Idempotency order** — cegah order duplikat dalam 5 menit per email+produk+customer
- **Proteksi endpoint check-pending** — wajib header `x-cron-secret`
- **Proteksi endpoint email/notify** — hanya dari internal server
- **OTP riwayat transaksi** — hanya pemilik email yang bisa lihat riwayat
- **Rate limit OTP** — max 3x per 10 menit per email
- **WEBHOOK_SECRET dari env** — tidak hardcode

### 🛠 Perbaikan
- **Markup PPOB realtime** — cache markup di-flush otomatis saat admin update
- **Filter kategori Digiflazz** — dari DB ppob_providers (tidak hardcode)
- **Handling status Gagal** — notif Telegram admin + log error
- **Handling status Pending** — tidak kirim email, tunggu cron check-pending
- **Cek saldo Digiflazz** — notif Telegram jika saldo < Rp 100.000
- **field `is_active` di markup query** — fix markup tidak terapply
- **field `metadata` di invoice billing** — fix webhook tidak deteksi type ppob
- **field `sku_code` di markup query** — fix prioritas markup per SKU

### ⚙️ Infrastruktur
- **Cron check-pending** — polling setiap 2 menit dengan secret key
- **Cron auto-cancel** — setiap jam cancel invoice pending > 24 jam
- **Serpul Digiflazz** — terdaftar untuk notifikasi real-time (fallback: cron)
- **Bot admin terpisah** dari bot support user

---

## [2026-08-23] — Landing Page & Admin Dashboard

### ✅ Fitur Baru
- **Landing page redesign** — hero biru, section PPOB & website, footer gradient
- **Login split 70:30** — detail produk + form login untuk setiap paket website
- **Admin users** — kelola akun pengguna dari dashboard
- **Admin markup PPOB smart** — tabel produk live, inline edit, bulk markup per kategori
- **Admin provider PPOB** — kelola kategori Digiflazz dari DB (tabel ppob_providers)
- **Admin gateway** — kelola metode pembayaran dari UI tanpa hardcode
- **Halaman tickets** — user buat tiket, admin balas dari dashboard
- **Filter kategori PPOB** — hanya Pulsa, Data, PLN, Games, TV

### 🔒 Security
- **Cookie forwarding SSR** — `useRequestHeaders(['cookie'])` di semua admin page
- **Admin middleware** — proteksi semua halaman admin

---

## [2026-08-22] — Initial Build

### ✅ Fitur Baru
- **Auth system** — login, register, JWT, refresh token
- **Dashboard user** — layanan aktif, invoice, tiket
- **PPOB pages** — Pulsa, Data, PLN, E-Money, TV, Games
- **Billing portal integration** — create invoice, webhook paid
- **Email konfirmasi** — nodemailer via SMTP relay → Mailcow
- **Chat widget** — live chat dengan bot AI
- **Digiflazz integration** — pricelist cache, markup, transaksi
