<template>
  <div style="min-height:100vh;background:#f8faff;font-family:'Inter',sans-serif">

    <!-- Navbar -->
    <nav :style="navScrolled
      ? 'position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);border-bottom:1px solid #e2e8f0;padding:0 32px;box-shadow:0 2px 16px rgba(0,0,0,0.08);transition:all 0.3s'
      : 'position:fixed;top:0;left:0;right:0;z-index:100;background:transparent;padding:0 32px;transition:all 0.3s'">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px">
        <div style="font-size:26px;font-weight:900;letter-spacing:-0.5px">
          <span :style="navScrolled ? 'color:#1a4fa0' : 'color:white'">mi</span><span :style="navScrolled ? 'color:#c0192c' : 'color:#fbbf24'">TRANZ</span>
        </div>
        <div style="display:flex;align-items:center;gap:16px">
          <a href="/auth/login" :style="navScrolled ? 'padding:8px 20px;color:#1a4fa0;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;border:1.5px solid #1a4fa0' : 'padding:8px 20px;color:white;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;border:1.5px solid rgba(255,255,255,0.7)'">Masuk</a>
          <a href="/kontak" :style="navScrolled ? 'padding:8px 20px;background:#1a4fa0;color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700' : 'padding:8px 20px;background:rgba(255,255,255,0.18);color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;backdrop-filter:blur(8px)'">Konsultasi Gratis</a>
        </div>
      </div>
    </nav>

    <!-- Hero: Aplikasi Digital -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#1a4fa0 100%);padding:clamp(60px,10vw,100px) clamp(16px,4vw,32px) clamp(60px,10vw,100px);padding-top:calc(clamp(60px,10vw,100px) + 64px);position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;opacity:0.06;background:radial-gradient(circle at 20% 50%,#60a5fa 0%,transparent 50%),radial-gradient(circle at 80% 20%,#a78bfa 0%,transparent 50%)"></div>
      <div style="max-width:1100px;margin:0 auto;position:relative;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center">
        <div>
          <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:100px;padding:6px 16px;margin-bottom:24px">
            <span style="width:6px;height:6px;background:#10b981;border-radius:50%;display:inline-block"></span>
            <span style="color:rgba(255,255,255,0.8);font-size:12px;font-weight:600;letter-spacing:1px">PT MITRA TRANS DIGITAL</span>
          </div>
          <h1 style="font-size:clamp(28px,4vw,44px);font-weight:900;color:white;line-height:1.15;margin:0 0 20px;letter-spacing:-1px">
            Solusi <span style="color:#fbbf24">Platform</span><br>Digital <span style="color:#60a5fa">Anda</span>
          </h1>
          <p style="color:rgba(255,255,255,0.75);font-size:17px;line-height:1.8;margin:0 0 36px;max-width:460px">
            Kami wujudkan aplikasi digital modern yang profesional dan terpercaya — sesuai kebutuhan dan anggaran Anda.
          </p>
          <div style="display:flex;gap:14px;flex-wrap:wrap">
            <a href="/kontak"
              style="padding:14px 28px;background:#fbbf24;color:#1a202c;border-radius:12px;text-decoration:none;font-size:15px;font-weight:800;box-shadow:0 4px 20px rgba(251,191,36,0.35);display:inline-flex;align-items:center;gap:8px">
              🚀 Konsultasi Gratis
            </a>
            <a href="#layanan"
              onclick="event.preventDefault();document.getElementById('layanan').scrollIntoView({behavior:'smooth'})"
              style="padding:14px 28px;background:rgba(255,255,255,0.1);color:white;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;border:1.5px solid rgba(255,255,255,0.25);display:inline-flex;align-items:center;gap:8px">
              Lihat Paket →
            </a>
          </div>
        </div>

        <!-- Stats card kanan -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div v-for="s in stats" :key="s.label"
            style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:24px;backdrop-filter:blur(8px)">
            <div style="font-size:26px;font-weight:900;color:white;margin-bottom:4px">{{ s.value }}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.6)">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cara Kerja -->
    <div style="background:white;padding:64px 32px">
      <div style="max-width:1100px;margin:0 auto">
        <div style="text-align:center;margin-bottom:56px">
          <span style="background:#eff6ff;color:#1a4fa0;font-size:12px;font-weight:700;padding:4px 14px;border-radius:100px;letter-spacing:1px">BAGAIMANA CARA KERJANYA</span>
          <h2 style="font-size:clamp(22px,2.8vw,32px);font-weight:900;color:#1a202c;margin:12px 0 12px;letter-spacing:-0.5px">Dari Konsultasi hingga<br>Aplikasi Digital Siap</h2>
          <p style="color:#64748b;font-size:15px;max-width:480px;margin:0 auto">Proses yang sederhana, transparan, dan terukur — dari awal hingga aplikasi Anda live.</p>
        </div>

        <!-- Steps -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px">
          <div v-for="(step, i) in steps" :key="i"
            style="background:white;border-radius:20px;padding:32px 24px;border:1px solid #e2e8f0;box-shadow:0 2px 16px rgba(26,79,160,0.06);position:relative;overflow:hidden;transition:all 0.2s">

            <!-- Nomor besar di background -->
            <div style="position:absolute;top:-10px;right:16px;font-size:80px;font-weight:900;color:#f0f7ff;line-height:1;user-select:none;pointer-events:none">{{ i+1 }}</div>

            <!-- Badge step -->
            <div style="display:inline-flex;align-items:center;gap:6px;background:#eff6ff;border-radius:100px;padding:4px 12px;margin-bottom:20px">
              <span style="font-size:10px;font-weight:800;color:#1a4fa0;letter-spacing:1px">LANGKAH 0{{ i+1 }}</span>
            </div>

            <!-- Ikon -->
            <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#1a4fa0,#2563eb);display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 4px 12px rgba(26,79,160,0.25)">
              <span style="font-size:26px">{{ step.icon }}</span>
            </div>

            <div style="font-size:16px;font-weight:800;color:#1a202c;margin-bottom:10px">{{ step.title }}</div>
            <div style="font-size:13px;color:#64748b;line-height:1.7">{{ step.desc }}</div>

            <!-- Bottom accent -->
            <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#1a4fa0,#2563eb)"></div>
          </div>
        </div>

        <!-- CTA bawah -->
        <div style="text-align:center;margin-top:48px">
          <a href="/kontak"
            style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:#1a4fa0;color:white;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;box-shadow:0 4px 16px rgba(26,79,160,0.25)">
            Mulai Konsultasi Gratis →
          </a>
        </div>
      </div>
    </div>

    <!-- Paket Aplikasi Digital -->
    <div style="background:linear-gradient(180deg,#f0f7ff 0%,#ffffff 100%);padding:64px 32px" id="layanan">
      <div style="max-width:1200px;margin:0 auto">
        <div style="text-align:center;margin-bottom:48px">
          <span style="background:#fef3c7;color:#d97706;font-size:12px;font-weight:700;padding:4px 14px;border-radius:100px;letter-spacing:1px">PAKET LAYANAN</span>
          <h2 style="font-size:32px;font-weight:900;color:#1a202c;margin:12px 0 12px;letter-spacing:-0.5px">Aplikasi Digital Profesional untuk Semua Kebutuhan</h2>
          <p style="color:#64748b;font-size:15px;max-width:500px;margin:0 auto">Harga transparan, tanpa biaya tersembunyi. Pilih paket yang sesuai dengan kebutuhan Anda.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:24px">
          <div v-for="w in websiteProducts" :key="w.name"
            :style="{background:'white',borderRadius:'20px',padding:'32px',border: w.featured ? '2px solid #1a4fa0' : '2px solid #e2e8f0',position:'relative',boxShadow:w.featured ? '0 8px 32px rgba(26,79,160,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',transition:'all 0.2s'}">
            <div v-if="w.featured" style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#1a4fa0;color:white;font-size:11px;font-weight:700;padding:4px 16px;border-radius:100px;white-space:nowrap">
              ⭐ PALING DIMINATI
            </div>
            <div style="font-size:36px;margin-bottom:16px">{{ w.icon }}</div>
            <h3 style="font-size:19px;font-weight:800;color:#1a202c;margin:0 0 8px">{{ w.name }}</h3>
            <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 20px">{{ w.desc }}</p>
            <div style="margin-bottom:20px">
              <div style="font-size:12px;color:#94a3b8;margin-bottom:4px">Mulai dari</div>
              <div style="font-size:28px;font-weight:900;color:#1a4fa0">{{ w.startPrice }}</div>
              <div style="font-size:12px;color:#94a3b8">{{ w.period }}</div>
            </div>
            <ul style="list-style:none;padding:0;margin:0 0 24px">
              <li v-for="f in w.features" :key="f" style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;margin-bottom:8px">
                <span style="color:#10b981;font-weight:700;flex-shrink:0">✓</span> {{ f }}
              </li>
            </ul>
            <a :href="'/kontak?paket=' + w.slug"
              :style="{display:'block',textAlign:'center',padding:'13px',borderRadius:'10px',textDecoration:'none',fontSize:'14px',fontWeight:'700',background:w.featured ? '#1a4fa0' : '#f1f5f9',color:w.featured ? 'white' : '#1a4fa0'}">
              Konsultasi Sekarang →
            </a>
          </div>
        </div>

        <!-- CTA konsultasi -->
        <div style="margin-top:40px;background:linear-gradient(135deg,#1a4fa0,#2563eb);border-radius:20px;padding:40px;text-align:center">
          <h3 style="font-size:22px;font-weight:800;color:white;margin:0 0 10px">Tidak yakin paket mana yang cocok?</h3>
          <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 24px">Konsultasikan kebutuhan Anda secara gratis. Tim kami siap membantu.</p>
          <a href="/kontak" style="display:inline-block;padding:12px 32px;background:white;color:#1a4fa0;border-radius:10px;text-decoration:none;font-size:14px;font-weight:800">
            💬 Hubungi Kami Sekarang
          </a>
        </div>
      </div>
    </div>

    <!-- Layanan Tambahan — satu baris -->
    <div style="background:#f0f4f8;padding:32px">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
        <div>
          <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:4px">Butuh layanan pembayaran digital?</div>
          <div style="font-size:13px;color:#64748b">Token listrik, pulsa, voucher game, dan lainnya tersedia di platform kami.</div>
        </div>
        <a href="/ppob"
          style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;background:white;color:#1a4fa0;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;border:1.5px solid #1a4fa0;white-space:nowrap">
          ⚡ Layanan Pembayaran Digital →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <footer style="background:#1a202c;padding:56px 32px 32px">
      <div style="max-width:1200px;margin:0 auto">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:40px;margin-bottom:48px">
          <div>
            <div style="font-size:28px;font-weight:900;margin-bottom:12px">
              <span style="color:#60a5fa">mi</span><span style="color:#f87171">TRANZ</span>
            </div>
            <p style="color:#94a3b8;font-size:13px;line-height:1.8;margin:0 0 12px">
              Platform layanan digital terpercaya untuk kebutuhan aplikasi digital profesional dan pembayaran digital Anda.
            </p>
            <div style="display:flex;flex-direction:column;gap:6px">
              <a href="mailto:cs@mitranz.com" style="color:#60a5fa;font-size:13px;text-decoration:none">📧 cs@mitranz.com</a>
              <span style="color:#475569;font-size:12px">PT Mitra Trans Digital</span>
            </div>
          </div>
          <div>
            <div style="font-weight:700;color:white;font-size:14px;margin-bottom:16px;letter-spacing:0.5px">LAYANAN</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <a href="/kontak?paket=web-umkm" style="color:#94a3b8;text-decoration:none;font-size:13px">🏪 Aplikasi Digital UMKM</a>
              <a href="/kontak?paket=web-desa-ekonomis" style="color:#94a3b8;text-decoration:none;font-size:13px">🏘️ Aplikasi Digital Desa Ekonomis</a>
              <a href="/kontak?paket=web-desa-premium" style="color:#94a3b8;text-decoration:none;font-size:13px">⭐ Aplikasi Digital Desa Premium</a>

            </div>
          </div>
          <div>
            <div style="font-weight:700;color:white;font-size:14px;margin-bottom:16px;letter-spacing:0.5px">PERUSAHAAN</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <a href="/tentang" style="color:#94a3b8;text-decoration:none;font-size:13px">Tentang Kami</a>
              <a href="/kontak" style="color:#94a3b8;text-decoration:none;font-size:13px">Kontak</a>
              <a href="/faq" style="color:#94a3b8;text-decoration:none;font-size:13px">FAQ</a>
            </div>
          </div>
          <div>
            <div style="font-weight:700;color:white;font-size:14px;margin-bottom:16px;letter-spacing:0.5px">LEGAL</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <a href="/syarat" style="color:#94a3b8;text-decoration:none;font-size:13px">Syarat & Ketentuan</a>
              <a href="/privasi" style="color:#94a3b8;text-decoration:none;font-size:13px">Kebijakan Privasi</a>
              <a href="/refund" style="color:#94a3b8;text-decoration:none;font-size:13px">Kebijakan Refund</a>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">
          <p style="color:#475569;font-size:13px;margin:0">© 2026 <strong style="color:#64748b">PT Mitra Trans Digital</strong>. Semua hak dilindungi.</p>
          <div style="display:flex;gap:16px">
            <a href="/syarat" style="color:#475569;text-decoration:none;font-size:12px">Syarat & Ketentuan</a>
            <a href="/privasi" style="color:#475569;text-decoration:none;font-size:12px">Privasi</a>
            <a href="/refund" style="color:#475569;text-decoration:none;font-size:12px">Refund</a>
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
  title: 'miTRANZ — Solusi Platform Digital Profesional',
  meta: [
    { name: 'description', content: 'Solusi platform digital profesional untuk UMKM, bisnis, dan instansi. Aplikasi modern, harga transparan, pengerjaan tepat waktu. PT Mitra Trans Digital.' }
  ]
})

