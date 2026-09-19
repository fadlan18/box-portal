<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" style="color:#1a4fa0">PT Mitra Trans Digital</p>
        <h1 class="text-2xl font-bold" style="color:var(--dash-text-primary)">
          Selamat Datang, {{ user?.name?.split(' ')[0] || 'Pengguna' }} 👋
        </h1>
      </div>
      <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
        style="background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.2)">
        <span class="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
        Online
      </div>
    </div>

    <!-- Onboarding Banner — hanya muncul jika belum punya layanan -->
    <div v-if="!loadingServices && services.length === 0"
      class="rounded-2xl p-5"
      style="background:linear-gradient(135deg,#1a4fa0,#2563eb);border:none">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="font-bold text-base mb-1" style="color:white">🚀 Mulai Perjalanan Digital Anda</div>
          <p class="text-sm mb-4" style="color:rgba(255,255,255,0.8)">
            Dapatkan website profesional untuk bisnis atau desa Anda. Proses mudah, harga transparan.
          </p>
          <div class="flex items-center gap-2 flex-wrap">
            <div v-for="(s, i) in onboardingSteps" :key="i"
              class="flex items-center gap-1.5 text-xs font-semibold"
              style="color:rgba(255,255,255,0.9)">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style="background:rgba(255,255,255,0.2)">{{ i+1 }}</span>
              {{ s }}
              <span v-if="i < onboardingSteps.length-1" style="color:rgba(255,255,255,0.4)">→</span>
            </div>
          </div>
        </div>
        <NuxtLink to="/orders"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap"
          style="background:white;color:#1a4fa0;text-decoration:none">
          Mulai →
        </NuxtLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3">
      <div class="glass p-4 rounded-2xl">
        <div class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:var(--dash-text-muted)">Layanan Aktif</div>
        <div class="text-2xl font-bold" style="color:var(--dash-text-primary)">
          {{ loadingServices ? '...' : services.length }}
        </div>
      </div>
      <div class="glass p-4 rounded-2xl">
        <div class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:var(--dash-text-muted)">Invoice Tertunda</div>
        <div class="text-2xl font-bold" :style="unpaidCount > 0 ? 'color:#f59e0b' : 'color:var(--dash-text-primary)'">
          {{ loadingInvoices ? '...' : unpaidCount }}
        </div>
      </div>
      <div class="glass p-4 rounded-2xl">
        <div class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:var(--dash-text-muted)">Tiket Terbuka</div>
        <div class="text-2xl font-bold" :style="openTickets > 0 ? 'color:#f59e0b' : 'color:var(--dash-text-primary)'">
          {{ loadingTickets ? '...' : openTickets }}
        </div>
      </div>
    </div>

    <!-- Paket Jasa Website — Hero Section -->
    <div class="glass rounded-2xl p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="font-bold" style="color:var(--dash-text-primary)">Solusi Website Profesional</h2>
          <p class="text-xs mt-0.5" style="color:var(--dash-text-muted)">Pilih paket yang sesuai kebutuhan Anda</p>
        </div>
        <NuxtLink to="/orders" class="text-xs font-semibold" style="color:#1a4fa0;text-decoration:none">
          Lihat semua →
        </NuxtLink>
      </div>
      <div v-if="loadingProducts" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="rounded-xl h-40 animate-pulse"
          style="background:var(--dash-input-bg)"></div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="p in websiteProducts" :key="p.id"
          class="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] relative"
          :style="p.featured
            ? 'background:linear-gradient(135deg,rgba(26,79,160,0.08),rgba(37,99,235,0.05));border:1.5px solid #1a4fa0'
            : 'background:var(--dash-input-bg);border:1px solid var(--dash-card-border)'"
          @click="navigateTo('/orders')">
          <div v-if="p.featured" class="absolute -top-2.5 left-4">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full"
              style="background:#1a4fa0;color:white">⭐ POPULER</span>
          </div>
          <div class="text-2xl mb-2">{{ productIcon(p.name) }}</div>
          <div class="text-sm font-bold mb-1" style="color:var(--dash-text-primary)">{{ p.name }}</div>
          <div class="text-xs mb-3" style="color:var(--dash-text-muted)">{{ p.short_desc }}</div>
          <div class="text-xs font-bold" style="color:#1a4fa0">
            {{ getMinPrice(p) ? 'Mulai ' + getMinPrice(p) : 'Hubungi Kami' }}
          </div>
        </div>
        <div v-if="websiteProducts.length === 0"
          class="col-span-3 text-center py-8 text-sm"
          style="color:var(--dash-text-muted)">
          Produk sedang dimuat...
        </div>
      </div>
    </div>

    <!-- Layanan Aktif -->
    <div class="glass rounded-2xl p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold" style="color:var(--dash-text-primary)">Layanan Aktif Saya</h2>
        <NuxtLink to="/services" class="text-xs font-semibold" style="color:#1a4fa0;text-decoration:none">
          Lihat semua →
        </NuxtLink>
      </div>
      <div v-if="loadingServices" class="text-sm text-center py-4" style="color:var(--dash-text-muted)">Memuat...</div>
      <div v-else-if="services.length === 0"
        class="rounded-xl p-4 text-center"
        style="background:var(--dash-input-bg);border:1px dashed var(--dash-card-border)">
        <div class="text-2xl mb-2">📭</div>
        <div class="text-sm font-semibold mb-1" style="color:var(--dash-text-primary)">Belum ada layanan aktif</div>
        <p class="text-xs mb-3" style="color:var(--dash-text-muted)">Pesan paket website pertama Anda sekarang</p>
        <NuxtLink to="/orders"
          class="inline-block text-xs font-bold px-4 py-2 rounded-lg"
          style="background:#1a4fa0;color:white;text-decoration:none">
          Pesan Sekarang
        </NuxtLink>
      </div>
      <div v-else class="space-y-2">
        <div v-for="s in services.slice(0,3)" :key="s.id"
          class="flex items-center justify-between py-2.5"
          style="border-bottom:1px solid var(--dash-divider)">
          <div class="flex items-center gap-3">
            <div class="text-xl">🌐</div>
            <div>
              <div class="text-sm font-semibold" style="color:var(--dash-text-primary)">{{ s.name || s.product_name }}</div>
              <div class="text-xs" style="color:var(--dash-text-muted)">{{ s.metadata?.domain || s.domain || '-' }}</div>
            </div>
          </div>
          <span class="text-xs px-2 py-1 rounded-full font-semibold"
            style="background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.2)">
            Aktif
          </span>
        </div>
      </div>
    </div>

    <!-- Invoice Tertunda -->
    <div v-if="unpaidCount > 0" class="glass rounded-2xl p-5"
      style="border:1px solid rgba(245,158,11,0.3)">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-lg">⚠️</span>
          <h2 class="font-bold" style="color:var(--dash-text-primary)">Invoice Tertunda</h2>
        </div>
        <NuxtLink to="/invoices" class="text-xs font-semibold" style="color:#f59e0b;text-decoration:none">
          Lihat semua →
        </NuxtLink>
      </div>
      <div class="space-y-2">
        <div v-for="inv in unpaidInvoices.slice(0,3)" :key="inv.id"
          class="flex items-center justify-between py-2.5 cursor-pointer"
          style="border-bottom:1px solid var(--dash-divider)"
          @click="navigateTo('/invoices')">
          <div>
            <div class="text-xs font-mono font-bold" style="color:#1a4fa0">{{ inv.invoice_number }}</div>
            <div class="text-xs" style="color:var(--dash-text-muted)">Jatuh tempo: {{ fmtDate(inv.due_date) }}</div>
          </div>
          <div class="text-sm font-bold" style="color:#f59e0b">{{ fmtRp(inv.total_amount || inv.total) }}</div>
        </div>
      </div>
    </div>

    <!-- PPOB — Layanan Tambahan (collapsed) -->
    <div class="glass rounded-2xl overflow-hidden">
      <button class="w-full flex items-center justify-between p-4 text-left"
        @click="ppobOpen = !ppobOpen">
        <div class="flex items-center gap-2">
          <span class="text-base">⚡</span>
          <span class="text-sm font-semibold" style="color:var(--dash-text-primary)">Layanan Pembayaran Digital</span>
          <span class="text-xs px-2 py-0.5 rounded-full font-semibold"
            style="background:var(--dash-accent-light);color:#1a4fa0">PPOB</span>
        </div>
        <span class="text-xs transition-transform" :style="ppobOpen ? 'transform:rotate(180deg)' : ''"
          style="color:var(--dash-text-muted)">▼</span>
      </button>
      <div v-if="ppobOpen" style="border-top:1px solid var(--dash-divider)">
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-3 p-4">
          <NuxtLink v-for="p in ppobMenu" :key="p.href" :to="p.href"
            class="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-[1.03]"
            style="background:var(--dash-input-bg);border:1px solid var(--dash-card-border);text-decoration:none">
            <div class="text-2xl">{{ p.icon }}</div>
            <div class="text-xs font-semibold text-center" style="color:var(--dash-text-primary)">{{ p.name }}</div>
          </NuxtLink>
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

