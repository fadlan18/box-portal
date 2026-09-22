<template>
  <div style="height:100vh;display:flex;overflow:hidden;font-family:Inter,sans-serif">

    <!-- KIRI 55%: Visual — hanya desktop -->
    <div class="auth-left" style="width:55%;height:100vh;background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1a4fa0 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:48px;position:relative;overflow:hidden">

      <!-- Dekorasi background: dot grid + ambient glow -->
      <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">
        <!-- Dot grid -->
        <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px);background-size:28px 28px"></div>
        <!-- Ambient glow -->
        <div style="position:absolute;top:-120px;right:-80px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(251,191,36,0.08),transparent 65%)"></div>
        <div style="position:absolute;bottom:-100px;left:-60px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,0.07),transparent 65%)"></div>
      </div>

      <div style="max-width:440px;width:100%;position:relative;z-index:1">

        <!-- Logo -->
        <a href="/" style="text-decoration:none;display:inline-block;margin-bottom:32px">
          <div style="font-size:26px;font-weight:900">
            <span style="color:white">mi</span><span style="color:#fbbf24">TRANZ</span>
          </div>
          <div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:2px">Platform Aplikasi Digital Terpercaya</div>
        </a>

        <!-- 4 Card Alur — glassmorphism, aksen tunggal -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px">
          <div v-for="(step, i) in steps" :key="i"
            style="border-radius:16px;padding:18px 16px;display:flex;flex-direction:column;gap:10px;position:relative;overflow:hidden;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(8px);transition:all 0.2s"
            @mouseover="$event.currentTarget.style.background='rgba(255,255,255,0.07)';$event.currentTarget.style.borderColor='rgba(251,191,36,0.25)'"
            @mouseout="$event.currentTarget.style.background='rgba(255,255,255,0.04)';$event.currentTarget.style.borderColor='rgba(255,255,255,0.08)'">
            <!-- Nomor watermark -->
            <div style="position:absolute;right:10px;top:6px;font-size:42px;font-weight:900;color:white;opacity:0.04;line-height:1;font-family:Inter,sans-serif">{{ i+1 }}</div>
            <!-- Ikon dalam lingkaran aksen -->
            <div style="width:36px;height:36px;border-radius:10px;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.2);display:flex;align-items:center;justify-content:center;font-size:18px">
              {{ step.icon }}
            </div>
            <!-- Teks -->
            <div>
              <div style="font-size:12px;font-weight:800;color:rgba(255,255,255,0.92);margin-bottom:4px;letter-spacing:0.1px">{{ step.title }}</div>
              <div style="font-size:11px;line-height:1.55;color:rgba(255,255,255,0.4)">{{ step.desc }}</div>
            </div>
          </div>
        </div>

        <!-- 3 benefit pills -->
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <div v-for="b in benefits" :key="b"
            style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:500;color:rgba(255,255,255,0.5)">
            <span style="width:14px;height:14px;border-radius:50%;background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.3);display:flex;align-items:center;justify-content:center;font-size:8px;color:#fbbf24;font-weight:900;flex-shrink:0">✓</span>
            {{ b }}
          </div>
        </div>

      </div>
    </div>

    <!-- KANAN 45%: Form -->
    <div style="width:45%;height:100vh;background:white;display:flex;align-items:center;justify-content:center;padding:40px;overflow-y:auto">
      <div style="width:100%;max-width:360px">

        <!-- Mobile logo -->
        <div class="mobile-logo" style="display:none;text-align:center;margin-bottom:24px">
          <div style="font-size:28px;font-weight:900">
            <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
          </div>
        </div>

        <!-- Mobile benefits -->
        <div class="mobile-benefits" style="display:none;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:20px">
          <span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;background:#f0fdf4;color:#15803d">✓ Siap 3-7 hari</span>
          <span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;background:#eff6ff;color:#1d4ed8">✓ Transparan</span>
          <span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;background:#f5f3ff;color:#6d28d9">✓ QRIS & Transfer</span>
        </div>

        <!-- Heading -->
        <div style="margin-bottom:28px">
          <div style="font-size:24px;font-weight:900;color:#111827;margin-bottom:6px">
            {{ mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru' }}
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
        <div v-if="mode === 'login'" style="display:flex;flex-direction:column;gap:14px">
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
            style="width:100%;padding:13px;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 4px 16px rgba(26,79,160,0.3)"
            :style="loading ? 'opacity:0.6;cursor:not-allowed' : ''">
            {{ loading ? 'Memproses...' : 'Masuk →' }}
          </button>
        </div>

        <!-- Form Register -->
        <div v-else style="display:flex;flex-direction:column;gap:14px">
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
            style="width:100%;padding:13px;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 4px 16px rgba(26,79,160,0.3)"
            :style="loading ? 'opacity:0.6;cursor:not-allowed' : ''">
            {{ loading ? 'Memproses...' : 'Daftar Sekarang →' }}
          </button>
        </div>

        <div style="text-align:center;margin-top:20px">
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
  'Aplikasi siap 3-7 hari kerja',
  'Harga transparan',
  'QRIS & Transfer Bank',
]

const steps = [
  { icon: '📦', title: 'Pilih Paket', desc: 'Pilih paket sesuai kebutuhan dan anggaran Anda' },
  { icon: '📋', title: 'Buat Order', desc: 'Tentukan spesifikasi dan konfirmasi pesanan' },
  { icon: '💳', title: 'Bayar', desc: 'Invoice otomatis — bayar via QRIS atau Transfer' },
  { icon: '🚀', title: 'Aplikasi Aktif', desc: 'Siap dalam 3-7 hari kerja' },
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
  div[style*="width:45%"] {
    width: 100% !important;
    height: 100vh !important;
  }
}
</style>
