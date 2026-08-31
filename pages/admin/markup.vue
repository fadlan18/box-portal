<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-adaptive mb-1">Markup PPOB</h1>
        <p class="text-sm text-gray-400">Kelola harga jual produk PPOB secara langsung</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Bulk markup -->
        <div class="glass rounded-xl px-3 py-2 flex items-center gap-2">
          <span class="text-xs text-gray-400">Bulk:</span>
          <input v-model.number="bulkValue" type="number" min="0" placeholder="500"
            class="w-16 text-xs outline-none text-adaptive bg-transparent" />
          <select v-model="bulkType" class="text-xs outline-none text-adaptive bg-transparent">
            <option value="fixed">Rp</option>
            <option value="percent">%</option>
          </select>
          <button @click="applyBulk"
            class="px-2 py-1 rounded-lg text-xs font-bold"
            style="background:#1a4fa0;color:#ffffff">
            Terapkan ke {{ activeCategory }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tab kategori -->
    <div class="flex gap-2 overflow-x-auto pb-1">
      <button v-for="cat in categories" :key="cat"
        @click="activeCategory = cat"
        class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all"
        :style="activeCategory === cat
          ? 'background:#1a4fa0;color:#ffffff'
          : 'background:var(--dash-input-bg);color:var(--dash-text-muted);border:1px solid var(--dash-card-border)'">
        {{ cat }}
      </button>
    </div>

    <!-- Summary bar -->
    <div class="grid grid-cols-3 gap-3">
      <div class="glass rounded-xl p-3">
        <div class="text-xs text-gray-400 mb-1">Produk di kategori ini</div>
        <div class="text-xl font-bold text-adaptive">{{ filteredProducts.length }}</div>
      </div>
      <div class="glass rounded-xl p-3">
        <div class="text-xs text-gray-400 mb-1">Rata-rata markup</div>
        <div class="text-xl font-bold" style="color:#60a5fa">
          {{ avgMarkup }}
        </div>
      </div>
      <div class="glass rounded-xl p-3">
        <div class="text-xs text-gray-400 mb-1">Produk dengan markup</div>
        <div class="text-xl font-bold" style="color:#4ade80">
          {{ productsWithMarkup }} / {{ filteredProducts.length }}
        </div>
      </div>
    </div>

    <!-- Tabel produk live -->
    <div class="glass rounded-2xl overflow-hidden">
      <div v-if="loadingProducts" class="p-8 text-center text-gray-400 text-sm">Memuat produk...</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead style="border-bottom:1px solid var(--dash-divider)">
            <tr>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Produk</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Brand</th>
              <th class="text-right px-4 py-3 text-xs text-gray-500 font-semibold">Harga Dasar</th>
              <th class="text-center px-4 py-3 text-xs text-gray-500 font-semibold w-36">Markup</th>
              <th class="text-right px-4 py-3 text-xs text-gray-500 font-semibold">Harga Jual</th>
              <th class="text-right px-4 py-3 text-xs text-gray-500 font-semibold">Profit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredProducts" :key="p.buyer_sku_code"
              class="hover:bg-white/5 transition-colors"
              style="border-bottom:1px solid var(--dash-divider)">
              <td class="px-4 py-2.5">
                <div class="text-adaptive text-xs font-semibold">{{ p.product_name }}</div>
                <div class="text-gray-500 text-xs font-mono">{{ p.buyer_sku_code }}</div>
              </td>
              <td class="px-4 py-2.5 text-xs text-gray-400">{{ p.brand }}</td>
              <td class="px-4 py-2.5 text-right text-xs text-gray-400">{{ fmtRp(p.price) }}</td>
              <td class="px-4 py-2.5">
                <!-- Inline markup editor -->
                <div class="flex items-center gap-1">
                  <input
                    :value="getMarkupValue(p)"
                    @input="previewMarkup(p, $event)"
                    @change="saveMarkup(p, $event)"
                    type="number" min="0"
                    class="w-16 px-2 py-1 rounded-lg text-xs outline-none text-adaptive text-right"
                    style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)" />
                  <select
                    :value="getMarkupType(p)"
                    @change="saveMarkupType(p, $event)"
                    class="px-1 py-1 rounded-lg text-xs outline-none text-adaptive"
                    style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
                    <option value="fixed">Rp</option>
                    <option value="percent">%</option>
                  </select>
                </div>
              </td>
              <td class="px-4 py-2.5 text-right">
                <span class="text-xs font-bold" style="color:#60a5fa">
                  {{ fmtRp(getSellingPrice(p)) }}
                </span>
              </td>
              <td class="px-4 py-2.5 text-right">
                <span class="text-xs font-bold"
                  :style="getProfit(p) > 0 ? 'color:#4ade80' : 'color:#94a3b8'">
                  {{ getProfit(p) > 0 ? '+' + fmtRp(getProfit(p)) : '-' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })

const products = ref([])
const markups = ref([])
const loadingProducts = ref(true)
const activeCategory = ref('Pulsa')
const bulkValue = ref(500)
const bulkType = ref('fixed')

// Map: sku_code -> markup config
const markupMap = ref<Record<string, any>>({})
// Preview sementara sebelum save
const previewMap = ref<Record<string, number>>({})

