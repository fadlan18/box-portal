<template>
  <div class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-wider" style="color:#1a4fa0">Selamat Datang Kembali</p>
      <h1 class="text-2xl font-bold" style="color:var(--dash-text-primary)">Dashboard</h1>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="glass p-4 rounded-2xl">
        <div class="text-xs font-semibold uppercase tracking-wider mb-1" style="color:var(--dash-text-muted)">{{ s.label }}</div>
        <div class="text-2xl font-bold" :style="'color:' + s.color">{{ s.value }}</div>
      </div>
    </div>

    <!-- Layanan Saya -->
    <div class="glass rounded-2xl p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold" style="color:var(--dash-text-primary)">Layanan Saya</h2>
        <NuxtLink to="/services" class="text-xs font-semibold" style="color:#1a4fa0">Lihat semua →</NuxtLink>
      </div>
      <div v-if="services.length === 0" class="text-sm text-center py-6" style="color:var(--dash-text-muted)">
        Belum ada layanan aktif
      </div>
      <div v-else class="space-y-3">
        <div v-for="s in services.slice(0,3)" :key="s.id" class="flex items-center justify-between py-2"
          style="border-bottom:1px solid var(--dash-divider)">
          <div>
            <div class="text-sm font-semibold" style="color:var(--dash-text-primary)">{{ s.product_name }}</div>
            <div class="text-xs" style="color:var(--dash-text-muted)">{{ s.domain || '—' }}</div>
          </div>
          <span class="text-xs px-2 py-1 rounded-full font-semibold"
            style="background:rgba(34,197,94,0.1);color:#4ade80;border:1px solid rgba(34,197,94,0.2)">Aktif</span>
        </div>
      </div>
    </div>

    <!-- Katalog Layanan -->
    <div class="glass rounded-2xl p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold" style="color:var(--dash-text-primary)">Katalog Layanan</h2>
        <NuxtLink to="/orders" class="text-xs font-semibold" style="color:#1a4fa0">Lihat semua →</NuxtLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div v-for="p in featuredProducts" :key="p.id"
          class="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
          style="background:var(--dash-input-bg);border:1px solid var(--dash-card-border)"
          @click="navigateTo('/orders')">
          <div class="text-lg mb-2">{{ catIcon(p.category) }}</div>
          <div class="text-sm font-semibold" style="color:var(--dash-text-primary)">{{ p.name }}</div>
          <div class="text-xs mt-1" style="color:var(--dash-text-muted)">{{ p.category.toUpperCase() }}</div>
          <div v-if="getMinPrice(p)" class="text-xs font-bold mt-2" style="color:#10b981">
            {{ getMinPrice(p) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const { user } = useCustomAuth()
const { products, fetchProducts } = useProducts()
const { rp, getPricingOptions } = useOrders()

const services = ref<any[]>([])

const stats = computed(() => [
  { label: 'Layanan Aktif', value: services.value.length, color: 'var(--dash-text-primary)' },
  { label: 'Invoice Tertunda', value: '0', color: '#f59e0b' },
  { label: 'Tiket Terbuka', value: '0', color: 'var(--dash-text-primary)' },
  { label: 'Status', value: 'Online', color: '#4ade80' },
])

const featuredProducts = computed(() => products.value.slice(0, 3))

const catIcon = (c: string) => ({ website:'🖥️', ppob:'⚡', hiburan:'🎮', hosting:'☁️' }[c] || '📦')

function getMinPrice(p: any) {
  const opts = getPricingOptions(p)
  if (opts.length === 0) return null
  return rp(Math.min(...opts.map(o => o.amount)))
}

onMounted(async () => {
  await fetchProducts()
})
</script>
