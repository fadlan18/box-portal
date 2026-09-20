<template>
  <div style="min-height:100vh;background:#f8faff;font-family:'Inter',sans-serif">

    <!-- Navbar -->
    <nav style="position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);border-bottom:1px solid #e2e8f0;padding:0 32px;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px">
        <a href="/" style="font-size:22px;font-weight:900;text-decoration:none">
          <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
        </a>
        <div style="display:flex;align-items:center;gap:16px">
          <a href="/" style="font-size:14px;color:#64748b;text-decoration:none;font-weight:600">Beranda</a>
          <a href="/kontak" style="padding:8px 20px;background:#1a4fa0;color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700">Konsultasi Gratis</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#1a4fa0 100%);padding:72px 24px;text-align:center">
      <div style="max-width:700px;margin:0 auto">
        <span style="background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.8);font-size:12px;font-weight:700;padding:4px 14px;border-radius:100px;letter-spacing:1px;border:1px solid rgba(255,255,255,0.15)">LAYANAN KAMI</span>
        <h1 style="font-size:clamp(28px,4vw,42px);font-weight:900;color:white;margin:16px 0 16px;letter-spacing:-1px">Paket Aplikasi Digital Profesional</h1>
        <p style="color:rgba(255,255,255,0.8);font-size:16px;line-height:1.8;margin:0">Solusi digital yang dirancang khusus untuk kebutuhan bisnis, UMKM, dan instansi pemerintah. Harga transparan, pengerjaan tepat waktu.</p>
      </div>
    </div>

    <!-- Paket -->
    <div style="max-width:1100px;margin:0 auto;padding:72px 24px">

      <div v-for="(p, i) in pakets" :key="p.slug" style="margin-bottom:48px">
        <div style="background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);border:1px solid #e2e8f0">

          <!-- Header paket -->
          <div :style="'background:' + p.headerBg + ';padding:40px 48px'">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:24px">
              <div>
                <div style="font-size:40px;margin-bottom:12px">{{ p.icon }}</div>
                <h2 style="font-size:24px;font-weight:900;color:white;margin:0 0 8px">{{ p.name }}</h2>
                <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0;max-width:500px;line-height:1.7">{{ p.desc }}</p>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:4px">Mulai dari</div>
                <div style="font-size:32px;font-weight:900;color:white">{{ p.startPrice }}</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.6)">{{ p.period }}</div>
              </div>
            </div>
          </div>

          <!-- Body paket -->
          <div style="padding:40px 48px">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px">

              <!-- Fitur -->
              <div>
                <h3 style="font-size:15px;font-weight:800;color:#1a202c;margin:0 0 20px;display:flex;align-items:center;gap:8px">
                  <span style="width:24px;height:24px;background:#eff6ff;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;font-size:12px">✓</span>
                  Yang Termasuk dalam Paket
                </h3>
                <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
                  <li v-for="f in p.features" :key="f" style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#374151;line-height:1.6">
                    <span style="color:#1a4fa0;font-weight:700;flex-shrink:0;margin-top:1px">✓</span>
                    {{ f }}
                  </li>
                </ul>
              </div>

              <!-- Paket harga -->
              <div>
                <h3 style="font-size:15px;font-weight:800;color:#1a202c;margin:0 0 20px;display:flex;align-items:center;gap:8px">
                  <span style="width:24px;height:24px;background:#fef3c7;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;font-size:12px">💰</span>
                  Pilihan Paket & Harga
                </h3>
                <div style="display:flex;flex-direction:column;gap:10px">
                  <div v-for="opt in p.options" :key="opt.label"
                    style="padding:14px 18px;border-radius:12px;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:12px"
                    :style="opt.promo ? 'background:#fffbeb;border-color:#fde68a' : 'background:#f8faff'">
                    <div>
                      <div style="font-size:13px;font-weight:700;color:#1a202c">{{ opt.label }}</div>
                      <div v-if="opt.promo_label" style="font-size:11px;color:#d97706;font-weight:700;margin-top:2px">{{ opt.promo_label }}</div>
                    </div>
                    <div style="font-size:15px;font-weight:900;color:#1a4fa0;white-space:nowrap">{{ opt.price }}</div>
                  </div>
                </div>
              </div>

            </div>

            <!-- CTA -->
            <div style="margin-top:32px;padding-top:32px;border-top:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
              <div style="font-size:13px;color:#64748b">Butuh kustomisasi? Konsultasikan kebutuhan spesifik Anda kepada tim kami.</div>
              <a :href="'/kontak?paket=' + p.slug"
                style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:#1a4fa0;color:white;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;box-shadow:0 4px 16px rgba(26,79,160,0.25)">
                Konsultasi Paket Ini →
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Proses pengerjaan -->
      <div style="background:linear-gradient(135deg,#1a4fa0,#2563eb);border-radius:24px;padding:48px;margin-top:24px">
        <h2 style="font-size:22px;font-weight:900;color:white;margin:0 0 8px;text-align:center">Proses Pengerjaan</h2>
        <p style="color:rgba(255,255,255,0.7);font-size:14px;text-align:center;margin:0 0 36px">Transparan dari awal hingga akhir</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:20px">
          <div v-for="(s, i) in proses" :key="i" style="text-align:center">
            <div style="width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:22px">{{ s.icon }}</div>
            <div style="font-size:13px;font-weight:700;color:white;margin-bottom:4px">{{ s.title }}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.6)">{{ s.desc }}</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer minimal -->
    <div style="background:#1a202c;padding:32px;text-align:center">
      <p style="color:#475569;font-size:13px;margin:0">© 2026 <strong style="color:#64748b">PT Mitra Trans Digital</strong>. Semua hak dilindungi. | <a href="/" style="color:#60a5fa;text-decoration:none">mitranz.com</a></p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
