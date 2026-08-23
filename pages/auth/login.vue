<template>
  <div style="min-height:100vh;display:flex;font-family:Inter,sans-serif">

    <!-- Kiri: Detail Produk (70%) — hanya tampil jika ada product param -->
    <div v-if="product" :style="`width:70%;min-height:100vh;padding:48px;display:flex;flex-direction:column;justify-content:center;background:${product.bg};position:relative;overflow:hidden`">
      <!-- Back -->
      <a href="/" style="display:inline-flex;align-items:center;gap:6px;color:#64748b;text-decoration:none;font-size:13px;font-weight:600;margin-bottom:40px;position:absolute;top:32px;left:48px">
        ← Kembali ke miTRANZ
      </a>

      <div style="max-width:560px;margin:0 auto;padding-top:40px">
        <!-- Badge -->
        <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:white;border-radius:100px;margin-bottom:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
          <span style="font-size:16px">{{ product.icon }}</span>
          <span :style="`font-size:12px;font-weight:700;color:${product.color}`">{{ product.name }}</span>
        </div>

        <h1 style="font-size:36px;font-weight:900;color:#1a202c;line-height:1.2;margin:0 0 12px;letter-spacing:-0.5px">
          {{ product.tagline }}
        </h1>
        <p style="font-size:16px;color:#475569;line-height:1.7;margin:0 0 32px">{{ product.desc }}</p>

        <!-- Pricing tiers -->
        <div style="background:white;border-radius:16px;padding:24px;margin-bottom:28px;box-shadow:0 4px 16px rgba(0,0,0,0.06)">
          <div style="font-size:12px;font-weight:700;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px">Pilihan Paket</div>
          <div v-for="tier in product.tiers" :key="tier.label"
            style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f1f5f9">
            <div>
              <div style="font-size:14px;font-weight:600;color:#1a202c">{{ tier.label }}</div>
              <div style="font-size:12px;color:#94a3b8">{{ tier.note }}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:16px;font-weight:800;color:#1a4fa0">{{ tier.price }}</div>
              <div v-if="tier.promo" style="display:inline-block;font-size:10px;font-weight:700;color:#f59e0b;background:#fef3c7;padding:2px 8px;border-radius:4px">{{ tier.promo }}</div>
            </div>
          </div>
        </div>

        <!-- Fitur -->
        <div style="background:white;border-radius:16px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.06)">
          <div style="font-size:12px;font-weight:700;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px">Yang Anda Dapatkan</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div v-for="f in product.features" :key="f" style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151">
              <span style="color:#10b981;font-weight:700;font-size:16px">✓</span> {{ f }}
            </div>
          </div>
        </div>

        <!-- Contact -->
        <div style="margin-top:24px;text-align:center">
          <p style="font-size:13px;color:#64748b">Ada pertanyaan? Hubungi kami via
            <a href="https://wa.me/6281150000912" style="color:#1a4fa0;font-weight:700;text-decoration:none">WhatsApp</a>
          </p>
        </div>
      </div>
    </div>

    <!-- Kanan: Form Login (30% jika ada produk, 100% jika tidak) -->
    <div :style="`${product ? 'width:30%' : 'width:100%'};min-height:100vh;background:white;display:flex;align-items:center;justify-content:center;padding:40px 32px;box-shadow:${product ? '-4px 0 24px rgba(0,0,0,0.08)' : 'none'}`">
      <div style="width:100%;max-width:380px">

        <!-- Logo -->
        <div style="text-align:center;margin-bottom:32px">
          <a href="/" style="text-decoration:none">
            <div style="font-size:32px;font-weight:900">
              <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
            </div>
          </a>
          <p v-if="product" style="color:#64748b;font-size:13px;margin:8px 0 0">
            Daftar atau masuk untuk memesan
          </p>
          <p v-else style="color:#64748b;font-size:14px;margin:8px 0 0">Platform Layanan Digital Terpercaya</p>
        </div>

        <!-- Tab -->
        <div style="display:flex;gap:4px;background:#f1f5f9;border-radius:12px;padding:4px;margin-bottom:24px">
          <button @click="mode='login'"
            style="flex:1;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s"
            :style="mode==='login' ? 'background:white;color:#1a4fa0;box-shadow:0 2px 8px rgba(0,0,0,0.08)' : 'background:transparent;color:#94a3b8'">
            Masuk
          </button>
          <button @click="mode='register'"
            style="flex:1;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s"
            :style="mode==='register' ? 'background:white;color:#1a4fa0;box-shadow:0 2px 8px rgba(0,0,0,0.08)' : 'background:transparent;color:#94a3b8'">
            Daftar
          </button>
        </div>

        <!-- Form Login -->
        <div v-if="mode==='login'" style="display:flex;flex-direction:column;gap:14px">
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Email</label>
            <input v-model="email" type="email" placeholder="nama@email.com"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;transition:border 0.2s"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"
              @keyup.enter="submit" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Password</label>
            <input v-model="password" type="password" placeholder="••••••••"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;transition:border 0.2s"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"
              @keyup.enter="submit" />
          </div>
          <p v-if="error" style="color:#dc2626;font-size:13px;margin:0">⚠️ {{ error }}</p>
          <button @click="submit" :disabled="loading"
            style="width:100%;padding:14px;background:#1a4fa0;color:white;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;transition:all 0.2s;margin-top:4px"
            :style="loading ? 'opacity:0.6' : ''"
            onmouseover="if(!this.disabled)this.style.background='#1e40af'" onmouseout="this.style.background='#1a4fa0'">
            {{ loading ? 'Memproses...' : 'Masuk →' }}
          </button>
        </div>

        <!-- Form Register -->
        <div v-if="mode==='register'" style="display:flex;flex-direction:column;gap:14px">
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Nama Lengkap</label>
            <input v-model="name" type="text" placeholder="Nama Anda"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Email</label>
            <input v-model="email" type="email" placeholder="nama@email.com"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'" />
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Password</label>
            <input v-model="password" type="password" placeholder="Minimal 8 karakter"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"
              @keyup.enter="submit" />
          </div>
          <p v-if="error" style="color:#dc2626;font-size:13px;margin:0">⚠️ {{ error }}</p>
          <p v-if="success" style="color:#16a34a;font-size:13px;margin:0">✅ {{ success }}</p>
          <button @click="submit" :disabled="loading"
            style="width:100%;padding:14px;background:#1a4fa0;color:white;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;transition:all 0.2s;margin-top:4px"
            :style="loading ? 'opacity:0.6' : ''">
            {{ loading ? 'Memproses...' : 'Daftar Sekarang →' }}
          </button>
        </div>

        <div style="text-align:center;margin-top:24px">
          <a href="/" style="color:#94a3b8;font-size:12px;text-decoration:none">← Kembali ke miTRANZ.com</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, auth: false })