// Kategori dinamis dari produk yang ada di DB
const categories = computed(() => {
  const cats = [...new Set(products.value.map((p: any) => p.category))].filter(Boolean).sort()
  return cats.length ? cats : ['Pulsa', 'Data', 'PLN', 'Games', 'TV']
})

const filteredProducts = computed(() =>
  products.value.filter((p: any) => p.category === activeCategory.value)
)

const productsWithMarkup = computed(() =>
  filteredProducts.value.filter((p: any) => getMarkupValue(p) > 0).length
)

const avgMarkup = computed(() => {
  const withMarkup = filteredProducts.value.filter((p: any) => getMarkupValue(p) > 0)
  if (!withMarkup.length) return '-'
  const avg = withMarkup.reduce((sum: number, p: any) => sum + getProfit(p), 0) / withMarkup.length
  return '+' + fmtRp(Math.round(avg))
})

onMounted(async () => {
  // Load produk dari cache
  try {
    const res: any = await $fetch('/api/ppob/products-raw', { credentials: 'include' })
    products.value = res.products || []
  } catch (e) { console.error(e) }
  finally { loadingProducts.value = false }

  // Load markup yang sudah tersimpan
  await loadMarkups()
})

async function loadMarkups() {
  const headers = useRequestHeaders(['cookie'])
  const res: any = await $fetch('/api/admin/markup', { credentials: 'include', headers }).catch(() => ({ markups: [] }))
  markups.value = res.markups || []
  // Build map sku -> markup
  const map: Record<string, any> = {}
  for (const m of res.markups || []) {
    const key = m.sku_code || (m.brand + ':' + m.category)
    map[key] = m
  }
  markupMap.value = map
}

function getMarkupForProduct(p: any) {
  // Prioritas: sku_code spesifik (value > 0) > brand+category > category saja (bulk)
  return markups.value.find((m: any) =>
    m.sku_code && m.sku_code === p.buyer_sku_code && m.value > 0
  ) || markups.value.find((m: any) =>
    !m.sku_code && m.brand === p.brand && m.category === p.category && m.value > 0
  ) || markups.value.find((m: any) =>
    !m.sku_code && !m.brand && m.category === p.category
  ) || null
}

function getMarkupValue(p: any) {
  if (previewMap.value[p.buyer_sku_code] !== undefined) return previewMap.value[p.buyer_sku_code]
  return getMarkupForProduct(p)?.value || 0
}

function getMarkupType(p: any) {
  return getMarkupForProduct(p)?.markup_type || 'fixed'
}

function getSellingPrice(p: any) {
  const markup = getMarkupForProduct(p)
  const val = previewMap.value[p.buyer_sku_code] ?? markup?.value ?? 0
  const type = markup?.markup_type || 'fixed'
  if (type === 'percent') return Math.round(p.price * (1 + val / 100))
  return p.price + val
}

function getProfit(p: any) {
  return getSellingPrice(p) - p.price
}

function previewMarkup(p: any, event: any) {
  previewMap.value = { ...previewMap.value, [p.buyer_sku_code]: parseFloat(event.target.value) || 0 }
}

async function saveMarkup(p: any, event: any) {
  const value = parseFloat(event.target.value) || 0
  const type = getMarkupType(p)
  const existing = getMarkupForProduct(p)

  if (existing && existing.sku_code === p.buyer_sku_code) {
    await $fetch('/api/admin/markup/' + existing.id, {
      method: 'PATCH', credentials: 'include',
      body: { value, markup_type: type, sku_code: p.buyer_sku_code }
    })
  } else {
    await $fetch('/api/admin/markup', {
      method: 'POST', credentials: 'include',
      body: {
        sku_code: p.buyer_sku_code,
        category: p.category,
        brand: p.brand,
        markup_type: type,
        value,
        is_active: true
      }
    })
  }
  // Clear preview
  const newPreview = { ...previewMap.value }
  delete newPreview[p.buyer_sku_code]
  previewMap.value = newPreview
  await loadMarkups()
}

async function saveMarkupType(p: any, event: any) {
  const type = event.target.value
  const existing = getMarkupForProduct(p)
  if (existing && existing.sku_code === p.buyer_sku_code) {
    await $fetch('/api/admin/markup/' + existing.id, {
      method: 'PATCH', credentials: 'include',
      body: { markup_type: type }
    })
    await loadMarkups()
  }
}

async function applyBulk() {
  if (!confirm(`Terapkan markup ${bulkValue.value}${bulkType.value === 'percent' ? '%' : ' Rp'} ke semua produk ${activeCategory.value}?`)) return

  // Hapus markup lama per kategori
  const existing = markups.value.find((m: any) => m.category === activeCategory.value && !m.brand && !m.sku_code)
  if (existing) {
    await $fetch('/api/admin/markup/' + existing.id, { method: 'DELETE', credentials: 'include' })
  }
  await $fetch('/api/admin/markup', {
    method: 'POST', credentials: 'include',
    body: { category: activeCategory.value, markup_type: bulkType.value, value: bulkValue.value, is_active: true }
  })
  await loadMarkups()
}

function fmtRp(n: number) {
  return 'Rp ' + (n || 0).toLocaleString('id-ID')
}
</script>
