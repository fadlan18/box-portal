<template>
  <div style="min-height:100vh;display:flex;font-family:Inter,sans-serif">

    <!-- KIRI 60%: Value proposition + Alur — hanya desktop -->
    <div class="auth-left" style="width:60%;min-height:100vh;background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#1a4fa0 100%);display:flex;flex-direction:column;justify-content:center;padding:56px 64px;position:relative;overflow:hidden">

      <!-- Background decoration -->
      <div style="position:absolute;inset:0;opacity:0.06;background:radial-gradient(circle at 20% 50%,#60a5fa 0%,transparent 50%),radial-gradient(circle at 80% 20%,#a78bfa 0%,transparent 50%);pointer-events:none"></div>

      <!-- Logo -->
      <div style="margin-bottom:48px;position:relative">
        <a href="/" style="text-decoration:none">
          <div style="font-size:28px;font-weight:900;margin-bottom:8px">
            <span style="color:white">mi</span><span style="color:#fbbf24">TRANZ</span>
          </div>
        </a>
        <div style="font-size:15px;color:rgba(255,255,255,0.65);line-height:1.6;max-width:400px">
          Platform Aplikasi Digital untuk UMKM dan Pemerintah Desa — profesional, terjangkau, dan terpercaya.
        </div>
      </div>

      <!-- 3 Benefit -->
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:48px;position:relative">
        <div v-for="b in benefits" :key="b" style="display:flex;align-items:center;gap:10px">
          <div style="width:20px;height:20px;border-radius:50%;background:rgba(16,185,129,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="color:#10b981;font-size:11px;font-weight:900">✓</span>
          </div>
          <span style="font-size:13px;color:rgba(255,255,255,0.8);font-weight:500">{{ b }}</span>
        </div>
      </div>

      <!-- Divider -->
      <div style="height:1px;background:rgba(255,255,255,0.1);margin-bottom:40px;position:relative"></div>

      <!-- Alur 4 Fase -->
      <div style="position:relative">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:2px;margin-bottom:28px">ALUR PEMESANAN</div>

        <div style="display:flex;flex-direction:column;gap:0;position:relative">
          <!-- Garis vertikal -->
          <div style="position:absolute;left:19px;top:20px;bottom:20px;width:1.5px;background:rgba(255,255,255,0.12)"></div>

          <div v-for="(step, i) in steps" :key="i" style="display:flex;align-items:flex-start;gap:16px;padding-bottom:24px;position:relative">
            <!-- Ikon lingkaran -->
            <div style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1"
              :style="step.active
                ? 'background:#fbbf24;box-shadow:0 0 0 4px rgba(251,191,36,0.2)'
                : 'background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15)'">
              <span :style="step.active ? 'font-size:18px' : 'font-size:16px'">{{ step.icon }}</span>
            </div>
            <!-- Teks -->
            <div style="padding-top:8px">
              <div style="font-size:14px;font-weight:700;margin-bottom:3px"
                :style="step.active ? 'color:#fbbf24' : 'color:rgba(255,255,255,0.9)'">
                {{ step.title }}
              </div>
              <div style="font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6">{{ step.desc }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- KANAN 40%: Form Login/Register -->
    <div style="width:40%;min-height:100vh;background:white;display:flex;align-items:center;justify-content:center;padding:40px 40px;box-shadow:-4px 0 32px rgba(0,0,0,0.1)">
      <div style="width:100%;max-width:360px">

        <!-- Mobile only: Logo -->
        <div class="mobile-logo" style="display:none;text-align:center;margin-bottom:28px">
          <a href="/" style="text-decoration:none">
            <div style="font-size:28px;font-weight:900">
              <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
            </div>
          </a>
        </div>

        <!-- Mobile only: benefit pills -->
        <div class="mobile-benefits" style="display:none;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px">
          <span style="font-size:11px;font-weight:600;padding:4px 10px;border-radius:100px;background:#f0fdf4;color:#15803d">✓ Siap 3-7 hari</span>
          <span style="font-size:11px;font-weight:600;padding:4px 10px;border-radius:100px;background:#eff6ff;color:#1d4ed8">✓ Harga transparan</span>
          <span style="font-size:11px;font-weight:600;padding:4px 10px;border-radius:100px;background:#f5f3ff;color:#6d28d9">✓ QRIS & Transfer</span>
        </div>

        <!-- Heading -->
        <div style="margin-bottom:28px">
          <div style="font-size:22px;font-weight:900;color:#111827;margin-bottom:6px">
            {{ mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru' }}
          </div>
          <div style="font-size:13px;color:#6b7280">
            {{ mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?' }}
            <button @click="mode = mode === 'login' ? 'register' : 'login'"
              style="background:none;border:none;color:#1a4fa0;font-weight:700;cursor:pointer;font-size:13px;padding:0;margin-left:4px">
              {{ mode === 'login' ? 'Daftar sekarang' : 'Masuk di sini' }}
            </button>
          </div>
        </div>

        <!-- Form Login -->
        <div v-if="mode === 'login'" style="display:flex;flex-direction:column;gap:16px">
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Email</label>
            <input v-model="email" type="email" placeholder="nama@email.com"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;transition:border 0.2s"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Password</label>
            <input v-model="password" type="password" placeholder="••••••••"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;transition:border 0.2s"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"
              @keyup.enter="submit"/>
          </div>
          <p v-if="error" style="color:#dc2626;font-size:13px;margin:0">⚠️ {{ error }}</p>
          <button @click="submit" :disabled="loading"
            style="width:100%;padding:14px;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 4px 16px rgba(26,79,160,0.3)"
            :style="loading ? 'opacity:0.6;cursor:not-allowed' : ''">
            {{ loading ? 'Memproses...' : 'Masuk →' }}
          </button>
        </div>

        <!-- Form Register -->
        <div v-else style="display:flex;flex-direction:column;gap:16px">
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Nama Lengkap</label>
            <input v-model="name" type="text" placeholder="Nama Anda"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Email</label>
            <input v-model="email" type="email" placeholder="nama@email.com"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Password</label>
            <input v-model="password" type="password" placeholder="Minimal 8 karakter"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"
              @keyup.enter="submit"/>
          </div>
          <p v-if="error" style="color:#dc2626;font-size:13px;margin:0">⚠️ {{ error }}</p>
          <p v-if="success" style="color:#16a34a;font-size:13px;margin:0">✅ {{ success }}</p>
          <button @click="submit" :disabled="loading"
            style="width:100%;padding:14px;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 4px 16px rgba(26,79,160,0.3)"
            :style="loading ? 'opacity:0.6;cursor:not-allowed' : ''">
            {{ loading ? 'Memproses...' : 'Daftar Sekarang →' }}
          </button>
        </div>

        <div style="text-align:center;margin-top:24px">
          <a href="/" style="color:#9ca3af;font-size:12px;text-decoration:none">← Kembali ke miTRANZ.com</a>
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

const benefits = [
  'Aplikasi digital siap dalam 3-7 hari kerja',
  'Harga transparan, tanpa biaya tersembunyi',
  'Pembayaran QRIS & Transfer Bank',
]

const steps = [
  {
    icon: '📦',
    title: 'Pilih Paket',
    desc: 'Pilih paket sesuai kebutuhan dan anggaran Anda',
    active: false,
  },
  {
    icon: '📋',
    title: 'Buat Order',
    desc: 'Tentukan spesifikasi dan konfirmasi pesanan',
    active: true,
  },
  {
    icon: '💳',
    title: 'Bayar',
    desc: 'Invoice otomatis dikirim — bayar via QRIS atau Transfer',
    active: false,
  },
  {
    icon: '🚀',
    title: 'Aplikasi Aktif',
    desc: 'Tim kami kerjakan, aplikasi siap dalam 3-7 hari kerja',
    active: false,
  },
]

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

<style>
@media (max-width: 768px) {
  .auth-left { display: none !important; }
  .mobile-logo { display: block !important; }
  .mobile-benefits { display: flex !important; }

  /* Form full width di mobile */
  div[style*="width:40%"] {
    width: 100% !important;
    box-shadow: none !important;
  }
}
</style>
