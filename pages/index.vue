<template>
  <div style="min-height:100vh;background:#f0f6ff;font-family:'Inter',sans-serif">

    <!-- Navbar -->
    <nav style="position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-bottom:1px solid #e2e8f0;padding:0 32px">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px">
        <div style="font-size:26px;font-weight:900;letter-spacing:-0.5px">
          <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <a href="/auth/login" style="padding:8px 20px;color:#1a4fa0;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;border:1.5px solid #1a4fa0;transition:all 0.2s"
            onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">Masuk</a>
          <a href="/auth/login" style="padding:8px 20px;background:#1a4fa0;color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;box-shadow:0 2px 8px rgba(26,79,160,0.3);transition:all 0.2s"
            onmouseover="this.style.background='#1e40af'" onmouseout="this.style.background='#1a4fa0'">Daftar Gratis</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a4fa0 0%,#2563eb 50%,#1e40af 100%);padding:clamp(40px,8vw,80px) clamp(16px,4vw,32px) clamp(48px,10vw,100px);text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2220%22 cy=%2220%22 r=%2240%22 fill=%22rgba(255,255,255,0.03)%22/><circle cx=%2280%22 cy=%2280%22 r=%2260%22 fill=%22rgba(255,255,255,0.03)%22/></svg>');background-size:cover"></div>
      <div style="position:relative;max-width:800px;margin:0 auto">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:100px;margin-bottom:24px">
          <span style="color:white;font-size:13px;font-weight:600">🚀 Platform Layanan Digital Terpercaya</span>
        </div>
        <h1 style="font-size:clamp(28px,5vw,38px);font-weight:900;color:white;line-height:1.1;margin:0 0 20px;letter-spacing:-1px">
          Semua Layanan Digital<br>
          <span style="color:#fbbf24">dalam Satu Platform</span>
        </h1>
        <p style="color:rgba(255,255,255,0.85);font-size:18px;max-width:560px;margin:0 auto 40px;line-height:1.7">
          PPOB instan, jasa website profesional, dan layanan digital lainnya. Cepat, terpercaya, mudah digunakan.
        </p>
        <!-- Poin 6: label Layanan sekali, dua button di bawahnya -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="height:1px;width:40px;background:rgba(255,255,255,0.3)"></div>
            <span style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Pilih Layanan</span>
            <div style="height:1px;width:40px;background:rgba(255,255,255,0.3)"></div>
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
            <a href="#ppob" onclick="event.preventDefault();document.getElementById('ppob').scrollIntoView({behavior:'smooth'})"
              style="min-width:160px;padding:14px 28px;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#1a1a1a;border-radius:12px;text-decoration:none;font-size:15px;font-weight:800;box-shadow:0 4px 20px rgba(251,191,36,0.4);display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;white-space:nowrap;border:none"
              onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 28px rgba(251,191,36,0.5)'"
              onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(251,191,36,0.4)'">
              ⚡ PPOB
            </a>
            <a href="#layanan" onclick="event.preventDefault();document.getElementById('layanan').scrollIntoView({behavior:'smooth'})"
              style="min-width:160px;padding:14px 28px;background:rgba(255,255,255,0.12);color:white;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;border:1.5px solid rgba(255,255,255,0.35);display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;white-space:nowrap;backdrop-filter:blur(8px)"
              onmouseover="this.style.background='rgba(255,255,255,0.22)';this.style.transform='translateY(-3px)';this.style.borderColor='rgba(255,255,255,0.6)'"
              onmouseout="this.style.background='rgba(255,255,255,0.12)';this.style.transform='translateY(0)';this.style.borderColor='rgba(255,255,255,0.35)'">
              🌐 Website
            </a>
          </div>
        </div>

        <!-- Stats -->
        <div style="display:flex;gap:40px;justify-content:center;margin-top:56px;flex-wrap:wrap">
          <div v-for="s in stats" :key="s.label" style="text-align:center">
            <div style="font-size:28px;font-weight:900;color:white">{{ s.value }}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:2px">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- PPOB Showcase -->
    <div style="background:linear-gradient(180deg,#ffffff 0%,#f0f7ff 100%);padding:64px 32px" id="ppob">
      <div style="max-width:1200px;margin:0 auto">
        <div style="text-align:center;margin-bottom:48px">
          <span style="background:#eff6ff;color:#1a4fa0;font-size:13px;font-weight:700;padding:4px 14px;border-radius:100px;letter-spacing:0.5px">PPOB</span>
          <h2 style="font-size:36px;font-weight:900;color:#1a202c;margin:12px 0 12px;letter-spacing:-0.5px">Bayar & Top Up Instan</h2>
          <p style="color:#64748b;font-size:16px;max-width:480px;margin:0 auto">Semua kebutuhan pembayaran digital dalam satu platform. Proses otomatis dalam hitungan detik.</p>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:32px">
          <a v-for="p in ppobProducts" :key="p.href" :href="p.href"
            style="display:flex;flex-direction:column;align-items:center;padding:24px 16px;background:white;border:1.5px solid #dbeafe;border-radius:16px;text-decoration:none;transition:all 0.2s;cursor:pointer;box-shadow:0 2px 12px rgba(26,79,160,0.06)"
            onmouseover="this.style.background='#eff6ff';this.style.borderColor='#93c5fd';this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(26,79,160,0.12)'"
            onmouseout="this.style.background='#f8faff';this.style.borderColor='#e2e8f0';this.style.transform='translateY(0)';this.style.boxShadow='none'">
            <div style="font-size:40px;margin-bottom:12px">{{ p.icon }}</div>
            <div style="font-size:14px;font-weight:700;color:#1a202c;text-align:center">{{ p.name }}</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px;text-align:center">{{ p.desc }}</div>
          </a>
        </div>

        <div style="text-align:center">
          <a href="/ppob" style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:#1a4fa0;color:white;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;transition:all 0.2s" onmouseover="this.style.background='#1e40af';this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#1a4fa0';this.style.transform='translateY(0)'">
            Lihat Semua Layanan PPOB →
          </a>
        </div>
      </div>
    </div>

    <!-- Jasa Website -->
    <div style="background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 30%,#fff7ed 70%,#ffffff 100%);padding:64px 32px" id="layanan">
      <div style="max-width:1200px;margin:0 auto">
        <div style="text-align:center;margin-bottom:48px">
          <span style="background:#fef3c7;color:#d97706;font-size:13px;font-weight:700;padding:4px 14px;border-radius:100px">WEBSITE & DIGITAL</span>
          <h2 style="font-size:36px;font-weight:900;color:#1a202c;margin:12px 0 12px;letter-spacing:-0.5px">Jasa Website Profesional</h2>
          <p style="color:#64748b;font-size:16px;max-width:480px;margin:0 auto">Website modern untuk bisnis, UMKM, dan pemerintah desa. Harga transparan, kualitas terjamin.</p>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:24px">
          <div v-for="w in websiteProducts" :key="w.name"
            :style="`background:white;border-radius:20px;padding:32px;border:2px solid ${w.featured ? '#1a4fa0' : '#e2e8f0'};position:relative;box-shadow:${w.featured ? '0 8px 32px rgba(26,79,160,0.15)' : '0 2px 8px rgba(0,0,0,0.04)'};transition:all 0.2s`"
            onmouseover="this.style.transform='translateY(-4px)'"
            onmouseout="this.style.transform='translateY(0)'">
            <div v-if="w.featured" style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#1a4fa0;color:white;font-size:11px;font-weight:700;padding:4px 16px;border-radius:100px;white-space:nowrap">
              ⭐ PALING POPULER
            </div>
            <div style="font-size:36px;margin-bottom:16px">{{ w.icon }}</div>
            <h3 style="font-size:20px;font-weight:800;color:#1a202c;margin:0 0 8px">{{ w.name }}</h3>
            <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0 0 20px">{{ w.desc }}</p>
            <div style="margin-bottom:24px">
              <div style="font-size:13px;color:#94a3b8;margin-bottom:4px">Mulai dari</div>
              <div style="font-size:28px;font-weight:900;color:#1a4fa0">{{ w.startPrice }}</div>
              <div style="font-size:12px;color:#94a3b8">{{ w.period }}</div>
            </div>
            <ul style="list-style:none;padding:0;margin:0 0 24px">
              <li v-for="f in w.features" :key="f" style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;margin-bottom:8px">
                <span style="color:#10b981;font-weight:700">✓</span> {{ f }}
              </li>
            </ul>
            <a :href="`/auth/login?product=${w.slug}`"
              :style="`display:block;text-align:center;padding:13px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;transition:all 0.2s;background:${w.featured ? '#1a4fa0' : '#f1f5f9'};color:${w.featured ? 'white' : '#1a4fa0'}`"
              onmouseover="this.style.opacity='0.85'"
              onmouseout="this.style.opacity='1'">
              Lihat Detail & Pesan →
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Kenapa miTRANZ -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#1a4fa0 100%);padding:64px 32px">
      <div style="max-width:1200px;margin:0 auto">
        <div style="text-align:center;margin-bottom:48px">
          <h2 style="font-size:36px;font-weight:900;color:white;margin:0 0 12px;letter-spacing:-0.5px">Kenapa Pilih miTRANZ?</h2>
          <p style="color:rgba(255,255,255,0.7);font-size:16px">Kami hadir untuk mempermudah hidup digital Anda</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px">
          <div v-for="f in features" :key="f.title" style="padding:28px;background:rgba(255,255,255,0.07);border-radius:16px;border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(8px)">
            <div style="font-size:36px;margin-bottom:16px">{{ f.icon }}</div>
            <div style="font-size:16px;font-weight:700;color:white;margin-bottom:8px">{{ f.title }}</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.65);line-height:1.6">{{ f.desc }}</div>
          </div>
        </div>
      </div>
    </div>



    <!-- Footer -->
    <footer style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:40px 32px">
      <div style="max-width:1200px;margin:0 auto">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;margin-bottom:32px">
          <div>
            <div style="font-size:24px;font-weight:900;margin-bottom:12px">
              <span style="color:#60a5fa">mi</span><span style="color:#f87171">TRANZ</span>
            </div>
            <p style="color:#475569;font-size:13px;line-height:1.6">Platform layanan digital terpercaya untuk semua kebutuhan Anda.</p>
          </div>
          <div>
            <div style="font-weight:700;color:white;font-size:14px;margin-bottom:12px">Layanan</div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <a href="/ppob/pulsa" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">Pulsa & Data</a>
              <a href="/ppob/pln" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">Token Listrik PLN</a>
              <a href="/ppob/emoney" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">E-Wallet & E-Money</a>
              <a href="/ppob/games" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">Voucher Game</a>
              <a href="/services" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">Jasa Website</a>
            </div>
          </div>
          <div>
            <div style="font-weight:700;color:white;font-size:14px;margin-bottom:12px">Akun</div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <a href="/auth/login" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">Masuk</a>
              <a href="/auth/login" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">Daftar</a>
              <a href="/dashboard" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">Dashboard</a>
            </div>
          </div>
          <div>
            <div style="font-weight:700;color:white;font-size:14px;margin-bottom:12px">Kontak</div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <a href="https://wa.me/6281150000912" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">📱 WhatsApp</a>
              <a href="mailto:cs@mitranz.com" style="color:rgba(255,255,255,0.55);text-decoration:none;font-size:13px">✉️ cs@mitranz.com</a>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;text-align:center">
          <p style="color:rgba(255,255,255,0.4);font-size:13px">© 2026 miTRANZ. Platform Layanan Digital Terpercaya.</p>
        </div>
      </div>
    </footer>

    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'miTRANZ — Platform Layanan Digital',
  meta: [
    { name: 'description', content: 'PPOB instan, jasa website profesional, dan layanan digital lainnya. Cepat, terpercaya, dan mudah digunakan.' }
  ]
})

