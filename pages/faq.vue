<template>
  <div style="min-height:100vh;background:#f0f4fa;font-family:'Inter',sans-serif">
    <nav style="position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-bottom:1px solid #e2e8f0;padding:0 32px;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px">
        <a href="/" style="font-size:22px;font-weight:900;text-decoration:none"><span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span></a>
        <a href="/" style="font-size:14px;color:#1a4fa0;text-decoration:none;font-weight:600">← Kembali</a>
      </div>
    </nav>

    <div style="background:linear-gradient(135deg,#1a4fa0 0%,#2563eb 100%);padding:64px 24px;text-align:center">
      <div style="max-width:600px;margin:0 auto">
        <h1 style="font-size:36px;font-weight:900;color:white;margin:0 0 16px;letter-spacing:-1px">Pertanyaan Umum</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:17px;line-height:1.7;margin:0">Temukan jawaban cepat untuk pertanyaan yang sering ditanyakan.</p>
      </div>
    </div>

    <div style="max-width:800px;margin:0 auto;padding:56px 24px">

      <div v-for="(cat, ci) in faqCategories" :key="ci" style="margin-bottom:40px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <span style="font-size:24px">{{ cat.icon }}</span>
          <h2 style="font-size:18px;font-weight:800;color:#1a202c;margin:0">{{ cat.title }}</h2>
        </div>

        <div style="display:flex;flex-direction:column;gap:12px">
          <div v-for="(faq, fi) in cat.items" :key="fi"
            style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
            <button @click="toggle(ci, fi)"
              style="width:100%;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;background:none;border:none;cursor:pointer;text-align:left">
              <span style="font-size:15px;font-weight:600;color:#1a202c">{{ faq.q }}</span>
              <span style="font-size:20px;color:#1a4fa0;flex-shrink:0;margin-left:16px;transition:transform 0.2s"
                :style="isOpen(ci,fi) ? 'transform:rotate(45deg)' : ''">+</span>
            </button>
            <div v-if="isOpen(ci, fi)" style="padding:0 24px 20px;border-top:1px solid #f1f5f9">
              <p style="color:#374151;font-size:14px;line-height:1.8;margin:16px 0 0" v-html="faq.a"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Masih ada pertanyaan -->
      <div style="background:linear-gradient(135deg,#1a4fa0,#2563eb);border-radius:20px;padding:40px;text-align:center">
        <div style="font-size:36px;margin-bottom:16px">💬</div>
        <h3 style="font-size:18px;font-weight:800;color:white;margin:0 0 10px">Masih Ada Pertanyaan?</h3>
        <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 20px">Gunakan fitur Chat di halaman utama atau hubungi kami via email.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="/kontak" style="padding:12px 24px;background:white;color:#1a4fa0;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700">Hubungi Kami</a>
          <a href="/" style="padding:12px 24px;background:rgba(255,255,255,0.15);color:white;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;border:1px solid rgba(255,255,255,0.3)">Kembali ke Beranda</a>
        </div>
      </div>
    </div>

    <div style="text-align:center;padding:32px;color:#94a3b8;font-size:13px">© 2026 miTRANZ. Platform Layanan Digital Terpercaya.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
useHead({ title: 'FAQ — miTRANZ' })
const openMap = ref({})
const toggle = (ci, fi) => {
  const key = `${ci}-${fi}`
  openMap.value[key] = !openMap.value[key]
}
const isOpen = (ci, fi) => !!openMap.value[`${ci}-${fi}`]

