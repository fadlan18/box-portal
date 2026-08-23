<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-adaptive mb-1">Pesan Layanan</h1>
      <p class="text-sm text-gray-400">Pilih layanan yang Anda butuhkan</p>
    </div>

    <div v-if="loadingProducts" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">
      Memuat katalog layanan...
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="p in products" :key="p.id"
        class="glass rounded-2xl p-6 glass-hover transition-all cursor-pointer"
        :class="selected?.id === p.id ? 'ring-2 ring-blue-500' : ''"
        @click="selected = p">
        <div class="flex items-start justify-between mb-3">
          <div class="text-3xl">{{ productIcon(p) }}</div>
          <span class="text-xs font-semibold px-2 py-1 rounded-full"
            style="background:rgba(59,130,246,0.15);color:#60a5fa">
            {{ p.category || p.billing_cycle || 'Layanan' }}
          </span>
        </div>
        <h3 class="font-bold text-adaptive text-lg mb-1">{{ p.name }}</h3>
        <p class="text-gray-400 text-sm mb-3">{{ p.description }}</p>

        <!-- Pricing dari specs jika ada -->
        <div v-if="p.specs?.pricing?.length" class="space-y-1.5 mb-3">
          <div v-for="pr in p.specs.pricing" :key="pr.id"
            class="flex items-center justify-between text-xs rounded-lg px-3 py-1.5"
            :class="selectedPricing[p.id] === pr.id ? 'ring-1 ring-blue-400' : ''"
            style="background:rgba(255,255,255,0.04);cursor:pointer"
            @click.stop="selectPricing(p, pr)">
            <span class="text-gray-400">{{ pr.label }}</span>
            <div class="flex items-center gap-1.5">
              <span v-if="pr.promo_label" class="px-1.5 py-0.5 rounded text-xs font-bold"
                style="background:rgba(234,179,8,0.2);color:#eab308">{{ pr.promo_label }}</span>
              <span class="font-bold text-adaptive">{{ fmtCurrency(pr.amount) }}</span>
            </div>
          </div>
        </div>

        <div v-else class="font-bold text-xl mb-3" style="color:#60a5fa">
          {{ fmtCurrency(p.price) }}
          <span v-if="p.billing_cycle" class="text-xs font-normal text-gray-500 ml-1">/ {{ p.billing_cycle }}</span>
        </div>
      </div>
    </div>

    <!-- Form order -->
    <div v-if="selected" class="glass rounded-2xl p-6 space-y-4">
      <h2 class="font-bold text-adaptive text-lg">Detail Pesanan — {{ selected.name }}</h2>

      <!-- Pilihan pricing jika ada -->
      <div v-if="selected.specs?.pricing?.length">
        <label class="text-xs font-semibold text-gray-400 block mb-2">Paket yang dipilih</label>
        <div class="glass rounded-xl px-4 py-3 text-sm text-adaptive">
          {{ currentPricing?.label || 'Pilih paket di atas' }}
          <span v-if="currentPricing" class="ml-2 font-bold" style="color:#60a5fa">
            {{ fmtCurrency(currentPricing.amount) }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-semibold text-gray-400 block mb-2">Nama Domain (opsional)</label>
          <input v-model="form.domain" type="text" placeholder="contoh.com"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none text-adaptive"
            style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-400 block mb-2">Nomor WhatsApp</label>
          <input v-model="form.phone" type="text" placeholder="08xxxxxxxxxx"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none text-adaptive"
            style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)" />
        </div>
        <div class="lg:col-span-2">
          <label class="text-xs font-semibold text-gray-400 block mb-2">Catatan / Kebutuhan Khusus</label>
          <textarea v-model="form.notes" rows="3" placeholder="Jelaskan kebutuhan Anda..."
            class="w-full px-4 py-3 rounded-xl text-sm outline-none text-adaptive resize-none"
            style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)"></textarea>
        </div>
      </div>

      <p v-if="error" class="text-red-400 text-sm">⚠️ {{ error }}</p>

      <button @click="order" :disabled="loading || (!currentPricing && selected.specs?.pricing?.length)"
        class="w-full py-4 rounded-xl font-bold text-sm transition-all"
        style="background:#1a4fa0;color:#ffffff">
        {{ loading ? 'Memproses...' : '🛒 Buat Invoice & Pesan Sekarang' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user } = useCustomAuth()
const products = ref([])
const loadingProducts = ref(true)
const selected = ref(null)
const selectedPricing = ref({})
const loading = ref(false)
const error = ref('')
const form = reactive({ domain: '', phone: '', notes: '' })

const currentPricing = computed(() => {
  if (!selected.value) return null
  const pid = selectedPricing.value[selected.value.id]
  if (!pid) return null
  return selected.value.specs?.pricing?.find((p) => p.id === pid) || null
})

onMounted(async () => {
  try {
    const res: any = await $fetch('/api/products')
    // Filter hanya produk website (bukan ppob) untuk halaman order
    products.value = (res.products || []).filter((p) => p.category !== 'ppob')
  } catch (e) {
    console.error('Error loading products:', e)
  } finally {
    loadingProducts.value = false
  }

  // Jika ada query product, auto-select
  const route = useRoute()
  if (route.query.product) {
    const found = products.value.find((p) => p.id === route.query.product)
    if (found) selected.value = found
  }
})

function selectPricing(product, pricing) {
  selected.value = product
  selectedPricing.value = { ...selectedPricing.value, [product.id]: pricing.id }
}

function productIcon(p) {
  if (p.name?.toLowerCase().includes('desa')) return '🏘️'
  if (p.name?.toLowerCase().includes('umkm') || p.name?.toLowerCase().includes('hemat')) return '🏪'
  if (p.name?.toLowerCase().includes('premium')) return '⭐'
  if (p.category === 'website') return '🌐'
  return '📦'
}

async function order() {
  if (!selected.value || !user.value?.id) return
  if (selected.value.specs?.pricing?.length && !currentPricing.value) {
    error.value = 'Pilih paket terlebih dahulu'
    return
  }

  error.value = ''
  loading.value = true

  // Tentukan harga — dari pricing yang dipilih atau harga produk
  const price = currentPricing.value ? currentPricing.value.amount : selected.value.price
  const pricingLabel = currentPricing.value ? currentPricing.value.label : selected.value.name

  try {
    const res: any = await $fetch('/api/billing/create-invoice', {
      method: 'POST',
      credentials: 'include',
      body: {
        user_id: user.value.id,
        user_name: user.value.name,
        user_email: user.value.email,
        service: {
          id: selected.value.id,
          name: selected.value.name,
          price,
          period: currentPricing.value?.period || selected.value.billing_cycle || 'project',
          pricing_label: pricingLabel,
        },
        form,
      },
    })

    if (res.ok && res.invoice) {
      // Redirect ke billing portal untuk bayar
      window.location.href = `https://paymen.mitranz.com/invoices/${res.invoice.id}`
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Gagal membuat pesanan'
  } finally {
    loading.value = false
  }
}

function fmtCurrency(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(n || 0)
}
</script>
