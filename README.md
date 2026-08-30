# miTRANZ Portal (box-portal)

Portal utama ekosistem miTRANZ untuk layanan PPOB dan jasa IT.
Dibangun dengan Nuxt 3 + Hasura GraphQL + PostgreSQL.

URL Produksi: https://mitranz.com

---

## Stack Teknologi

- Frontend/Backend: Nuxt 3 SSR
- Database: PostgreSQL via Hasura GraphQL
- Cache: Redis (produk PPOB + session)
- Auth: Custom JWT httpOnly cookie
- PPOB Provider: Digiflazz
- Asset Storage: MinIO (data-layer namespace)
- Email: Mailcow via SMTP relay
- Chat: Telegram Bot
- Deploy: K3s namespace box-portal, authserv VM 103

---

## Fitur Utama

### PPOB (Payment Point Online Bank)
- Pulsa dan Paket Data (semua operator)
- Token PLN
- Games (Free Fire, Mobile Legends, dll)
- E-Money (GoPay, OVO, DANA, ShopeePay)
- TV Kabel
- Riwayat transaksi dengan verifikasi OTP email
- Cache Redis per kategori untuk performa tinggi

### Layanan Jasa IT
- Order layanan website, hosting, domain
- Invoice terintegrasi dengan billing portal
- Tracking status layanan aktif

### User
- Register, login, forgot/reset password
- Profil dan ganti password
- Support ticket
- Live chat dengan admin via Telegram

### Admin
- Dashboard real-time stats
- Kelola user, produk, markup PPOB
- Kelola brand game, operator, kategori
- Kelola support ticket
- Upload asset ke MinIO

---

## Integrasi

| Layanan | Fungsi | Status |
|---|---|---|
| Digiflazz | Provider PPOB | Aktif |
| paymen.mitranz.com | Billing portal | Aktif |
| Mailcow | SMTP email | Aktif |
| Telegram Bot | Live chat + notifikasi | Aktif |
| MinIO | Asset storage | Aktif |
| Redis | Cache PPOB + session | Aktif |

---

## Deploy

    npm install       # install dependencies
    npm run dev       # development
    ./deploy.sh       # build dan deploy ke K8s
    ./git-save.sh     # simpan ke git

PENTING: Credentials dan secrets TIDAK boleh ada di repository ini.
Semua secrets dikelola via K8s secrets namespace box-portal.

---

## Backup

- Code: GitHub fadlan18/box-portal (private)
- Database: harian jam 01:00 ke lokal + MinIO
- Hasura metadata: ikut backup harian

---

Lihat STATUS.md untuk kondisi riil sistem.
Lihat CHANGELOG.md untuk riwayat perubahan.