<template>
  <div class="space-y-8">
    <div>
      <h1 class="font-display text-2xl font-bold text-adaptive mb-1">Layanan Saya</h1>
      <p class="text-sm text-gray-400">Kelola layanan aktif dan pesan layanan baru</p>
    </div>

    <!-- Layanan Aktif -->
    <div>
      <h2 class="font-bold text-adaptive text-lg mb-3">⚡ Layanan Aktif</h2>
      <div v-if="loading" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">Memuat layanan...</div>
      <div v-else-if="!services.length" class="glass p-6 rounded-2xl text-center">
        <div class="text-3xl mb-2">📭</div>
        <div class="text-adaptive font-semibold mb-1">Belum ada layanan aktif</div>
        <p class="text-gray-400 text-sm">Pesan layanan di bawah untuk memulai</p>
      </div>
      <div v-else class="grid gap-4">
        <div v-for="svc in services" :key="svc.id" class="glass rounded-2xl p-5 transition-all">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-bold text-adaptive text-lg">{{ svc.name }}</h3>
              <div v-if="svc.metadata && svc.metadata.domain" class="text-xs text-gray-400 mt-0.5">🌐 {{ svc.metadata.domain }}</div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold" :style="statusStyle(svc.status)">{{ statusLabel(svc.status) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs mt-3">
            <div>
              <div class="text-gray-500 mb-1">Mulai Aktif</div>
              <div class="text-gray-300">{{ fmtDate(svc.starts_at) }}</div>
            </div>
            <div>
              <div class="text-gray-500 mb-1">Expired</div>
              <div :class="isExpiringSoon(svc.expires_at) ? 'text-yellow-400 font-semibold' : 'text-gray-300'">
                {{ svc.expires_at ? fmtDate(svc.expires_at) : 'Selamanya' }}
                <span v-if="isExpiringSoon(svc.expires_at)" class="ml-1">⚠️</span>
              </div>
            </div>
          </div>
          <div v-if="svc.invoice" class="mt-3 pt-3 flex items-center justify-between" style="border-top:1px solid rgba(255,255,255,0.06)">
            <span class="text-xs text-gray-500">Invoice: {{ svc.invoice.invoice_number }}</span>
            <a :href="`https://paymen.mitranz.com/invoices/${svc.invoice.id}`" target="_blank" class="text-xs font-semibold" style="color:#60a5fa">Lihat Invoice →</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Katalog -->
    <div>
      <h2 class="font-bold text-adaptive text-lg mb-1">🛍️ Katalog Layanan</h2>
      <p class="text-sm text-gray-400 mb-4">Pilih layanan yang Anda butuhkan</p>

      <div v-if="ppobProducts.length">
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">PPOB & Pembayaran Digital</h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <NuxtLink v-for="p in ppobProducts" :key="p.id" to="/ppob"
            class="glass rounded-2xl p-4 text-center hover:bg-white/5 transition-all glass-hover">
            <div class="text-3xl mb-2">{{ ppobIcon(p.name) }}</div>
            <div class="font-semibold text-adaptive text-sm">{{ p.name }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ p.short_desc }}</div>
          </NuxtLink>
        </div>
      </div>

      <div v-if="websiteProducts.length">
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Website & Layanan Digital</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div v-for="p in websiteProducts" :key="p.id"
            class="glass rounded-2xl p-5 glass-hover transition-all cursor-pointer"
            @click="goOrder(p)">
            <div class="flex items-start justify-between mb-3">
              <div class="text-3xl">🌐</div>
              <span class="text-xs font-semibold px-2 py-1 rounded-full" style="background:rgba(59,130,246,0.15);color:#60a5fa">Website</span>
            </div>
            <h3 class="font-bold text-adaptive text-base mb-1">{{ p.name }}</h3>
            <p class="text-gray-400 text-sm mb-3">{{ p.short_desc }}</p>
            <div v-if="p.specs && p.specs.pricing" class="space-y-1.5 mb-4">
              <div v-for="pr in p.specs.pricing" :key="pr.id"
                class="flex items-center justify-between text-xs rounded-lg px-3 py-1.5"
                style="background:rgba(255,255,255,0.04)">
                <span class="text-gray-400">{{ pr.label }}</span>
                <div class="flex items-center gap-1.5">
                  <span v-if="pr.promo_label" class="px-1.5 py-0.5 rounded text-xs font-bold" style="background:rgba(234,179,8,0.2);color:#eab308">{{ pr.promo_label }}</span>
                  <span class="font-bold text-adaptive">{{ fmtCurrency(pr.amount) }}</span>
                </div>
              </div>
            </div>
            <button class="w-full py-2.5 rounded-xl text-sm font-bold" style="background:#1a4fa0;color:#ffffff">Pesan Sekarang</button>
          </div>
        </div>
      </div>

      <div v-if="!ppobProducts.length && !websiteProducts.length && !loadingProducts" class="glass p-6 rounded-2xl text-center text-gray-400 text-sm">
        Katalog layanan belum tersedia
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user } = useCustomAuth()
const services = ref([])
const products = ref([])
const loading = ref(true)
const loadingProducts = ref(true)

const ppobProducts = computed(() => products.value.filter((p) => p.category === 'ppob'))
const websiteProducts = computed(() => products.value.filter((p) => p.category === 'website'))

onMounted(async () => {
  if (user.value && user.value.id) {
    try {
      const data = await $fetch('/api/billing/services', { query: { user_id: user.value.id } })
      services.value = data.services || []
    } catch (e) {
      console.error('Error loading services:', e)
    }
  }
  loading.value = false

  try {
    const res = await $fetch('/api/products')
    products.value = res.products || []
  } catch (e) {
    console.error('Error loading products:', e)
  }
  loadingProducts.value = false
})

function goOrder(product) {
  navigateTo('/services/order?product=' + product.id)
}

function ppobIcon(name) {
  if (name.includes('Listrik') || name.includes('PLN')) return '⚡'
  if (name.includes('Pulsa') || name.includes('Data')) return '📱'
  if (name.includes('E-Wallet') || name.includes('GoPay')) return '💳'
  if (name.includes('TV') || name.includes('Kabel')) return '📺'
  return '🏷️'
}

function fmtCurrency(n) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function isExpiringSoon(date) {
  if (!date) return false
  const diff = new Date(date).getTime() - Date.now()
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
}

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
}

function statusLabel(s) {
  return { active: 'Aktif', pending: 'Pending', suspended: 'Suspended', expired: 'Expired', cancelled: 'Dibatalkan' }[s] || s
}

function statusStyle(s) {
  const styles = {
    active: 'background:rgba(34,197,94,0.15);color:#4ade80',
    pending: 'background:rgba(251,191,36,0.15);color:#fbbf24',
    suspended: 'background:rgba(239,68,68,0.15);color:#f87171',
    expired: 'background:rgba(255,255,255,0.08);color:#94a3b8',
    cancelled: 'background:rgba(239,68,68,0.15);color:#f87171',
  }
  return styles[s] || 'background:rgba(255,255,255,0.08);color:#94a3b8'
}
</script>
