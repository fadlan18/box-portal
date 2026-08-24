<template>
  <div style="min-height:100vh;background:#f0f6ff;font-family:'Inter',sans-serif">

    <!-- Navbar -->
    <nav :style="navScrolled
    ? 'position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-bottom:1px solid #e2e8f0;padding:0 32px;box-shadow:0 2px 16px rgba(0,0,0,0.08);transition:all 0.3s ease'
    : 'position:fixed;top:0;left:0;right:0;z-index:100;background:transparent;padding:0 32px;transition:all 0.3s ease'">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px">
        <div style="font-size:26px;font-weight:900;letter-spacing:-0.5px">
          <span :style="navScrolled ? 'color:#1a4fa0' : 'color:white'">mi</span><span :style="navScrolled ? 'color:#c0192c' : 'color:#fbbf24'">TRANZ</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <a href="/auth/login" :style="navScrolled ? 'padding:8px 20px;color:#1a4fa0;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;border:1.5px solid #1a4fa0;transition:all 0.3s' : 'padding:8px 20px;color:white;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;border:1.5px solid rgba(255,255,255,0.7);transition:all 0.3s;text-shadow:0 1px 3px rgba(0,0,0,0.3)'"
            onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='transparent'">Masuk</a>
          <a href="/auth/login" :style="navScrolled ? 'padding:8px 20px;background:#1a4fa0;color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1.5px solid #1a4fa0;transition:all 0.3s' : 'padding:8px 20px;background:rgba(255,255,255,0.18);color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1.5px solid rgba(255,255,255,0.5);transition:all 0.3s;backdrop-filter:blur(8px)'"
            onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background=navScrolled?'#1a4fa0':'rgba(255,255,255,0.18)'">Daftar</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a4fa0 0%,#2563eb 50%,#1e40af 100%);padding:clamp(40px,8vw,80px) clamp(16px,4vw,32px) clamp(48px,10vw,100px);padding-top:calc(clamp(40px,8vw,80px) + 64px);text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2220%22 cy=%2220%22 r=%2240%22 fill=%22rgba(255,255,255,0.03)%22/><circle cx=%2280%22 cy=%2280%22 r=%2260%22 fill=%22rgba(255,255,255,0.03)%22/></svg>');background-size:cover"></div>
      <div style="position:relative;max-width:800px;margin:0 auto">

        <h1 style="font-size:clamp(28px,5vw,38px);font-weight:900;color:white;line-height:1.1;margin:0 0 20px;letter-spacing:-1px">
          Platform Layanan Digital<br>
          <span style="color:#fbbf24">Terpercaya</span>
        </h1>
        <p style="color:rgba(255,255,255,0.85);font-size:18px;max-width:560px;margin:0 auto 40px;line-height:1.7">
          PPOB instan, jasa website profesional, dan layanan digital lainnya.
        </p>
        <!-- Poin 6: label Layanan sekali, dua button di bawahnya -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="height:1px;width:40px;background:rgba(255,255,255,0.3)"></div>
            <span style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Pilih Layanan</span>
            <div style="height:1px;width:40px;background:rgba(255,255,255,0.3)"></div>
          </div>
          <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
            <a href="#ppob" onclick="event.preventDefault();document.getElementById('ppob').scrollIntoView({behavior:'smooth'})"
              style="min-width:180px;padding:16px 32px;background:white;color:#1a4fa0;border-radius:14px;text-decoration:none;font-size:17px;font-weight:800;box-shadow:0 6px 24px rgba(0,0,0,0.18);display:inline-flex;align-items:center;justify-content:center;gap:10px;transition:all 0.25s;white-space:nowrap;border:none;letter-spacing:-0.3px"
              onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,0.22)';this.style.background='#f0f6ff'"
              onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 6px 24px rgba(0,0,0,0.18)';this.style.background='white'">
              <span style="font-size:20px">⚡</span> Bayar PPOB
            </a>
            <a href="#layanan" onclick="event.preventDefault();document.getElementById('layanan').scrollIntoView({behavior:'smooth'})"
              style="min-width:180px;padding:16px 32px;background:transparent;color:white;border-radius:14px;text-decoration:none;font-size:17px;font-weight:800;border:2px solid rgba(255,255,255,0.8);display:inline-flex;align-items:center;justify-content:center;gap:10px;transition:all 0.25s;white-space:nowrap;letter-spacing:-0.3px;backdrop-filter:blur(8px)"
              onmouseover="this.style.transform='translateY(-4px)';this.style.background='rgba(255,255,255,0.15)';this.style.borderColor='white'"
              onmouseout="this.style.transform='translateY(0)';this.style.background='transparent';this.style.borderColor='rgba(255,255,255,0.8)'">
              <span style="font-size:20px">🌐</span> Buat Website
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
    <footer style="background:#1a202c;padding:56px 32px 32px">
      <div style="max-width:1200px;margin:0 auto">

        <!-- Grid footer -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:40px;margin-bottom:48px">

          <!-- Brand -->
          <div style="grid-column:span 1">
            <div style="font-size:28px;font-weight:900;margin-bottom:12px">
              <span style="color:#60a5fa">mi</span><span style="color:#f87171">TRANZ</span>
            </div>
            <p style="color:#94a3b8;font-size:13px;line-height:1.8;margin:0 0 16px">
              Platform layanan digital terpercaya untuk semua kebutuhan pembayaran dan solusi digital Anda.
            </p>
            <a href="mailto:cs@mitranz.com" style="color:#60a5fa;font-size:13px;text-decoration:none">📧 cs@mitranz.com</a>
          </div>

          <!-- Layanan -->
          <div>
            <div style="font-weight:700;color:white;font-size:14px;margin-bottom:16px;letter-spacing:0.5px">LAYANAN</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <a href="/ppob/pln" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">⚡ Token Listrik PLN</a>
              <a href="/ppob/pulsa" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">📱 Pulsa & Paket Data</a>
              <a href="/ppob/games" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">🎮 Voucher Game</a>
              <a href="#layanan" onclick="event.preventDefault();document.getElementById('layanan').scrollIntoView({behavior:'smooth'})" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">🌐 Jasa Website</a>
            </div>
          </div>

          <!-- Perusahaan -->
          <div>
            <div style="font-weight:700;color:white;font-size:14px;margin-bottom:16px;letter-spacing:0.5px">PERUSAHAAN</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <a href="/tentang" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">Tentang Kami</a>
              <a href="/kontak" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">Kontak</a>
              <a href="/faq" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">FAQ</a>
            </div>
          </div>

          <!-- Legal -->
          <div>
            <div style="font-weight:700;color:white;font-size:14px;margin-bottom:16px;letter-spacing:0.5px">LEGAL</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <a href="/syarat" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">Syarat & Ketentuan</a>
              <a href="/privasi" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">Kebijakan Privasi</a>
              <a href="/refund" style="color:#94a3b8;text-decoration:none;font-size:13px" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">Kebijakan Refund</a>
            </div>
          </div>

        </div>

        <!-- Divider -->
        <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">
          <p style="color:#475569;font-size:13px;margin:0">© 2026 miTRANZ. Platform Layanan Digital Terpercaya.</p>
          <div style="display:flex;gap:16px">
            <a href="/syarat" style="color:#475569;text-decoration:none;font-size:12px" onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#475569'">Syarat & Ketentuan</a>
            <a href="/privasi" style="color:#475569;text-decoration:none;font-size:12px" onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#475569'">Privasi</a>
            <a href="/refund" style="color:#475569;text-decoration:none;font-size:12px" onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#475569'">Refund</a>
          </div>
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

