<template>
  <div style="min-height:100vh;background:#0f1117;font-family:'Inter',sans-serif">

    <!-- Navbar -->
    <nav style="position:sticky;top:0;z-index:100;background:rgba(15,17,23,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);padding:0 20px">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:60px">
        <div style="display:flex;align-items:center;gap:12px">
          <a href="/ppob" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;text-decoration:none;color:white;font-size:16px">←</a>
          <div>
            <div style="font-size:15px;font-weight:800;color:white">Voucher Game</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4)">Top up diamond & voucher instan</div>
          </div>
        </div>
        <a href="/ppob/riwayat" style="font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none;font-weight:600">📋 Riwayat</a>
      </div>
    </nav>

    <div style="max-width:1200px;margin:0 auto;padding:24px 20px">
      <div style="display:grid;grid-template-columns:1fr;gap:20px" :style="selectedProduct ? 'grid-template-columns: 1fr' : ''">

        <!-- STEP 1: Pilih Game -->
        <div v-if="!selectedGame" style="animation:fadeIn 0.3s ease">
          <!-- Header step -->
          <div style="margin-bottom:20px">
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">Langkah 1 dari 3</div>
            <h2 style="font-size:22px;font-weight:800;color:white;margin:0">Pilih Game</h2>
          </div>

          <!-- Loading -->
          <div v-if="loadingBrands" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px">
            <div v-for="i in 6" :key="i"
              style="height:120px;border-radius:16px;background:rgba(255,255,255,0.05);animation:pulse 1.5s infinite"></div>
          </div>

          <!-- Grid game -->
          <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">
            <button v-for="brand in brands" :key="brand.id"
              @click="pilihGame(brand)"
              style="position:relative;padding:20px 12px;border-radius:16px;cursor:pointer;border:1.5px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:10px"
              onmouseover="this.style.borderColor='rgba(99,102,241,0.5)';this.style.background='rgba(99,102,241,0.08)';this.style.transform='translateY(-3px)'"
              onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.background='rgba(255,255,255,0.04)';this.style.transform='translateY(0)'">

              <!-- Badge -->
              <div v-if="brand.badge_text"
                style="position:absolute;top:8px;right:8px;padding:2px 8px;border-radius:100px;font-size:10px;font-weight:700;background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)">
                {{ brand.badge_text }}
              </div>

              <!-- Logo -->
              <div style="width:64px;height:64px;border-radius:12px;overflow:hidden;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <img v-if="brand.logo_url" :src="brand.logo_url" :alt="brand.name"
                  style="width:100%;height:100%;object-fit:cover">
                <span v-else style="font-size:32px">🎮</span>
              </div>

              <div style="font-size:12px;font-weight:700;color:white;text-align:center;line-height:1.3">{{ brand.name }}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.35)">{{ getProductCount(brand) }} produk</div>
            </button>
          </div>
        </div>

        <!-- STEP 2 & 3: Setelah pilih game -->
        <div v-else>
          <!-- Layout desktop: 2 kolom -->
          <div style="display:grid;gap:20px" :style="windowWidth >= 768 ? 'grid-template-columns:1fr 360px' : 'grid-template-columns:1fr'">

            <!-- Kiri: Steps -->
            <div style="display:flex;flex-direction:column;gap:16px">

              <!-- Game terpilih + tombol ganti -->
              <div style="background:rgba(99,102,241,0.08);border:1.5px solid rgba(99,102,241,0.3);border-radius:16px;padding:16px;display:flex;align-items:center;gap:12px">
                <div style="width:48px;height:48px;border-radius:10px;overflow:hidden;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <img v-if="selectedGame.logo_url" :src="selectedGame.logo_url" style="width:100%;height:100%;object-fit:cover">
                  <span v-else style="font-size:24px">🎮</span>
                </div>
                <div style="flex:1">
                  <div style="font-size:14px;font-weight:700;color:white">{{ selectedGame.name }}</div>
                  <div style="font-size:12px;color:rgba(255,255,255,0.4)">{{ gameProducts.length }} produk tersedia</div>
                </div>
                <button @click="gantiGame"
                  style="padding:8px 14px;border-radius:10px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.12);font-size:12px;font-weight:600;cursor:pointer">
                  Ganti
                </button>
              </div>

              <!-- Step 2: Input ID -->
              <div style="background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px">
                <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px">② ID / User Game</div>
                <input v-model="gameId" type="text"
                  :placeholder="`Masukkan User ID ${selectedGame.name}`"
                  style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;font-size:15px;outline:none;color:white;background:rgba(255,255,255,0.06);transition:border 0.2s"
                  @focus="$event.target.style.borderColor='rgba(99,102,241,0.6)'"
                  @blur="$event.target.style.borderColor='rgba(255,255,255,0.1)'"/>
                <div style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:8px">
                  ⚠️ Pastikan ID sudah benar sebelum memilih nominal
                </div>
              </div>

              <!-- Step 3: Pilih Nominal -->
              <div v-if="gameId" style="background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px">
                <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:1px;text-transform:uppercase;margin-bottom:16px">③ Pilih Nominal</div>

                <div v-if="loadingProducts" style="text-align:center;padding:32px;color:rgba(255,255,255,0.3)">
                  Memuat produk...
                </div>
                <div v-else-if="gameProducts.length === 0" style="text-align:center;padding:32px;color:rgba(255,255,255,0.3)">
                  Produk tidak tersedia saat ini
                </div>
                <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px">
                  <button v-for="p in gameProducts" :key="p.buyer_sku_code"
                    @click="selectedProduct = p"
                    style="padding:14px;border-radius:12px;text-align:left;cursor:pointer;border:1.5px solid;transition:all 0.15s"
                    :style="selectedProduct?.buyer_sku_code === p.buyer_sku_code
                      ? 'border-color:rgba(99,102,241,0.8);background:rgba(99,102,241,0.15)'
                      : 'border-color:rgba(255,255,255,0.08);background:rgba(255,255,255,0.04)'"
                    @mouseover="$event.currentTarget.style.borderColor='rgba(99,102,241,0.4)'"
                    @mouseout="$event.currentTarget.style.borderColor=selectedProduct?.buyer_sku_code === p.buyer_sku_code ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.08)'">
                    <div style="font-size:12px;font-weight:700;color:white;margin-bottom:6px;line-height:1.3">{{ cleanGameName(p.product_name) }}</div>
                    <div style="font-size:13px;font-weight:800;color:#818cf8">{{ formatPrice(p.price) }}</div>
                  </button>
                </div>
              </div>

              <!-- Step 4: Email -->
              <div v-if="selectedProduct" style="background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px">
                <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px">④ Email Konfirmasi</div>
                <input v-model="buyerEmail" type="email" placeholder="email@anda.com"
                  style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;font-size:15px;outline:none;color:white;background:rgba(255,255,255,0.06);transition:border 0.2s"
                  @focus="$event.target.style.borderColor='rgba(99,102,241,0.6)';emailConfirmed=false"
                  @blur="$event.target.style.borderColor='rgba(255,255,255,0.1)'"/>

                <div v-if="buyerEmail && buyerEmail.includes('@')"
                  style="margin-top:12px;padding:14px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px">
                  <div style="font-size:12px;color:rgba(251,191,36,0.8);margin-bottom:8px">⚠️ Pastikan email sudah benar:</div>
                  <div style="font-size:14px;font-weight:700;color:white;margin-bottom:10px">{{ buyerEmail }}</div>
                  <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                    <input type="checkbox" v-model="emailConfirmed" style="width:16px;height:16px;accent-color:#6366f1">
                    <span style="font-size:13px;color:rgba(255,255,255,0.6)">Ya, email sudah benar</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Kanan: Order Summary (sticky desktop) -->
            <div v-if="selectedProduct" :style="windowWidth >= 768 ? 'position:sticky;top:80px;height:fit-content' : ''">
              <div style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.1);border-radius:20px;padding:24px">
                <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.5);margin-bottom:16px;letter-spacing:1px;text-transform:uppercase">Ringkasan Pesanan</div>

                <div style="display:flex;align-items:center;gap:12px;padding:14px;background:rgba(255,255,255,0.04);border-radius:12px;margin-bottom:16px">
                  <div style="width:44px;height:44px;border-radius:10px;overflow:hidden;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <img v-if="selectedGame.logo_url" :src="selectedGame.logo_url" style="width:100%;height:100%;object-fit:cover">
                    <span v-else style="font-size:20px">🎮</span>
                  </div>
                  <div>
                    <div style="font-size:13px;font-weight:700;color:white">{{ selectedGame.name }}</div>
                    <div style="font-size:12px;color:rgba(255,255,255,0.4)">{{ cleanGameName(selectedProduct.product_name) }}</div>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
                  <div style="display:flex;justify-content:space-between">
                    <span style="font-size:13px;color:rgba(255,255,255,0.4)">User ID</span>
                    <span style="font-size:13px;font-weight:600;color:white;font-mono">{{ gameId }}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between">
                    <span style="font-size:13px;color:rgba(255,255,255,0.4)">Nominal</span>
                    <span style="font-size:13px;font-weight:600;color:white">{{ cleanGameName(selectedProduct.product_name) }}</span>
                  </div>
                  <div style="height:1px;background:rgba(255,255,255,0.08)"></div>
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-size:14px;font-weight:700;color:white">Total</span>
                    <span style="font-size:20px;font-weight:900;color:#818cf8">{{ formatPrice(selectedProduct.price) }}</span>
                  </div>
                </div>

                <!-- Trust badges -->
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
                  <div v-for="t in trustBadges" :key="t.label"
                    style="text-align:center;padding:10px 4px;background:rgba(255,255,255,0.04);border-radius:10px">
                    <div style="font-size:18px;margin-bottom:4px">{{ t.icon }}</div>
                    <div style="font-size:10px;color:rgba(255,255,255,0.4);font-weight:600;line-height:1.3">{{ t.label }}</div>
                  </div>
                </div>

                <p v-if="orderError" style="color:#f87171;font-size:12px;text-align:center;margin-bottom:10px">⚠️ {{ orderError }}</p>

                <button @click="showConfirm=true"
                  :disabled="ordering || !emailConfirmed"
                  style="width:100%;padding:16px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;transition:all 0.2s;background:linear-gradient(135deg,#6366f1,#4f46e5)"
                  :style="(ordering || !emailConfirmed) ? 'opacity:0.4;cursor:not-allowed' : 'box-shadow:0 4px 20px rgba(99,102,241,0.4)'">
                  {{ ordering ? 'Memproses...' : 'Bayar Sekarang →' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Bottom sticky (mobile) saat ada produk dipilih -->
    <div v-if="selectedProduct && windowWidth < 768"
      style="position:fixed;bottom:0;left:0;right:0;padding:12px 16px;background:rgba(15,17,23,0.98);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.08);z-index:50">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div>
          <div style="font-size:12px;color:rgba(255,255,255,0.4)">Total Bayar</div>
          <div style="font-size:20px;font-weight:900;color:#818cf8">{{ formatPrice(selectedProduct.price) }}</div>
        </div>
        <button @click="showConfirm=true"
          :disabled="ordering || !emailConfirmed"
          style="padding:14px 24px;border:none;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white"
          :style="(ordering || !emailConfirmed) ? 'opacity:0.4' : 'box-shadow:0 4px 16px rgba(99,102,241,0.4)'">
          Bayar →
        </button>
      </div>
    </div>

    <!-- Modal Konfirmasi -->
    <div v-if="showConfirm && selectedProduct"
      style="position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,0.7)"
      @click.self="showConfirm=false">
      <div style="background:#1a1d27;border-radius:24px 24px 0 0;padding:28px 24px;width:100%;max-width:480px;animation:slideUp 0.3s ease">
        <div style="width:40px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;margin:0 auto 20px"></div>
        <h3 style="font-size:18px;font-weight:800;color:white;margin:0 0 20px;text-align:center">Konfirmasi Pesanan</h3>

        <div style="background:rgba(255,255,255,0.04);border-radius:16px;padding:16px;margin-bottom:16px">
          <div v-for="row in confirmRows" :key="row.label"
            style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06)"
            :style="row.last ? 'border-bottom:none;padding-top:12px' : ''">
            <span style="font-size:13px;color:rgba(255,255,255,0.4)">{{ row.label }}</span>
            <span style="font-size:13px;font-weight:700;color:white;text-align:right;max-width:60%">{{ row.value }}</span>
          </div>
        </div>

        <div style="display:flex;gap:12px">
          <button @click="showConfirm=false"
            style="flex:1;padding:14px;border-radius:12px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:none;font-size:14px;font-weight:600;cursor:pointer">
            Batal
          </button>
          <button @click="konfirmasiDanBayar"
            style="flex:2;padding:14px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;border:none;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 4px 16px rgba(99,102,241,0.4)">
            {{ ordering ? 'Memproses...' : 'Ya, Bayar Sekarang' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Voucher Game — miTRANZ' })

const windowWidth = ref(1200)
onMounted(() => {
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', () => { windowWidth.value = window.innerWidth })
})

const loadingBrands = ref(true)
const loadingProducts = ref(false)
const brands = ref<any[]>([])
const allProducts = ref<any[]>([])
const selectedGame = ref<any>(null)
const gameId = ref('')
const selectedProduct = ref<any>(null)
const buyerEmail = ref('')
const emailConfirmed = ref(false)
const ordering = ref(false)
const orderError = ref('')
const showConfirm = ref(false)

const trustBadges = [
  { icon: '⚡', label: 'Proses Instan' },
  { icon: '🔒', label: 'Aman' },
  { icon: '📧', label: 'Email Konfirmasi' },
]

// Load brands & produk
onMounted(async () => {
  try {
    const [brandsData, productsData] = await Promise.all([
      $fetch<any[]>('/api/ppob/game-brands'),
      $fetch<any>('/api/ppob/products?category=Games')
    ])
    brands.value = brandsData
    allProducts.value = productsData?.products ?? []
  } finally {
    loadingBrands.value = false
  }
})

const gameProducts = computed(() => {
  if (!selectedGame.value) return []
  const kw = selectedGame.value.sku_keyword.toLowerCase()
  return allProducts.value.filter((p: any) =>
    p.product_name?.toLowerCase().includes(kw) ||
    p.brand?.toLowerCase().includes(kw)
  )
})

function getProductCount(brand: any) {
  const kw = brand.sku_keyword.toLowerCase()
  return allProducts.value.filter((p: any) =>
    p.product_name?.toLowerCase().includes(kw) ||
    p.brand?.toLowerCase().includes(kw)
  ).length
}

function pilihGame(brand: any) {
  selectedGame.value = brand
  gameId.value = ''
  selectedProduct.value = null
  emailConfirmed.value = false
}

function gantiGame() {
  selectedGame.value = null
  gameId.value = ''
  selectedProduct.value = null
  emailConfirmed.value = false
}

const confirmRows = computed(() => [
  { label: 'Game', value: selectedGame.value?.name },
  { label: 'User ID', value: gameId.value },
  { label: 'Nominal', value: cleanGameName(selectedProduct.value?.product_name) },
  { label: 'Email', value: buyerEmail.value },
  { label: 'Total Bayar', value: formatPrice(selectedProduct.value?.price), last: true },
])

async function konfirmasiDanBayar() {
  if (!selectedProduct.value || !emailConfirmed.value) return
  ordering.value = true
  orderError.value = ''
  showConfirm.value = false
  try {
    const res = await $fetch<any>('/api/ppob/order', {
      method: 'POST',
      body: {
        sku: selectedProduct.value.buyer_sku_code,
        customerNo: gameId.value,
        email: buyerEmail.value,
        price: selectedProduct.value.price,
        productName: selectedProduct.value.product_name,
      }
    })
    if (res.paymentUrl) window.location.href = res.paymentUrl
    else orderError.value = res.message || 'Gagal membuat pesanan'
  } catch (e: any) {
    orderError.value = e?.data?.message || 'Terjadi kesalahan'
  } finally {
    ordering.value = false
  }
}

function cleanGameName(name: string) {
  if (!name) return ''
  return name.replace(/^(Free Fire|Mobile Legends|PUBG Mobile|Voucher Game|Games?)\s*/i, '').trim() || name
}

function formatPrice(p: number) {
  return p ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p) : '-'
}
</script>

<style>
@keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
@keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
@keyframes pulse { 0%,100% { opacity:0.3 } 50% { opacity:0.6 } }
</style>
