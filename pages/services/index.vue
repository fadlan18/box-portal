<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-adaptive mb-1">Layanan Saya</h1>
        <p class="text-sm text-gray-400">Kelola layanan aktif Anda</p>
      </div>
      <NuxtLink to="/orders"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
        style="background:#1a4fa0;color:white;text-decoration:none">
        + Pesan Baru
      </NuxtLink>
    </div>

    <!-- Layanan Aktif -->
    <div v-if="loading" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">
      Memuat layanan...
    </div>

    <div v-else-if="!services.length" class="glass rounded-2xl p-10 text-center">
      <div class="text-4xl mb-3">📭</div>
      <div class="font-bold text-adaptive text-lg mb-2">Belum ada layanan aktif</div>
      <p class="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
        Mulai dengan memesan paket website profesional untuk bisnis atau desa Anda.
      </p>
      <NuxtLink to="/orders"
        class="inline-block px-6 py-2.5 rounded-xl text-sm font-bold"
        style="background:#1a4fa0;color:white;text-decoration:none">
        Lihat Paket Website
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="svc in services" :key="svc.id" class="glass rounded-2xl p-5 transition-all">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="text-3xl">🌐</div>
            <div>
              <h3 class="font-bold text-adaptive text-base">{{ svc.name }}</h3>
              <div v-if="svc.metadata?.domain" class="text-xs text-gray-400 mt-0.5">
                🔗 {{ svc.metadata.domain }}
              </div>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold flex-shrink-0"
            :style="statusStyle(svc.status)">
            {{ statusLabel(svc.status) }}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mt-4"
          style="border-top:1px solid var(--dash-divider);padding-top:12px">
          <div>
            <div class="text-gray-500 mb-1">Mulai Aktif</div>
            <div class="font-semibold text-adaptive">{{ fmtDate(svc.starts_at) }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">Berakhir</div>
            <div class="font-semibold"
              :class="isExpiringSoon(svc.expires_at) ? 'text-yellow-400' : 'text-adaptive'">
              {{ svc.expires_at ? fmtDate(svc.expires_at) : 'Selamanya' }}
              <span v-if="isExpiringSoon(svc.expires_at)"> ⚠️</span>
            </div>
          </div>
          <div v-if="svc.invoice">
            <div class="text-gray-500 mb-1">Invoice</div>
            <a :href="'https://paymen.mitranz.com/invoices/' + svc.invoice.id"
              target="_blank"
              class="font-semibold text-xs"
              style="color:#1a4fa0;text-decoration:none">
              {{ svc.invoice.invoice_number }} →
            </a>
          </div>
        </div>
      </div>

      <!-- Tombol pesan tambahan -->
      <div class="glass rounded-2xl p-5 text-center"
        style="border:1px dashed var(--dash-card-border)">
        <p class="text-sm text-gray-400 mb-3">Butuh layanan website lainnya?</p>
        <NuxtLink to="/orders"
          class="inline-block px-5 py-2 rounded-xl text-sm font-bold"
          style="background:var(--dash-input-bg);color:#1a4fa0;border:1px solid #1a4fa0;text-decoration:none">
          + Pesan Layanan Baru
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user } = useCustomAuth()
const services = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!user.value?.id) { loading.value = false; return }
  try {
    const data = await $fetch<any>('/api/billing/services', { query: { user_id: user.value.id } })
    services.value = data.services || []
  } catch {
    services.value = []
  } finally {
    loading.value = false
  }
})

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric'
}) : '-'

const isExpiringSoon = (date: string) => {
  if (!date) return false
  const diff = new Date(date).getTime() - Date.now()
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
}

const statusLabel = (s: string) => ({
  active: 'Aktif', pending: 'Pending', suspended: 'Suspended',
  expired: 'Expired', cancelled: 'Dibatalkan'
}[s] || s)

const statusStyle = (s: string) => ({
  active: 'background:rgba(34,197,94,0.15);color:#4ade80',
  pending: 'background:rgba(251,191,36,0.15);color:#fbbf24',
  suspended: 'background:rgba(239,68,68,0.15);color:#f87171',
  expired: 'background:rgba(255,255,255,0.08);color:#94a3b8',
  cancelled: 'background:rgba(239,68,68,0.15);color:#f87171',
}[s] || 'background:rgba(255,255,255,0.08);color:#94a3b8')
</script>