// Navbar scroll behavior
const navScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    navScrolled.value = window.scrollY > 80
  })
})

const stats = [
  { value: '5+', label: 'Operator Tersedia' },
  { value: 'Instan', label: 'Proses Transaksi' },
  { value: '24/7', label: 'Layanan Support' },
  { value: '100%', label: 'Aman & Terenkripsi' },
]

// PPOB dari API - featured max 6, diatur dari admin
const ppobProducts = ref<any[]>([])
onMounted(async () => {
  try {
    const all = await $fetch<any[]>('/api/ppob/categories')
    ppobProducts.value = all
      .filter(c => c.is_featured)
      .sort((a, b) => a.featured_order - b.featured_order)
      .slice(0, 6)
  } catch {
    // fallback hardcode jika API gagal
    ppobProducts.value = [
      { icon: '⚡', name: 'Token Listrik', desc: 'PLN prabayar', href: '/ppob/pln' },
      { icon: '📱', name: 'Pulsa & Data', desc: 'Semua operator', href: '/ppob/pulsa' },
      { icon: '🎮', name: 'Voucher Game', desc: 'Mobile Legends, FF', href: '/ppob/games' },
      { icon: '📺', name: 'TV Kabel', desc: 'K-Vision & lainnya', href: '/ppob/tv' },
      { icon: '💳', name: 'E-Money', desc: 'Top up dompet digital', href: '/ppob/emoney' },
    ]
  }
})

const websiteProducts = [
  {
    slug: 'web-umkm',
    icon: '🏪',
    name: 'Paket Website UMKM',
    desc: 'Website profesional untuk usaha kecil dan menengah. Tampil online, raih lebih banyak pelanggan.',
    startPrice: 'Rp 1.750.000',
    period: 'sekali bayar + hosting 1 tahun',
    featured: false,
    features: ['Desain modern & responsif', 'Free hosting 1 tahun', 'Tombol Kontak', 'Google Maps', 'SEO dasar'],
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
  { icon: '💬', title: 'Support Responsif', desc: 'Tim support siap membantu via fitur chat langsung dan email.' },
]

onMounted(async () => {
  await fetchUser().catch(() => {})
  if (status.value === 'authenticated') navigateTo('/dashboard')
})
</script>
