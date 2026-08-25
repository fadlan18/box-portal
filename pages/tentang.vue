<template>
  <div style="min-height:100vh;background:#f0f4fa;font-family:'Inter',sans-serif">
    <nav style="position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-bottom:1px solid #e2e8f0;padding:0 32px;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px">
        <a href="/" style="font-size:22px;font-weight:900;text-decoration:none"><span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span></a>
        <a href="/" style="font-size:14px;color:#1a4fa0;text-decoration:none;font-weight:600">← Kembali</a>
      </div>
    </nav>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a4fa0 0%,#2563eb 100%);padding:64px 24px;text-align:center">
      <div style="max-width:700px;margin:0 auto">
        <h1 style="font-size:36px;font-weight:900;color:white;margin:0 0 16px;letter-spacing:-1px">Tentang miTRANZ</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:17px;line-height:1.7;margin:0">
          Platform layanan digital terpercaya yang hadir untuk memudahkan kehidupan digital masyarakat Indonesia.
        </p>
      </div>
    </div>

    <div style="max-width:900px;margin:0 auto;padding:56px 24px">

      <!-- Siapa kami -->
      <div style="background:white;border-radius:20px;padding:48px;margin-bottom:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <h2 style="font-size:22px;font-weight:800;color:#1a202c;margin:0 0 16px">Siapa Kami</h2>
        <p style="color:#374151;font-size:15px;line-height:1.8;margin:0 0 16px">
          miTRANZ adalah platform layanan digital yang menyediakan solusi pembayaran PPOB dan jasa pembuatan website profesional. Kami hadir untuk menjawab kebutuhan masyarakat Indonesia akan layanan digital yang cepat, mudah, dan terpercaya.
        </p>
        <p style="color:#374151;font-size:15px;line-height:1.8;margin:0">
          Dengan teknologi yang terus berkembang, kami berkomitmen untuk terus berinovasi menghadirkan pengalaman transaksi digital yang mulus — tanpa antri, tanpa repot, langsung di genggaman Anda.
        </p>
      </div>

      <!-- Visi Misi -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-bottom:24px">
        <div style="background:white;border-radius:20px;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border-top:4px solid #1a4fa0">
          <div style="font-size:32px;margin-bottom:16px">🎯</div>
          <h3 style="font-size:18px;font-weight:800;color:#1a202c;margin:0 0 12px">Visi</h3>
          <p style="color:#374151;font-size:14px;line-height:1.8;margin:0">
            Menjadi platform layanan digital terdepan di Indonesia yang dipercaya oleh jutaan pengguna untuk kebutuhan pembayaran dan solusi digital mereka.
          </p>
        </div>
        <div style="background:white;border-radius:20px;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border-top:4px solid #c0192c">
          <div style="font-size:32px;margin-bottom:16px">🚀</div>
          <h3 style="font-size:18px;font-weight:800;color:#1a202c;margin:0 0 12px">Misi</h3>
          <ul style="color:#374151;font-size:14px;line-height:2;margin:0;padding-left:18px">
            <li>Menghadirkan layanan PPOB yang cepat dan terjangkau</li>
            <li>Membangun website profesional berkualitas tinggi</li>
            <li>Memberikan dukungan pelanggan yang responsif</li>
            <li>Terus berinovasi untuk pengalaman digital terbaik</li>
          </ul>
        </div>
      </div>

      <!-- Keunggulan -->
      <div style="background:white;border-radius:20px;padding:48px;margin-bottom:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <h2 style="font-size:22px;font-weight:800;color:#1a202c;margin:0 0 32px">Mengapa Memilih miTRANZ?</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px">
          <div v-for="f in features" :key="f.title" style="text-align:center;padding:24px 16px;background:#f8faff;border-radius:16px">
            <div style="font-size:36px;margin-bottom:12px">{{ f.icon }}</div>
            <div style="font-size:15px;font-weight:700;color:#1a202c;margin-bottom:8px">{{ f.title }}</div>
            <div style="font-size:13px;color:#64748b;line-height:1.6">{{ f.desc }}</div>
          </div>
        </div>
      </div>

      <!-- Layanan -->
      <div style="background:linear-gradient(135deg,#1a4fa0,#2563eb);border-radius:20px;padding:48px;text-align:center">
        <h2 style="font-size:22px;font-weight:800;color:white;margin:0 0 12px">Layanan Kami</h2>
        <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 32px">Dua pilar utama yang kami hadirkan untuk Anda</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">
          <div style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:16px;padding:32px;backdrop-filter:blur(8px)">
            <div style="font-size:40px;margin-bottom:16px">⚡</div>
            <h3 style="font-size:17px;font-weight:800;color:white;margin:0 0 10px">PPOB</h3>
            <p style="color:rgba(255,255,255,0.75);font-size:13px;line-height:1.7;margin:0">
              Token Listrik PLN, Pulsa & Paket Data, Voucher Game, dan lebih banyak lagi. Proses otomatis, token langsung ke email.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:16px;padding:32px;backdrop-filter:blur(8px)">
            <div style="font-size:40px;margin-bottom:16px">🌐</div>
            <h3 style="font-size:17px;font-weight:800;color:white;margin:0 0 10px">Jasa Website</h3>
            <p style="color:rgba(255,255,255,0.75);font-size:13px;line-height:1.7;margin:0">
              Website modern untuk bisnis, UMKM, dan pemerintah desa. Desain profesional, harga terjangkau, dukungan penuh.
            </p>
          </div>
        </div>
        <div style="margin-top:32px">
          <a href="/" style="display:inline-block;padding:14px 32px;background:white;color:#1a4fa0;border-radius:12px;text-decoration:none;font-size:15px;font-weight:800;box-shadow:0 4px 16px rgba(0,0,0,0.15)">Mulai Sekarang →</a>
        </div>
      </div>

    </div>

    <div style="text-align:center;padding:32px;color:#94a3b8;font-size:13px">© 2026 miTRANZ. Platform Layanan Digital Terpercaya.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
useHead({ title: 'Tentang Kami — miTRANZ' })
const features = [
  { icon: '⚡', title: 'Proses Instan', desc: 'Transaksi diproses otomatis dalam hitungan detik tanpa campur tangan manual' },
  { icon: '🔒', title: 'Aman & Terpercaya', desc: 'Sistem keamanan berlapis dengan enkripsi data penuh di setiap transaksi' },
  { icon: '📧', title: 'Konfirmasi Email', desc: 'Bukti transaksi dan token dikirim langsung ke email Anda secara otomatis' },
  { icon: '💬', title: 'Dukungan Responsif', desc: 'Tim kami siap membantu melalui fitur chat yang tersedia di platform' },
  { icon: '💰', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi. Harga yang tampil adalah harga yang Anda bayar' },
  { icon: '🕐', title: 'Layanan 24 Jam', desc: 'Transaksi PPOB dapat dilakukan kapan saja, 24 jam sehari 7 hari seminggu' },
]
</script>
