<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold" style="color:var(--dash-text-primary)">Order Layanan</h1>
        <p class="text-sm" style="color:var(--dash-text-muted)">Pilih paket website yang sesuai kebutuhan Anda</p>
      </div>
      <!-- Badge keranjang -->
      <button v-if="cart.length > 0" @click="scrollToCart"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        style="background:rgba(26,79,160,0.08);color:#1a4fa0;border:1px solid rgba(26,79,160,0.2)">
        🛒 Keranjang
        <span class="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
          style="background:#1a4fa0">{{ cart.length }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="productLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div v-for="i in 3" :key="i" class="rounded-2xl h-64 animate-pulse"
        style="background:var(--dash-input-bg)"></div>
    </div>

    <!-- Daftar produk — semua tampil sekaligus -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div v-for="p in websiteProducts" :key="p.id"
        class="glass rounded-2xl p-5 flex flex-col transition-all"
        :style="isInCart(p.id) ? 'border:2px solid #1a4fa0' : ''">

        <!-- Header produk -->
        <div class="flex items-start justify-between mb-3">
          <div class="text-3xl">{{ productIcon(p.name) }}</div>
          <div class="flex items-center gap-2">
            <span v-if="isInCart(p.id)" class="text-xs px-2 py-0.5 rounded-full font-bold"
              style="background:rgba(26,79,160,0.1);color:#1a4fa0;border:1px solid rgba(26,79,160,0.2)">
              ✓ Di Keranjang
            </span>
          </div>
        </div>
        <h3 class="font-bold text-base mb-1" style="color:var(--dash-text-primary)">{{ p.name }}</h3>
        <p class="text-xs mb-4 flex-1" style="color:var(--dash-text-muted)">{{ p.short_desc }}</p>

        <!-- Paket Utama (type: main) — radio -->
        <div class="mb-3">
          <div class="text-xs font-bold uppercase tracking-wider mb-2" style="color:var(--dash-text-muted)">
            Pilih Paket
          </div>
          <div class="space-y-2">
            <button v-for="opt in mainOptions(p)" :key="opt.id"
              @click="selectMain(p.id, opt)"
              class="w-full p-3 rounded-xl text-left transition-all"
              :style="selectedMain[p.id]?.id === opt.id
                ? 'background:rgba(26,79,160,0.06);border:1.5px solid #1a4fa0'
                : 'background:var(--dash-input-bg);border:1.5px solid var(--dash-card-border)'">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    :style="selectedMain[p.id]?.id === opt.id
                      ? 'border-color:#1a4fa0'
                      : 'border-color:var(--dash-input-border)'">
                    <div v-if="selectedMain[p.id]?.id === opt.id"
                      class="w-2 h-2 rounded-full" style="background:#1a4fa0"/>
                  </div>
                  <div>
                    <div class="text-xs font-semibold" style="color:var(--dash-text-primary)">{{ opt.label }}</div>
                  </div>
                </div>
                <div class="text-right flex-shrink-0 ml-2">
                  <div class="text-xs font-bold" style="color:#1a4fa0">{{ fmtRp(opt.amount) }}</div>
                  <span v-if="opt.promo_label" class="text-xs px-1.5 py-0.5 rounded font-bold"
                    style="background:rgba(251,191,36,0.15);color:#d97706">{{ opt.promo_label }}</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Layanan Tambahan (type: addon) — checkbox -->
        <div v-if="addonOptions(p).length > 0" class="mb-4">
          <div class="text-xs font-bold uppercase tracking-wider mb-2" style="color:var(--dash-text-muted)">
            Layanan Tambahan <span class="font-normal">(opsional)</span>
          </div>
          <div class="space-y-2">
            <label v-for="opt in addonOptions(p)" :key="opt.id"
              class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
              :style="isAddonSelected(p.id, opt.id)
                ? 'background:rgba(16,185,129,0.06);border:1.5px solid rgba(16,185,129,0.4)'
                : 'background:var(--dash-input-bg);border:1.5px solid var(--dash-card-border)'">
              <div class="flex items-center gap-2">
                <input type="checkbox"
                  :checked="isAddonSelected(p.id, opt.id)"
                  @change="toggleAddon(p.id, opt)"
                  class="rounded" style="accent-color:#10b981"/>
                <div class="text-xs font-semibold" style="color:var(--dash-text-primary)">{{ opt.label }}</div>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <div class="text-xs font-bold" style="color:#10b981">+{{ fmtRp(opt.amount) }}</div>
                <div class="text-xs" style="color:var(--dash-text-muted)">{{ opt.period }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Subtotal produk -->
        <div v-if="selectedMain[p.id]" class="mb-3 px-3 py-2 rounded-xl text-xs flex items-center justify-between"
          style="background:var(--dash-input-bg)">
          <span style="color:var(--dash-text-muted)">Subtotal</span>
          <span class="font-bold" style="color:var(--dash-text-primary)">{{ fmtRp(productSubtotal(p.id)) }}</span>
        </div>

        <!-- Tombol aksi -->
        <div class="space-y-2 mt-auto">
          <button v-if="selectedMain[p.id]"
            @click="addToCart(p)"
            class="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
            :style="isInCart(p.id)
              ? 'background:rgba(26,79,160,0.1);color:#1a4fa0;border:1px solid #1a4fa0'
              : 'background:#1a4fa0;color:white'">
            {{ isInCart(p.id) ? '🔄 Update Keranjang' : '🛒 Tambah ke Keranjang' }}
          </button>
          <button v-if="selectedMain[p.id] && websiteProducts.length === 1"
            @click="directOrder(p)" :disabled="ordering"
            class="w-full py-2.5 rounded-xl text-sm font-bold text-white"
            style="background:linear-gradient(135deg,#1a4fa0,#2563eb)">
            {{ ordering ? 'Memproses...' : 'Langsung Order' }}
          </button>
          <p v-if="!selectedMain[p.id]" class="text-center text-xs py-2" style="color:var(--dash-text-muted)">
            ← Pilih paket untuk melanjutkan
          </p>
        </div>
      </div>
    </div>

    <!-- Panel Keranjang -->
    <div v-if="cart.length > 0" id="cart-section" class="glass rounded-2xl p-5"
      style="border:1px solid rgba(26,79,160,0.25)">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-lg">🛒</span>
          <h3 class="font-bold" style="color:var(--dash-text-primary)">Keranjang Anda</h3>
          <span class="text-xs px-2 py-0.5 rounded-full font-semibold"
            style="background:rgba(26,79,160,0.1);color:#1a4fa0">{{ cart.length }} produk</span>
        </div>
        <button @click="clearCart" class="text-xs px-2 py-1 rounded-lg"
          style="color:#f87171;background:rgba(239,68,68,0.08)">
          Kosongkan
        </button>
      </div>

      <!-- Item keranjang -->
      <div class="space-y-3 mb-4">
        <div v-for="item in cart" :key="item.productId"
          class="rounded-xl p-4"
          style="background:var(--dash-input-bg);border:1px solid var(--dash-card-border)">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ productIcon(item.productName) }}</span>
              <div>
                <div class="text-sm font-bold" style="color:var(--dash-text-primary)">{{ item.productName }}</div>
                <div class="text-xs" style="color:var(--dash-text-muted)">{{ item.main.label }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold" style="color:#1a4fa0">{{ fmtRp(item.main.amount) }}</div>
              <button @click="removeFromCart(item.productId)" class="text-xs mt-1"
                style="color:#f87171">✕ Hapus</button>
            </div>
          </div>
          <div v-if="item.addons.length > 0" class="space-y-1 mt-2 pt-2"
            style="border-top:1px solid var(--dash-divider)">
            <div v-for="addon in item.addons" :key="addon.id"
              class="flex items-center justify-between text-xs">
              <span style="color:var(--dash-text-muted)">+ {{ addon.label }}</span>
              <span class="font-semibold" style="color:#10b981">+{{ fmtRp(addon.amount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Total & Checkout -->
      <div class="pt-4" style="border-top:1px solid var(--dash-divider)">
        <div class="flex items-center justify-between mb-4">
          <span class="font-bold" style="color:var(--dash-text-primary)">Total Keseluruhan</span>
          <span class="text-xl font-bold" style="color:#1a4fa0">{{ fmtRp(cartTotal) }}</span>
        </div>
        <button @click="checkoutCart" :disabled="ordering"
          class="w-full py-3 rounded-xl font-bold text-sm text-white transition-all"
          style="background:linear-gradient(135deg,#1a4fa0,#2563eb);box-shadow:0 4px 16px rgba(26,79,160,0.3)">
          <span style='color:white'>{{ ordering ? 'Memproses...' : 'Checkout Semua — ' + fmtRp(cartTotal) }}</span>
        </button>
      </div>
    </div>

    <!-- Modal sukses -->
    <div v-if="orderSuccess" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="orderSuccess = null">
      <div class="rounded-3xl p-8 max-w-sm w-full text-center"
        style="background:var(--dash-card-bg);border:1px solid var(--dash-card-border)">
        <div class="text-5xl mb-4">🎉</div>
        <h3 class="font-bold text-xl mb-2" style="color:var(--dash-text-primary)">Order Berhasil!</h3>
        <p class="text-sm mb-2" style="color:var(--dash-text-muted)">Invoice telah dibuat dan dikirim ke email Anda.</p>
        <p class="text-xs mb-6" style="color:var(--dash-text-muted)">Tim kami akan segera menghubungi Anda.</p>
        <div class="space-y-2">
          <NuxtLink to="/invoices"
            class="block w-full py-2.5 rounded-xl text-sm font-bold"
            style="background:linear-gradient(135deg,#1a4fa0,#2563eb);text-decoration:none;color:white !important">
            Lihat Invoice →
          </NuxtLink>
          <button @click="orderSuccess = null"
            class="w-full py-2.5 rounded-xl text-sm font-semibold"
            style="background:var(--dash-input-bg);color:var(--dash-text-muted)">
            Order Lagi
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const { user } = useCustomAuth()
const { products, loading: productLoading, fetchProducts } = useProducts()

const ordering = ref(false)
const orderSuccess = ref<any>(null)

// Pilihan paket utama per produk — { [productId]: option }
const selectedMain = ref<Record<string, any>>({})
// Pilihan addon per produk — { [productId]: option[] }
const selectedAddons = ref<Record<string, any[]>>({})

// Keranjang — { productId, productName, main, addons }[]
const CART_KEY = 'mitranz-cart-v2'
const cart = ref<any[]>([])

onMounted(async () => {
  await fetchProducts()
  try {
    const saved = localStorage.getItem(CART_KEY)
    if (saved) cart.value = JSON.parse(saved)
  } catch {}
})

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart.value)) } catch {}
}