const { status, fetchUser } = useCustomAuth()

const navScrolled = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    navScrolled.value = window.scrollY > 80
  })
})

const stats = [
  { value: '3+', label: 'Tahun Pengalaman' },
  { value: '50+', label: 'Klien Terlayani' },
  { value: '24/7', label: 'Dukungan Aktif' },
  { value: 'SSL', label: 'Keamanan Terenkripsi' },
]

const steps = [
  { icon: '💬', title: 'Konsultasi', desc: 'Ceritakan kebutuhan Anda, kami bantu tentukan solusi terbaik.' },
  { icon: '✏️', title: 'Desain', desc: 'Tim desainer kami merancang tampilan sesuai identitas bisnis Anda.' },
  { icon: '⚙️', title: 'Pengembangan', desc: 'Aplikasi digital dibangun dengan teknologi modern dan performa tinggi.' },
  { icon: '🚀', title: 'Peluncuran', desc: 'Aplikasi digital live dan siap diakses seluruh dunia.' },
]



const websiteProducts = [
  {
    slug: 'web-umkm',
    icon: '🏪',
    name: 'Aplikasi Digital UMKM',
    desc: 'Aplikasi digital profesional untuk usaha kecil dan menengah. Tampil online, raih lebih banyak pelanggan.',
    startPrice: 'Rp 1.750.000',
    period: 'sekali bayar + hosting 1 tahun',
    featured: false,
    features: ['Desain modern & responsif', 'Free hosting 1 tahun', 'Tombol Kontak & WhatsApp', 'Google Maps terintegrasi', 'SEO dasar'],
  },
  {
    slug: 'web-desa-ekonomis',
    icon: '🏘️',
    name: 'Aplikasi Digital Desa Ekonomis',
    desc: 'Aplikasi digital dengan fitur standar layanan desa. Identitas dan informasi desa tampil profesional.',
    startPrice: 'Rp 3.000.000',
    period: 'sekali bayar + hosting & domain 1 tahun',
    featured: true,
    features: ['Identitas & profil desa lengkap', 'Artikel & berita terkini', 'Agenda kegiatan desa', 'Galeri foto & slider', 'Responsif di semua perangkat'],
  },
  {
    slug: 'web-desa-premium',
    icon: '⭐',
    name: 'Aplikasi Digital Desa Premium',
    desc: 'Semua fitur Ekonomis plus manajemen canggih untuk desa yang ingin tampil lebih maju.',
    startPrice: 'Rp 5.500.000',
    period: 'sekali bayar + hosting & domain 1 tahun',
    featured: false,
    features: ['Semua fitur Ekonomis', 'Pengaduan warga online', 'Kelola program bantuan', 'Manajemen data penduduk', 'Pilihan tema eksklusif'],
  },
]

const features = [
  { icon: '🎨', title: 'Desain Profesional', desc: 'Tampilan modern, bersih, dan responsif di semua perangkat — desktop, tablet, maupun mobile.' },
  { icon: '⚡', title: 'Teknologi Terkini', desc: 'Dibangun dengan framework modern untuk performa cepat dan pengalaman pengguna terbaik.' },
  { icon: '🔒', title: 'Aman & Terpercaya', desc: 'SSL terenkripsi, backup rutin, dan perlindungan data pelanggan yang terjamin.' },
  { icon: '💬', title: 'Support Responsif', desc: 'Tim kami siap membantu via chat dan email. Tidak ada pertanyaan yang dibiarkan tanpa jawaban.' },
]


onMounted(async () => {
  await fetchUser().catch(() => {})
  if (status.value === 'authenticated') navigateTo('/dashboard')
})
</script>