const faqCategories = [
  {
    icon: '⚡',
    title: 'Layanan PPOB',
    items: [
      {
        q: 'Produk apa saja yang tersedia di layanan PPOB miTRANZ?',
        a: 'miTRANZ menyediakan berbagai layanan PPOB lengkap: <strong>Token & Tagihan Listrik PLN</strong>, <strong>Pulsa & Paket Data</strong> (semua operator: Telkomsel, XL, Indosat, Tri, Smartfren), <strong>Voucher & Top Up Game</strong> (Free Fire, Mobile Legends, PUBG, dan lainnya), <strong>E-Money</strong> (GoPay, OVO, DANA, ShopeePay, LinkAja), dan <strong>TV Kabel</strong> (Indihome, MNC, dll). Produk terus bertambah secara berkala.'
      },
      {
        q: 'Apakah saya perlu membuat akun untuk bertransaksi PPOB?',
        a: 'Tidak perlu mendaftar akun. Layanan PPOB miTRANZ dapat digunakan langsung — cukup masukkan nomor tujuan dan alamat email Anda, lalu lakukan pembayaran. Riwayat transaksi dapat dicek kapan saja menggunakan email yang sama.'
      },
      {
        q: 'Berapa lama produk diterima setelah pembayaran?',
        a: 'Semua produk PPOB diproses <strong>secara otomatis dalam hitungan detik</strong> hingga maksimal 5 menit setelah pembayaran dikonfirmasi. Konfirmasi transaksi dan detail produk dikirim ke email yang Anda daftarkan. Untuk pulsa dan paket data, pengisian langsung masuk ke nomor tujuan. Untuk e-money, ikuti petunjuk yang dikirim via email.'
      },
      {
        q: 'Data atau nomor tujuan saya salah input. Apa yang terjadi?',
        a: 'Jika nomor/ID tidak valid, sistem akan <strong>menolak transaksi sebelum pembayaran</strong> diproses. Namun jika nomor valid milik orang lain (misalnya nomor pulsa atau ID game orang lain), transaksi akan berhasil ke tujuan tersebut dan tidak dapat dibatalkan. Selalu periksa kembali nomor tujuan sebelum melakukan pembayaran.'
      },
      {
        q: 'Bagaimana cara mengecek riwayat transaksi saya?',
        a: 'Kunjungi menu <strong>Riwayat Transaksi</strong> di halaman PPOB. Anda akan diminta verifikasi melalui <strong>OTP yang dikirim ke email</strong> terdaftar untuk mengakses seluruh riwayat transaksi Anda.'
      },
    ]
  },
  {
    icon: '💳',
    title: 'Pembayaran',
    items: [
      {
        q: 'Metode pembayaran apa yang diterima?',
        a: 'Kami menerima pembayaran melalui <strong>QRIS Universal</strong> (dapat digunakan dari semua aplikasi e-wallet & mobile banking), <strong>ShopeePay</strong>. Untuk layanan jasa website, pembayaran dilakukan melalui invoice yang dikirim ke email Anda.'
      },
      {
        q: 'Apakah ada biaya tambahan saat pembayaran?',
        a: 'Tidak ada biaya tersembunyi. Harga yang tampil di halaman produk adalah <strong>harga final yang Anda bayar</strong>.'
      },
      {
        q: 'Pembayaran saya berhasil tapi transaksi belum diproses?',
        a: 'Jika pembayaran sudah berhasil namun transaksi belum selesai setelah 10 menit, segera hubungi kami melalui fitur <strong>Chat</strong> di halaman utama atau email cs@mitranz.com dengan menyertakan bukti pembayaran.'
      },
      {
        q: 'Berapa lama batas waktu pembayaran invoice?',
        a: 'Invoice berlaku selama <strong>24 jam</strong> sejak dibuat. Lewat dari itu, pesanan akan dibatalkan otomatis dan Anda perlu membuat transaksi baru.'
      },
    ]
  },
  {
    icon: '🔄',
    title: 'Refund & Pembatalan',
    items: [
      {
        q: 'Kapan saya bisa mengajukan refund?',
        a: 'Refund dapat diajukan jika: (1) transaksi gagal diproses namun pembayaran sudah diterima, atau (2) terjadi kesalahan sistem dari pihak miTRANZ. Pengajuan dilakukan maksimal <strong>1x24 jam</strong> setelah transaksi gagal.'
      },
      {
        q: 'Transaksi gagal karena salah nomor. Apakah bisa direfund?',
        a: 'Jika transaksi <strong>gagal</strong> karena nomor tidak valid, dana akan dikembalikan. Namun jika transaksi <strong>berhasil</strong> dengan nomor yang salah (nomor valid milik orang lain), refund tidak dapat diproses.'
      },
      {
        q: 'Berapa lama proses refund?',
        a: 'Proses pengembalian dana memerlukan waktu <strong>3–7 hari kerja</strong> tergantung metode pembayaran yang digunakan. Dana dikembalikan ke sumber pembayaran asal.'
      },
    ]
  },
  {
    icon: '🌐',
    title: 'Jasa Website',
    items: [
      {
        q: 'Berapa lama proses pembuatan website?',
        a: 'Estimasi waktu pengerjaan tergantung paket yang dipilih, umumnya antara <strong>7–21 hari kerja</strong>. Tim kami akan menghubungi Anda dalam 1x24 jam setelah pembayaran untuk mendiskusikan detail proyek.'
      },
      {
        q: 'Apakah termasuk hosting dan domain?',
        a: 'Setiap paket memiliki spesifikasi berbeda. Detail apa yang termasuk dalam setiap paket tersedia di halaman layanan website. Anda dapat juga menghubungi kami untuk konsultasi gratis.'
      },
      {
        q: 'Bagaimana jika saya tidak puas dengan hasil website?',
        a: 'Kami menyediakan sesi revisi sesuai paket yang dipilih. Tim kami berkomitmen untuk memastikan hasil akhir sesuai dengan kebutuhan dan harapan Anda.'
      },
    ]
  },
]
</script>