// Produk website saja
const websiteProducts = computed(() =>
  products.value.filter((p: any) => p.category === 'website')
)

// Helper ambil opsi berdasarkan type
function mainOptions(p: any) {
  return (p.specs?.pricing || []).filter((o: any) => o.type === 'main')
}

function addonOptions(p: any) {
  return (p.specs?.pricing || []).filter((o: any) => o.type === 'addon')
}

function selectMain(productId: string, opt: any) {
  selectedMain.value = { ...selectedMain.value, [productId]: opt }
}

function isAddonSelected(productId: string, optId: string) {
  return (selectedAddons.value[productId] || []).some((a: any) => a.id === optId)
}

function toggleAddon(productId: string, opt: any) {
  const current = selectedAddons.value[productId] || []
  const idx = current.findIndex((a: any) => a.id === opt.id)
  if (idx >= 0) {
    selectedAddons.value[productId] = current.filter((_: any, i: number) => i !== idx)
  } else {
    selectedAddons.value[productId] = [...current, opt]
  }
}

function productSubtotal(productId: string) {
  const main = selectedMain.value[productId]?.amount || 0
  const addons = (selectedAddons.value[productId] || []).reduce((s: number, a: any) => s + a.amount, 0)
  return main + addons
}

function isInCart(productId: string) {
  return cart.value.some(i => i.productId === productId)
}

