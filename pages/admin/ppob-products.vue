<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-white mb-1">Produk Featured PPOB</h1>
      <p class="text-sm text-gray-400">Atur produk mana yang tampil di halaman PPOB. Featured = tampil langsung, sisanya tersembunyi</p>
    </div>

    <!-- Tab kategori -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="cat in categories" :key="cat.value"
        @click="activeCategory=cat.value;loadProducts()"
        class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        :style="activeCategory===cat.value
          ? 'background:#1a4fa0;color:white'
          : 'background:rgba(255,255,255,0.08);color:#94a3b8'">
        {{ cat.label }}
      </button>
    </div>

    <!-- Info -->
    <div class="glass p-4 rounded-2xl" style="border:1px solid rgba(99,102,241,0.3);background:rgba(99,102,241,0.08)">
      <p class="text-sm font-medium" style="color:#a5b4fc">
        💡 <strong>Featured</strong> = tampil langsung di halaman PPOB (max 4-6).
        Klik produk dari Digiflazz untuk ditambahkan, lalu atur urutan dan badge.
        Produk yang tidak featured tetap bisa diakses via "Lihat semua".
      </p>
    </div>

    <div style="display:grid;gap:24px" :class="'grid-cols-1 lg:grid-cols-2'">
      <!-- Kiri: Produk dari Digiflazz -->
      <div class="glass rounded-2xl overflow-hidden">
        <div class="px-4 py-3 flex items-center justify-between" style="border-bottom:1px solid var(--dash-divider)">
          <h2 class="font-bold text-sm text-white">Produk Digiflazz — {{ activeCategory }}</h2>
          <span class="text-xs text-gray-400">{{ digiProducts.length }} produk</span>
        </div>
        <div v-if="loadingDigi" class="p-6 text-center text-gray-400 text-sm">Memuat...</div>
        <div v-else class="overflow-y-auto" style="max-height:400px">
          <div v-for="p in digiProducts" :key="p.buyer_sku_code"
            class="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
            style="border-bottom:1px solid var(--dash-divider)"
            @click="addProduct(p)">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-white truncate">{{ p.product_name }}</div>
              <div class="text-xs text-gray-400 font-mono">{{ p.buyer_sku_code }}</div>
            </div>
            <div class="text-sm font-bold" style="color:#818cf8">{{ fmtRp(p.price) }}</div>
            <div class="text-xs px-2 py-1 rounded-lg"
              :style="isConfigured(p.buyer_sku_code)
                ? 'background:rgba(34,197,94,0.15);color:#4ade80'
                : 'background:rgba(255,255,255,0.08);color:#64748b'">
              {{ isConfigured(p.buyer_sku_code) ? '✓ Added' : '+ Add' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Kanan: Konfigurasi featured -->
      <div class="glass rounded-2xl overflow-hidden">
        <div class="px-4 py-3 flex items-center justify-between" style="border-bottom:1px solid var(--dash-divider)">
          <h2 class="font-bold text-sm text-white">Konfigurasi Featured</h2>
          <span class="text-xs text-gray-400">{{ configs.filter(c=>c.is_featured).length }} featured</span>
        </div>
        <div v-if="loadingConfig" class="p-6 text-center text-gray-400 text-sm">Memuat...</div>
        <div v-else-if="configs.length === 0" class="p-6 text-center text-gray-400 text-sm">
          Klik produk dari kiri untuk menambahkan
        </div>
        <div v-else class="overflow-y-auto" style="max-height:400px">
          <div v-for="c in sortedConfigs" :key="c.id"
            class="flex items-center gap-3 px-4 py-3"
            style="border-bottom:1px solid var(--dash-divider)">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-white truncate">{{ c.product_name }}</div>
              <div class="text-xs text-gray-400 font-mono">{{ c.sku_code }}</div>
            </div>
            <!-- Badge input -->
            <input v-model="c.badge_text" type="text" placeholder="badge"
              class="text-xs px-2 py-1 rounded-lg outline-none w-20"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border);color:white"
              @blur="updateConfig(c)">
            <!-- Featured toggle -->
            <button @click="toggleFeatured(c)"
              class="text-xs px-2 py-1 rounded-lg font-semibold transition-all"
              :style="c.is_featured
                ? 'background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)'
                : 'background:rgba(100,116,139,0.15);color:#64748b;border:1px solid rgba(100,116,139,0.2)'">
              {{ c.is_featured ? '⭐' : '☆' }}
            </button>
            <!-- Hapus -->
            <button @click="hapusConfig(c)"
              class="text-xs px-2 py-1 rounded-lg"
              style="background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.2)">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })

const activeCategory = ref('PLN')
const loadingDigi = ref(false)
const loadingConfig = ref(false)
const digiProducts = ref<any[]>([])
const configs = ref<any[]>([])

const categories = [
  { value: 'PLN', label: '⚡ PLN' },
  { value: 'Pulsa', label: '📱 Pulsa' },
  { value: 'Data', label: '📶 Data' },
  { value: 'Games', label: '🎮 Games' },
]

const sortedConfigs = computed(() =>
  [...configs.value].sort((a, b) => a.featured_order - b.featured_order)
)

function isConfigured(sku: string) {
  return configs.value.some(c => c.sku_code === sku)
}

async function loadProducts() {
  loadingDigi.value = true
  loadingConfig.value = true
  try {
    const [rawData, configData] = await Promise.all([
      $fetch<any>('/api/ppob/products-raw'),
      $fetch<any>('/api/graphql/proxy', {
        method: 'POST',
        body: { query: `query {
          ppob_product_configs(
            where: {category: {_eq: "${activeCategory.value}"}}
            order_by: {featured_order: asc}
          ) { id category sku_code product_name badge_text is_featured is_active featured_order }
        }` }
      })
    ])
    digiProducts.value = (rawData?.products ?? [])
      .filter((p: any) => p.category === activeCategory.value)
    configs.value = configData.data?.ppob_product_configs ?? []
  } finally {
    loadingDigi.value = false
    loadingConfig.value = false
  }
}
onMounted(loadProducts)

async function addProduct(p: any) {
  if (isConfigured(p.buyer_sku_code)) return
  try {
    await $fetch('/api/admin/ppob-product-configs', { credentials: 'include',
      method: 'POST',
      body: { action: 'insert', data: {
        category: activeCategory.value,
        sku_code: p.buyer_sku_code,
        product_name: p.product_name,
        badge_text: '',
        is_featured: configs.value.filter(c => c.is_featured).length < 4,
        is_active: true,
        featured_order: configs.value.length + 1
      }}
    })
    await loadProducts()
  } catch (e: any) { alert(e?.data?.message || 'Gagal') }
}

async function toggleFeatured(c: any) {
  const featuredCount = configs.value.filter(x => x.is_featured).length
  if (!c.is_featured && featuredCount >= 6) {
    alert('Maksimal 6 produk featured. Nonaktifkan salah satu dulu.')
    return
  }
  c.is_featured = !c.is_featured
  await updateConfig(c)
}

async function updateConfig(c: any) {
  await $fetch('/api/admin/ppob-product-configs', { credentials: 'include',
    method: 'POST',
    body: { action: 'update', data: c }
  })
}

async function hapusConfig(c: any) {
  if (!confirm(`Hapus konfigurasi "${c.product_name}"?`)) return
  await $fetch('/api/admin/ppob-product-configs', { credentials: 'include',
    method: 'POST', body: { action: 'delete', data: { id: c.id } }
  })
  await loadProducts()
}

function fmtRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 }).format(n)
}
</script>
