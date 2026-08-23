<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-adaptive mb-1">Profile Saya</h1>
      <p class="text-sm text-adaptive-muted">Kelola informasi akun Anda</p>
    </div>

    <!-- Info akun -->
    <div class="glass rounded-2xl p-6 space-y-4">
      <h2 class="font-bold text-adaptive border-b pb-3" style="border-color:var(--dash-divider)">
        Informasi Akun
      </h2>

      <!-- Avatar -->
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
          style="background:linear-gradient(135deg,#1a4fa0,#c0192c);color:#ffffff !important">
          {{ user?.name?.[0]?.toUpperCase() }}
        </div>
        <div>
          <div class="font-bold text-adaptive text-lg">{{ user?.name }}</div>
          <div class="text-adaptive-muted text-sm">{{ user?.email }}</div>
          <span class="text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block"
            style="background:rgba(59,130,246,0.15);color:#2563eb">
            {{ user?.role === 'admin' ? '👑 Admin' : '👤 Member' }}
          </span>
        </div>
      </div>

      <!-- Form update nama -->
      <div class="grid gap-4 pt-2">
        <div>
          <label class="text-xs font-semibold text-adaptive-muted block mb-2">Nama Lengkap</label>
          <input v-model="form.name" type="text" :placeholder="user?.name"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none input-theme" />
        </div>
        <div>
          <label class="text-xs font-semibold text-adaptive-muted block mb-2">Email</label>
          <input :value="user?.email" type="email" disabled
            class="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-muted);cursor:not-allowed" />
          <p class="text-xs text-adaptive-muted mt-1">Email tidak dapat diubah</p>
        </div>

        <p v-if="updateSuccess" class="text-green-600 text-sm">✅ {{ updateSuccess }}</p>
        <p v-if="updateError" class="text-red-500 text-sm">⚠️ {{ updateError }}</p>

        <button @click="updateProfile" :disabled="updating"
          class="px-6 py-3 rounded-xl font-bold text-white text-sm w-fit transition-all btn-primary"
          :style="updating ? 'opacity:0.6' : ''">
          {{ updating ? 'Menyimpan...' : '💾 Simpan Perubahan' }}
        </button>
      </div>
    </div>

    <!-- Ganti password -->
    <div class="glass rounded-2xl p-6 space-y-4">
      <h2 class="font-bold text-adaptive border-b pb-3" style="border-color:var(--dash-divider)">
        Ganti Password
      </h2>
      <div class="grid gap-4">
        <div>
          <label class="text-xs font-semibold text-adaptive-muted block mb-2">Password Lama</label>
          <input v-model="pwForm.old_password" type="password" placeholder="••••••••"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none input-theme" />
        </div>
        <div>
          <label class="text-xs font-semibold text-adaptive-muted block mb-2">Password Baru</label>
          <input v-model="pwForm.new_password" type="password" placeholder="Min 8 karakter"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none input-theme" />
        </div>
        <div>
          <label class="text-xs font-semibold text-adaptive-muted block mb-2">Konfirmasi Password Baru</label>
          <input v-model="pwForm.confirm_password" type="password" placeholder="Ulangi password baru"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none input-theme" />
        </div>

        <p v-if="pwSuccess" class="text-green-600 text-sm">✅ {{ pwSuccess }}</p>
        <p v-if="pwError" class="text-red-500 text-sm">⚠️ {{ pwError }}</p>

        <button @click="changePassword" :disabled="changingPw"
          class="px-6 py-3 rounded-xl font-bold text-white text-sm w-fit transition-all"
          style="background:#c0192c"
          :style="changingPw ? 'opacity:0.6' : ''">
          {{ changingPw ? 'Memproses...' : '🔑 Ganti Password' }}
        </button>
      </div>
    </div>

    <!-- Statistik -->
    <div class="glass rounded-2xl p-6">
      <h2 class="font-bold text-adaptive border-b pb-3 mb-4" style="border-color:var(--dash-divider)">
        Statistik Akun
      </h2>
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="stat-card">
          <div class="stat-value">{{ stats.invoices }}</div>
          <div class="stat-label">Total Invoice</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.services }}</div>
          <div class="stat-label">Layanan Aktif</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.ppob }}</div>
          <div class="stat-label">Transaksi PPOB</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, fetchUser } = useCustomAuth()

const form = reactive({ name: '' })
const pwForm = reactive({ old_password: '', new_password: '', confirm_password: '' })
const updating = ref(false)
const changingPw = ref(false)
const updateSuccess = ref('')
const updateError = ref('')
const pwSuccess = ref('')
const pwError = ref('')
const stats = reactive({ invoices: 0, services: 0, ppob: 0 })

onMounted(async () => {
  form.name = user.value?.name || ''
  try {
    const invData: any = await $fetch('/api/billing/invoices', {
      query: { user_id: user.value?.id }, credentials: 'include'
    })
    stats.invoices = invData.invoices?.length || 0

    const svcData: any = await $fetch('/api/billing/services', {
      query: { user_id: user.value?.id }, credentials: 'include'
    })
    stats.services = svcData.services?.filter((s: any) => s.status === 'active').length || 0
  } catch (e) {}
})

async function updateProfile() {
  if (!form.name.trim()) { updateError.value = 'Nama tidak boleh kosong'; return }
  updating.value = true
  updateError.value = ''
  updateSuccess.value = ''
  try {
    await $fetch('/api/auth/update-profile', {
      method: 'POST', body: { name: form.name }, credentials: 'include',
    })
    updateSuccess.value = 'Profil berhasil diperbarui'
    await fetchUser()
    setTimeout(() => updateSuccess.value = '', 3000)
  } catch (e: any) {
    updateError.value = e?.data?.message || 'Gagal memperbarui profil'
  } finally { updating.value = false }
}

async function changePassword() {
  pwError.value = ''
  pwSuccess.value = ''
  if (!pwForm.old_password || !pwForm.new_password) {
    pwError.value = 'Semua field wajib diisi'; return
  }
  if (pwForm.new_password !== pwForm.confirm_password) {
    pwError.value = 'Konfirmasi password tidak cocok'; return
  }
  if (pwForm.new_password.length < 8) {
    pwError.value = 'Password minimal 8 karakter'; return
  }
  changingPw.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: { old_password: pwForm.old_password, new_password: pwForm.new_password },
      credentials: 'include',
    })
    pwSuccess.value = 'Password berhasil diubah'
    Object.assign(pwForm, { old_password: '', new_password: '', confirm_password: '' })
    setTimeout(() => pwSuccess.value = '', 3000)
  } catch (e: any) {
    pwError.value = e?.data?.message || 'Gagal mengubah password'
  } finally { changingPw.value = false }
}
</script>