// State
const services = ref<any[]>([])
const invoices = ref<any[]>([])
const tickets = ref<any[]>([])
const ppobOpen = ref(false)
const loadingServices = ref(true)
const loadingInvoices = ref(true)
const loadingTickets = ref(true)
const loadingProducts = ref(true)

// Onboarding steps
const onboardingSteps = ['Pilih Paket', 'Isi Form', 'Bayar Invoice', 'Website Aktif']

// PPOB menu
const ppobMenu = [
  { icon: '⚡', name: 'Token Listrik', href: '/ppob/pln' },
  { icon: '📱', name: 'Pulsa & Data', href: '/ppob/pulsa' },
  { icon: '🎮', name: 'Voucher Game', href: '/ppob/games' },
  { icon: '📺', name: 'TV Kabel', href: '/ppob/tv' },
  { icon: '💳', name: 'E-Money', href: '/ppob/emoney' },
]

// Computed
const websiteProducts = computed(() =>
  products.value.filter((p: any) => p.category === 'website')
)

const unpaidInvoices = computed(() =>
  invoices.value.filter((i: any) => i.status === 'unpaid')
)

const unpaidCount = computed(() => unpaidInvoices.value.length)

const openTickets = computed(() =>
  tickets.value.filter((t: any) => t.status === 'open').length
)

