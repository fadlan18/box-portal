<template>
  <div style="min-height:100vh;background:#f0f4fa;display:flex;align-items:center;justify-content:center;padding:16px">
    <div style="width:100%;max-width:420px">
      <div style="text-align:center;margin-bottom:32px">
        <a href="/" style="text-decoration:none">
          <div style="font-size:42px;font-weight:900;letter-spacing:-1px">
            <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
          </div>
        </a>
      </div>
      <div style="background:white;border-radius:20px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div v-if="sent" style="text-align:center;padding:16px 0">
          <div style="font-size:48px;margin-bottom:16px">📧</div>
          <h2 style="color:#1a202c;font-weight:800;margin:0 0 8px">Cek Email Anda</h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px">Link reset password telah dikirim ke <strong>{{ email }}</strong></p>
          <a href="/auth/login" style="display:inline-block;padding:12px 28px;background:#1a4fa0;color:white;border-radius:10px;text-decoration:none;font-weight:700">
            Kembali ke Login
          </a>
        </div>
        <div v-else>
          <h2 style="color:#1a202c;font-weight:800;font-size:18px;margin:0 0 6px">Lupa Password?</h2>
          <p style="color:#64748b;font-size:13px;margin:0 0 24px">Masukkan email terdaftar untuk menerima link reset.</p>
          <div style="margin-bottom:16px">
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Email</label>
            <input v-model="email" type="email" placeholder="nama@email.com"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;color:#1a202c"
              @focus="$event.target.style.borderColor='#1a4fa0'"
              @blur="$event.target.style.borderColor='#e2e8f0'"
              @keyup.enter="submit"/>
          </div>
          <p v-if="error" style="color:#dc2626;font-size:13px;margin:0 0 12px">⚠️ {{ error }}</p>
          <button @click="submit" :disabled="loading"
            style="width:100%;padding:14px;background:#1a4fa0;color:white;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;margin-bottom:16px"
            :style="loading ? 'opacity:0.6' : ''">
            {{ loading ? 'Mengirim...' : 'Kirim Link Reset →' }}
          </button>
          <div style="text-align:center">
            <a href="/auth/login" style="color:#64748b;font-size:13px;text-decoration:none">← Kembali ke Login</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: [] })
useHead({ title: 'Lupa Password — miTRANZ' })
const email = ref(''); const loading = ref(false); const error = ref(''); const sent = ref(false)
async function submit() {
  error.value = ''
  if (!email.value) { error.value = 'Email wajib diisi'; return }
  loading.value = true
  try {
    await $fetch('/api/auth/forgot-password', { method: 'POST', body: { email: email.value } })
    sent.value = true
  } catch (e: any) {
    error.value = e?.data?.message || 'Terjadi kesalahan'
  } finally { loading.value = false }
}
</script>
