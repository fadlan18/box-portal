<template>
  <div style="min-height:100vh;background:#f0f4fa;display:flex;align-items:center;justify-content:center;padding:16px">
    <div style="width:100%;max-width:420px">
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:42px;font-weight:900;letter-spacing:-1px">
          <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
        </div>
      </div>
      <div style="background:white;border-radius:20px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div v-if="!token" style="text-align:center">
          <div style="font-size:48px;margin-bottom:16px">❌</div>
          <h2 style="color:#1a202c;font-weight:800;margin:0 0 8px">Link Tidak Valid</h2>
          <a href="/auth/forgot-password" style="display:inline-block;padding:12px 28px;background:#1a4fa0;color:white;border-radius:10px;text-decoration:none;font-weight:700;margin-top:16px">Minta Link Baru</a>
        </div>
        <div v-else-if="success" style="text-align:center">
          <div style="font-size:48px;margin-bottom:16px">✅</div>
          <h2 style="color:#1a202c;font-weight:800;margin:0 0 8px">Password Berhasil Diubah!</h2>
          <a href="/auth/login" style="display:inline-block;padding:12px 28px;background:#f97316;color:white;border-radius:10px;text-decoration:none;font-weight:700;margin-top:16px">Login Sekarang →</a>
        </div>
        <div v-else>
          <h2 style="color:#1a202c;font-weight:800;font-size:18px;margin:0 0 24px">Buat Password Baru</h2>
          <div style="margin-bottom:14px">
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Password Baru</label>
            <input v-model="password" type="password" placeholder="Minimal 8 karakter"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;color:#1a202c"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>
          </div>
          <div style="margin-bottom:16px">
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Konfirmasi Password</label>
            <input v-model="confirm" type="password" placeholder="Ulangi password baru"
              style="width:100%;box-sizing:border-box;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;color:#1a202c"
              @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"
              @keyup.enter="submit"/>
          </div>
          <p v-if="error" style="color:#dc2626;font-size:13px;margin:0 0 12px">⚠️ {{ error }}</p>
          <button @click="submit" :disabled="loading"
            style="width:100%;padding:14px;background:#f97316;color:white;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer"
            :style="loading ? 'opacity:0.6' : ''">
            {{ loading ? 'Menyimpan...' : 'Simpan Password Baru →' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: [] })
useHead({ title: 'Reset Password — miTRANZ' })
const route = useRoute()
const token = computed(() => route.query.token as string || '')
const password = ref(''); const confirm = ref(''); const loading = ref(false)
const error = ref(''); const success = ref(false)
async function submit() {
  error.value = ''
  if (password.value.length < 8) { error.value = 'Password minimal 8 karakter'; return }
  if (password.value !== confirm.value) { error.value = 'Konfirmasi password tidak cocok'; return }
  loading.value = true
  try {
    await $fetch('/api/auth/reset-password', { method: 'POST', body: { token: token.value, password: password.value } })
    success.value = true
  } catch (e: any) {
    error.value = e?.data?.message || 'Terjadi kesalahan'
  } finally { loading.value = false }
}
</script>