// Helpers
function productIcon(name: string) {
  if (name.toLowerCase().includes('umkm')) return '🏪'
  if (name.toLowerCase().includes('premium')) return '⭐'
  if (name.toLowerCase().includes('desa')) return '🏘️'
  return '🌐'
}

function getMinPrice(p: any) {
  const opts = getPricingOptions(p)
  if (opts.length === 0) return null
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(Math.min(...opts.map((o: any) => o.amount)))
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric'
}) : '-'

const fmtRp = (n: number) => n ? new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
}).format(n) : '-'

// Fetch data
onMounted(async () => {
  if (!user.value?.id) return

  // Fetch produk website
  fetchProducts().finally(() => { loadingProducts.value = false })

  // Fetch layanan aktif
  $fetch<any>(`/api/billing/services?user_id=${user.value.id}`)
    .then(res => { services.value = res.services || [] })
    .catch(() => { services.value = [] })
    .finally(() => { loadingServices.value = false })

  // Fetch invoice
  $fetch<any>(`/api/billing/invoices?user_id=${user.value.id}`)
    .then(res => { invoices.value = res.invoices || [] })
    .catch(() => { invoices.value = [] })
    .finally(() => { loadingInvoices.value = false })

  // Fetch tiket
  $fetch<any>('/api/tickets')
    .then(res => { tickets.value = res.tickets || [] })
    .catch(() => { tickets.value = [] })
    .finally(() => { loadingTickets.value = false })
})
</script>
