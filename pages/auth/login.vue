<template>
  <div style="height:100vh;display:flex;overflow:hidden;font-family:Inter,sans-serif">

    <!-- KIRI 58%: Brand panel — off-white, bersih, berkelas -->
    <div class="auth-left" style="width:58%;height:100vh;background:#f0f4fa;display:flex;flex-direction:column;justify-content:center;padding:56px 64px;position:relative;overflow:hidden;border-right:1px solid #e2e8f0">

      <!-- Dekorasi subtle -->
      <div style="position:absolute;top:0;right:0;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(26,79,160,0.06),transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;bottom:0;left:0;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(251,191,36,0.07),transparent 70%);pointer-events:none"></div>

      <div style="max-width:480px;position:relative;z-index:1">

        <!-- Logo -->
        <a href="/" style="text-decoration:none;display:inline-block;margin-bottom:40px">
          <div style="font-size:24px;font-weight:900;letter-spacing:-0.5px">
            <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
          </div>
        </a>

        <!-- Headline -->
        <div style="margin-bottom:40px">
          <h1 style="font-size:32px;font-weight:900;color:#111827;line-height:1.2;margin:0 0 12px;letter-spacing:-0.5px">
            Wujudkan aplikasi<br>digital Anda<br>
            <span style="color:#1a4fa0">bersama kami.</span>
          </h1>
          <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0">
            Dari konsultasi hingga aplikasi siap pakai — proses yang sederhana, transparan, dan terpercaya.
          </p>
        </div>

        <!-- 4 Steps card — putih bersih -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:32px">
          <div v-for="(step, i) in steps" :key="i"
            style="background:white;border-radius:14px;padding:16px;display:flex;align-items:flex-start;gap:12px;box-shadow:0 1px 4px rgba(0,0,0,0.06);border:1px solid #e5e7eb;transition:box-shadow 0.2s"
            @mouseover="$event.currentTarget.style.boxShadow='0 4px 16px rgba(26,79,160,0.1)';$event.currentTarget.style.borderColor='#bfdbfe'"
            @mouseout="$event.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.06)';$event.currentTarget.style.borderColor='#e5e7eb'">
            <!-- Nomor + ikon -->
            <div style="flex-shrink:0">
              <div style="width:36px;height:36px;border-radius:10px;background:#eff6ff;display:flex;align-items:center;justify-content:center;font-size:18px;position:relative">
                {{ step.icon }}
                <div style="position:absolute;top:-6px;right:-6px;width:16px;height:16px;border-radius:50%;background:#1a4fa0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:white">{{ i+1 }}</div>
              </div>
            </div>
            <!-- Teks -->
            <div>
              <div style="font-size:12px;font-weight:800;color:#111827;margin-bottom:2px">{{ step.title }}</div>
              <div style="font-size:11px;color:#9ca3af;line-height:1.5">{{ step.desc }}</div>
            </div>
          </div>
        </div>

        <!-- 3 benefits -->
        <div style="display:flex;gap:20px;flex-wrap:wrap">
          <div v-for="b in benefits" :key="b"
            style="display:flex;align-items:center;gap:6px;font-size:12px;color:#6b7280;font-weight:500">
            <div style="width:18px;height:18px;border-radius:50%;background:#dcfce7;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <span style="font-size:9px;font-weight:900;color:#16a34a">✓</span>
            </div>
            {{ b }}
          </div>
        </div>

      </div>
    </div>

    <!-- KANAN 42%: Form -->
    <div style="width:42%;height:100vh;background:white;display:flex;align-items:center;justify-content:center;padding:40px 48px;overflow-y:auto">
      <div style="width:100%;max-width:340px">

        <!-- Mobile only logo -->
        <div class="mobile-logo" style="display:none;text-align:center;margin-bottom:24px">
          <div style="font-size:28px;font-weight:900">
            <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
          </div>
        </div>

        <!-- Mobile benefits -->
        <div class="mobile-benefits" style="display:none;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:20px">
          <span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;background:#f0fdf4;color:#15803d">✓ Siap 3-7 hari</span>
          <span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;background:#eff6ff;color:#1d4ed8">✓ Transparan</span>
          <span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;background:#fefce8;color:#854d0e">✓ QRIS & Transfer</span>
        </div>

        <!-- Heading -->
        <div style="margin-bottom:28px">
          <div style="font-size:22px;font-weight:900;color:#111827;margin-bottom:6px">
            {{ mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru' }}
          </div>
          <div style="font-size:13px;color:#9ca3af">
            {{ mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?' }}
            <button @click="mode = mode === 'login' ? 'register' : 'login'"
              style="background:none;border:none;color:#1a4fa0;font-weight:700;cursor:pointer;font-size:13px;padding:0;margin-left:4px;text-decoration:underline;text-underline-offset:2px">
              {{ mode === 'login' ? 'Daftar sekarang' : 'Masuk di sini' }}
            </button>
          </div>
        </div>

        <!-- Form Login -->
        <div v-if="mode === 'login'" style="display:flex;flex-direction:column;gap:14px">
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Email</label>
            <input v-model="email" type="email" placeholder="nama@email.com"
              style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;transition:border 0.2s;background:#fafafa;color:#111827"
              @focus="$event.target.style.borderColor='#1a4fa0';$event.target.style.background='white'"
              @blur="$event.target.style.borderColor='#e5e7eb';$event.target.style.background='#fafafa'"/>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Password</label>
            <input v-model="password" type="password" placeholder="••••••••"
              style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;transition:border 0.2s;background:#fafafa;color:#111827"
              @focus="$event.target.style.borderColor='#1a4fa0';$event.target.style.background='white'"
              @blur="$event.target.style.borderColor='#e5e7eb';$event.target.style.background='#fafafa'"
              @keyup.enter="submit"/>
          </div>
          <p v-if="error" style="color:#dc2626;font-size:13px;margin:0">⚠️ {{ error }}</p>
          <button @click="submit" :disabled="loading"
            style="width:100%;padding:13px;background:#1a4fa0;color:white;border:none;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;transition:all 0.2s;letter-spacing:0.2px"
            :style="loading ? 'opacity:0.6;cursor:not-allowed' : ''"
            @mouseover="if(!loading)$event.target.style.background='#1e40af'"
            @mouseout="$event.target.style.background='#1a4fa0'">
            {{ loading ? 'Memproses...' : 'Masuk →' }}
          </button>
        </div>

        <!-- Form Register -->
        <div v-else style="display:flex;flex-direction:column;gap:14px">
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Nama Lengkap</label>
            <input v-model="name" type="text" placeholder="Nama Anda"
              style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;background:#fafafa;color:#111827"
              @focus="$event.target.style.borderColor='#1a4fa0';$event.target.style.background='white'"
              @blur="$event.target.style.borderColor='#e5e7eb';$event.target.style.background='#fafafa'"/>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Email</label>
            <input v-model="email" type="email" placeholder="nama@email.com"
              style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;background:#fafafa;color:#111827"
              @focus="$event.target.style.borderColor='#1a4fa0';$event.target.style.background='white'"
              @blur="$event.target.style.borderColor='#e5e7eb';$event.target.style.background='#fafafa'"/>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Password</label>
            <input v-model="password" type="password" placeholder="Minimal 8 karakter"
              style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;background:#fafafa;color:#111827"
              @focus="$event.target.style.borderColor='#1a4fa0';$event.target.style.background='white'"
              @blur="$event.target.style.borderColor='#e5e7eb';$event.target.style.background='#fafafa'"
              @keyup.enter="submit"/>
          </div>
          <p v-if="error" style="color:#dc2626;font-size:13px;margin:0">⚠️ {{ error }}</p>
          <p v-if="success" style="color:#16a34a;font-size:13px;margin:0">✅ {{ success }}</p>
          <button @click="submit" :disabled="loading"
            style="width:100%;padding:13px;background:#1a4fa0;color:white;border:none;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;transition:all 0.2s"
            :style="loading ? 'opacity:0.6;cursor:not-allowed' : ''"
            @mouseover="if(!loading)$event.target.style.background='#1e40af'"
            @mouseout="$event.target.style.background='#1a4fa0'">
            {{ loading ? 'Memproses...' : 'Daftar Sekarang →' }}
          </button>
        </div>

        <div style="text-align:center;margin-top:20px">
          <a href="/" style="color:#d1d5db;font-size:12px;text-decoration:none;transition:color 0.2s"
            @mouseover="$event.target.style.color='#6b7280'"
            @mouseout="$event.target.style.color='#d1d5db'">← Kembali ke miTRANZ.com</a>
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

const steps = [
  { icon: '📦', title: 'Pilih Paket', desc: 'Sesuai kebutuhan & anggaran Anda' },
  { icon: '📋', title: 'Buat Order', desc: 'Konfigurasi & konfirmasi pesanan' },
  { icon: '💳', title: 'Bayar', desc: 'QRIS atau Transfer Bank' },
  { icon: '🚀', title: 'Aplikasi Aktif', desc: 'Siap dalam 3-7 hari kerja' },
]

const benefits = [
  'Aplikasi siap 3-7 hari kerja',
  'Harga transparan',
  'QRIS & Transfer Bank',
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
  div[style*="width:42%"] {
    width: 100% !important;
    height: 100vh !important;
  }
}
</style>