const { status, fetchUser } = useCustomAuth()

const stats = [
  { value: '5+', label: 'Operator Tersedia' },
  { value: 'Instan', label: 'Proses Transaksi' },
  { value: '24/7', label: 'Layanan Support' },
  { value: '100%', label: 'Aman & Terenkripsi' },
]

const ppobProducts = [
  { icon: '📱', name: 'Pulsa', desc: 'Semua operator', href: '/ppob/pulsa' },
  { icon: '📶', name: 'Paket Data', desc: 'Telkomsel, XL, dll', href: '/ppob/pulsa' },
  { icon: '⚡', name: 'Token Listrik', desc: 'PLN prabayar', href: '/ppob/pln' },
  { icon: '💳', name: 'E-Wallet', desc: 'GoPay, OVO, DANA', href: '/ppob/emoney' },
  { icon: '🎮', name: 'Voucher Game', desc: 'Mobile Legends, FF', href: '/ppob/games' },
  { icon: '📺', name: 'TV Kabel', desc: 'K-Vision & lainnya', href: '/ppob/tv' },
]

const websiteProducts = [
  {
    slug: 'web-umkm',
    icon: '🏪',
    name: 'Paket Website UMKM',
    desc: 'Website profesional untuk usaha kecil dan menengah. Tampil online, raih lebih banyak pelanggan.',
    startPrice: 'Rp 1.750.000',
    period: 'sekali bayar + hosting 1 tahun',
    featured: false,
    features: ['Desain modern & responsif', 'Free hosting 1 tahun', 'WhatsApp button', 'Google Maps', 'SEO dasar'],
  },
  {
    slug: 'web-desa-ekonomis',
    icon: '🏘️',
    name: 'Website Desa Ekonomis',
    desc: 'Website dinamis dengan fitur standar layanan desa. Identitas dan informasi desa tampil profesional.',
    startPrice: 'Rp 3.000.000',
    period: 'sekali bayar + hosting & domain 1 tahun',
    featured: true,
    features: ['Identitas & profil desa', 'Artikel & berita', 'Agenda kegiatan', 'Galeri foto & slider', 'Responsif di semua perangkat'],
  },
  {
    slug: 'web-desa-premium',
    icon: '⭐',
    name: 'Website Desa Premium',
    desc: 'Semua fitur Ekonomis plus manajemen canggih. Untuk desa yang ingin tampil lebih maju dan modern.',
    startPrice: 'Rp 5.500.000',
    period: 'sekali bayar + hosting & domain 1 tahun',
    featured: false,
    features: ['Semua fitur Ekonomis', 'Pengaduan warga online', 'Kelola program bantuan', 'Manajemen data penduduk', 'Pilihan tema eksklusif'],
  },
]

const features = [
  { icon: '⚡', title: 'Proses Instan', desc: 'Transaksi PPOB diproses otomatis dalam hitungan detik. Token langsung ke meteran.' },
  { icon: '🔒', title: 'Aman & Terpercaya', desc: 'Sistem keamanan berlapis dengan enkripsi dan backup data rutin setiap hari.' },
  { icon: '💰', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi. Harga tertera adalah harga final yang Anda bayar.' },
  { icon: '💬', title: 'Support Responsif', desc: 'Tim support siap membantu via chat langsung, WhatsApp, dan email.' },
]

onMounted(async () => {
  await fetchUser()
  if (status.value === 'authenticated') navigateTo('/dashboard')
})
</script>