useHead({ title: 'Masuk — miTRANZ' })

const route = useRoute()
const { login, register } = useCustomAuth()

const mode = ref<'login'|'register'>('login')
const email = ref('')
const password = ref('')
const name = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

// Data produk
const productsData: Record<string, any> = {"web-umkm": {"name": "Paket Website UMKM", "icon": "🏪", "tagline": "Onlinekan bisnis Anda sekarang", "desc": "Website profesional untuk usaha kecil dan menengah. Tampil lebih terpercaya di mata pelanggan dengan website yang modern, cepat, dan responsif.", "color": "#059669", "bg": "linear-gradient(135deg,#ecfdf5,#d1fae5)", "tiers": [{"label": "Paket Promo 1", "note": "Free hosting 1 tahun", "price": "Rp 1.750.000", "promo": "Promo"}, {"label": "Paket Promo 2", "note": "Free hosting 2 tahun", "price": "Rp 2.050.000", "promo": null}, {"label": "Perpanjangan", "note": "Hosting & Domain per tahun", "price": "Rp 500.000", "promo": "Hemat 15%"}], "features": ["Desain modern & responsif", "Free hosting & domain", "WhatsApp button terintegrasi", "Google Maps", "SEO dasar", "Dukungan teknis 30 hari"]}, "web-desa-ekonomis": {"name": "Website Desa Ekonomis", "icon": "🏘️", "tagline": "Wajah digital desa yang profesional", "desc": "Website dinamis dengan fitur standar layanan desa. Tampilkan identitas, berita, kegiatan, dan galeri desa secara online dengan mudah.", "color": "#1a4fa0", "bg": "linear-gradient(135deg,#eff6ff,#dbeafe)", "tiers": [{"label": "Paket Promo", "note": "Free hosting & domain 1 tahun", "price": "Rp 3.000.000", "promo": "Promo"}, {"label": "Paket Reguler", "note": "Free hosting & domain 1 tahun", "price": "Rp 4.500.000", "promo": null}, {"label": "Perpanjangan Hosting", "note": "per tahun", "price": "Rp 500.000", "promo": "Hemat 15%"}, {"label": "Perpanjangan Domain", "note": "per tahun", "price": "Rp 250.000", "promo": null}], "features": ["Identitas & profil desa", "Artikel & berita terkini", "Agenda kegiatan desa", "Galeri foto & slider", "Responsif di semua perangkat", "Panel admin mudah digunakan"]}, "web-desa-premium": {"name": "Website Desa Premium", "icon": "⭐", "tagline": "Desa modern dengan fitur lengkap", "desc": "Semua fitur Ekonomis ditambah fitur manajemen canggih. Untuk desa yang ingin tampil lebih maju, transparan, dan melayani warga secara digital.", "color": "#7c3aed", "bg": "linear-gradient(135deg,#f5f3ff,#ede9fe)", "tiers": [{"label": "Paket Promo", "note": "Free hosting & domain 1 tahun", "price": "Rp 5.500.000", "promo": "Promo"}, {"label": "Paket Reguler", "note": "Free hosting & domain 1 tahun", "price": "Rp 5.750.000", "promo": null}, {"label": "Perpanjangan Hosting", "note": "per tahun", "price": "Rp 500.000", "promo": "Hemat 15%"}, {"label": "Perpanjangan Domain", "note": "per tahun", "price": "Rp 250.000", "promo": null}], "features": ["Semua fitur Ekonomis", "Pengaduan warga online", "Kelola program bantuan", "Manajemen data penduduk", "Pilihan tema eksklusif", "Prioritas dukungan teknis"]}}

const product = computed(() => {
  const slug = route.query.product as string
  return slug ? productsData[slug] || null : null
})

async function submit() {
  error.value = ''; success.value = ''
  if (!email.value || !password.value) { error.value = 'Email dan password wajib diisi'; return }
  loading.value = true
  try {
    if (mode.value === 'login') {
      await login(email.value, password.value)
      const redirect = route.query.redirect as string || '/dashboard'
      await navigateTo(redirect)
    } else {
      if (!name.value) { error.value = 'Nama wajib diisi'; return }
      await register(email.value, password.value, name.value)
      success.value = 'Akun berhasil dibuat! Mengalihkan...'
      setTimeout(() => navigateTo('/dashboard'), 1500)
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Terjadi kesalahan, coba lagi'
  } finally {
    loading.value = false
  }
}
</script>