useHead({ title: 'Layanan Aplikasi Digital — miTRANZ | PT Mitra Trans Digital' })

const pakets = [
  {
    slug: 'web-umkm',
    icon: '🏪',
    name: 'Aplikasi Digital UMKM',
    desc: 'Solusi digital profesional untuk usaha kecil dan menengah. Tampil online, raih lebih banyak pelanggan, dan kelola bisnis dengan lebih efisien.',
    startPrice: 'Rp 1.750.000',
    period: 'sekali bayar + hosting 1 tahun',
    headerBg: 'linear-gradient(135deg,#1a4fa0,#2563eb)',
    features: [
      'Desain modern, bersih, dan responsif di semua perangkat',
      'Free hosting selama 1 tahun',
      'Tombol kontak & WhatsApp terintegrasi',
      'Google Maps terintegrasi',
      'SEO dasar untuk mesin pencari',
      'Halaman profil bisnis lengkap',
      'Formulir kontak online',
      'SSL terenkripsi',
    ],
    options: [
      { label: 'Paket Promo 1 — Free Hosting 1 Tahun', price: 'Rp 1.750.000', promo: true, promo_label: 'PROMO' },
      { label: 'Paket Promo 2 — Free Hosting 2 Tahun', price: 'Rp 2.050.000', promo: true, promo_label: 'PROMO' },
      { label: 'Perpanjangan Hosting & Domain', price: 'Rp 500.000/thn', promo: true, promo_label: 'Hemat 15%' },
    ]
  },
  {
    slug: 'web-desa-ekonomis',
    icon: '🏘️',
    name: 'Aplikasi Digital Desa Ekonomis',
    desc: 'Sistem informasi desa yang dinamis dan modern. Identitas desa tampil profesional, informasi mudah diakses oleh seluruh warga.',
    startPrice: 'Rp 3.000.000',
    period: 'sekali bayar + hosting & domain 1 tahun',
    headerBg: 'linear-gradient(135deg,#065f46,#059669)',
    features: [
      'Identitas & profil desa lengkap',
      'Sistem artikel & berita terkini',
      'Agenda kegiatan desa',
      'Galeri foto & slider',
      'Free hosting & domain 1 tahun',
      'Desain responsif di semua perangkat',
      'Panel admin untuk kelola konten',
      'SSL terenkripsi',
    ],
    options: [
      { label: 'Paket Promo — Free Hosting & Domain 1 Tahun', price: 'Rp 3.000.000', promo: true, promo_label: 'PROMO' },
      { label: 'Paket Reguler — Free Hosting & Domain 1 Tahun', price: 'Rp 4.500.000', promo: false, promo_label: '' },
      { label: 'Perpanjangan Hosting', price: 'Rp 500.000/thn', promo: true, promo_label: 'Hemat 15%' },
      { label: 'Perpanjangan Domain', price: 'Rp 250.000/thn', promo: false, promo_label: '' },
    ]
  },
  {
    slug: 'web-desa-premium',
    icon: '⭐',
    name: 'Aplikasi Digital Desa Premium',
    desc: 'Semua fitur Ekonomis plus sistem manajemen canggih. Untuk desa yang ingin tampil lebih maju dengan fitur administrasi digital yang lengkap.',
    startPrice: 'Rp 5.500.000',
    period: 'sekali bayar + hosting & domain 1 tahun',
    headerBg: 'linear-gradient(135deg,#4c1d95,#7c3aed)',
    features: [
      'Semua fitur Paket Ekonomis',
      'Sistem pengaduan warga online',
      'Kelola program bantuan sosial',
      'Manajemen data penduduk',
      'Pilihan tema eksklusif',
      'Dashboard admin lengkap',
      'Laporan statistik desa',
      'Prioritas dukungan teknis',
    ],
    options: [
      { label: 'Paket Promo — Free Hosting & Domain 1 Tahun', price: 'Rp 5.500.000', promo: true, promo_label: 'PROMO' },
      { label: 'Paket Reguler — Free Hosting & Domain 1 Tahun', price: 'Rp 5.750.000', promo: false, promo_label: '' },
      { label: 'Perpanjangan Hosting', price: 'Rp 500.000/thn', promo: true, promo_label: 'Hemat 15%' },
      { label: 'Perpanjangan Domain', price: 'Rp 250.000/thn', promo: false, promo_label: '' },
    ]
  },
]

const proses = [
  { icon: '💬', title: 'Konsultasi', desc: 'Diskusi kebutuhan & anggaran' },
  { icon: '📋', title: 'Proposal', desc: 'Detail spesifikasi & timeline' },
  { icon: '💳', title: 'Invoice', desc: 'Pembayaran via platform' },
  { icon: '✏️', title: 'Desain', desc: 'Mockup & persetujuan tampilan' },
  { icon: '⚙️', title: 'Pengembangan', desc: 'Pengerjaan & testing' },
  { icon: '🚀', title: 'Peluncuran', desc: 'Live & serah terima' },
]
</script>