function addToCart(p: any) {
  if (!selectedMain.value[p.id]) return
  const item = {
    productId: p.id,
    productName: p.name,
    main: selectedMain.value[p.id],
    addons: selectedAddons.value[p.id] || [],
  }
  const idx = cart.value.findIndex(i => i.productId === p.id)
  if (idx >= 0) {
    cart.value[idx] = item
  } else {
    cart.value.push(item)
  }
  saveCart()
}

function removeFromCart(productId: string) {
  cart.value = cart.value.filter(i => i.productId !== productId)
  saveCart()
}

function clearCart() {
  cart.value = []
  try { localStorage.removeItem(CART_KEY) } catch {}
}

const cartTotal = computed(() =>
  cart.value.reduce((sum, i) => {
    const addonTotal = i.addons.reduce((s: number, a: any) => s + a.amount, 0)
    return sum + i.main.amount + addonTotal
  }, 0)
)

function scrollToCart() {
  document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' })
}

function buildInvoiceItems(items: any[]) {
  const result: any[] = []
  for (const item of items) {
    result.push({
      description: `${item.productName} — ${item.main.label}`,
      quantity: 1,
      unit_price: item.main.amount,
    })
    for (const addon of item.addons) {
      result.push({
        description: `${item.productName} — ${addon.label}`,
        quantity: 1,
        unit_price: addon.amount,
      })
    }
  }
  return result
}

// Order langsung (tanpa keranjang)
async function directOrder(p: any) {
  if (!selectedMain.value[p.id] || !user.value) return
  ordering.value = true
  try {
    const items = buildInvoiceItems([{
      productId: p.id,
      productName: p.name,
      main: selectedMain.value[p.id],
      addons: selectedAddons.value[p.id] || [],
    }])
    const res = await $fetch<any>('/api/billing/create-invoice', {
      method: 'POST',
      body: {
        user_id: user.value.id,
        user_name: user.value.name,
        user_email: user.value.email,
        items,
        form: {}
      }
    })
    clearCart()
    orderSuccess.value = res
  } catch (e: any) {
    alert(e?.data?.message || e.message || 'Gagal membuat order')
  } finally { ordering.value = false }
}

// Checkout semua dari keranjang
async function checkoutCart() {
  if (!cart.value.length || !user.value) return
  ordering.value = true
  try {
    const items = buildInvoiceItems(cart.value)
    const res = await $fetch<any>('/api/billing/create-invoice', {
      method: 'POST',
      body: {
        user_id: user.value.id,
        user_name: user.value.name,
        user_email: user.value.email,
        items,
        form: {}
      }
    })
    clearCart()
    orderSuccess.value = res
  } catch (e: any) {
    alert(e?.data?.message || e.message || 'Gagal checkout')
  } finally { ordering.value = false }
}

const fmtRp = (n: number) => n ? new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
}).format(n) : 'Rp 0'

function productIcon(name: string) {
  if (name.toLowerCase().includes('umkm')) return '🏪'
  if (name.toLowerCase().includes('premium')) return '⭐'
  if (name.toLowerCase().includes('desa')) return '🏘️'
  return '🌐'
}
</script>
