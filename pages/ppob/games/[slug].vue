<template>
  <PpobLayout>

    <div v-if="loadingBrand" style="max-width:1280px;margin:0 auto;padding:80px 20px;text-align:center;color:#64748b">
      <div style="font-size:40px;margin-bottom:12px">⏳</div>
      <div>Memuat...</div>
    </div>

    <div v-else-if="!brand" style="max-width:1280px;margin:0 auto;padding:80px 20px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">🎮</div>
      <h2 style="font-size:20px;font-weight:800;color:#1a202c;margin:0 0 8px">Game tidak ditemukan</h2>
      <a href="/ppob/games" style="color:#1a4fa0;font-weight:600;text-decoration:none">← Kembali ke daftar game</a>
    </div>

    <template v-else>
      <!-- Banner -->
      <div style="position:relative;height:200px;overflow:hidden;background:#1a1a2e">
        <img v-if="brand.banner_url || brand.logo_url"
          :src="brand.banner_url || brand.logo_url"
          :alt="brand.name"
          style="width:100%;height:100%;object-fit:cover;filter:blur(2px) brightness(0.5)">
        <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,26,46,0.85),rgba(15,52,96,0.75))"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;padding:0 32px">
          <div style="display:flex;align-items:center;gap:16px;max-width:1280px;width:100%;margin:0 auto">
            <div style="width:72px;height:72px;border-radius:16px;overflow:hidden;border:3px solid rgba(255,255,255,0.3);flex-shrink:0;background:#0f3460">
              <img v-if="brand.logo_url || brand.banner_url"
                :src="brand.logo_url || brand.banner_url"
                style="width:100%;height:100%;object-fit:cover">
              <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px">🎮</div>
            </div>
            <div>
              <div v-if="brand.badge_text"
                style="display:inline-block;padding:2px 10px;border-radius:100px;font-size:10px;font-weight:800;background:#f59e0b;color:white;margin-bottom:6px">
                {{ brand.badge_text }}
              </div>
              <h1 style="font-size:26px;font-weight:900;color:white;margin:0;letter-spacing:-0.5px">{{ brand.name }}</h1>
              <div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px">{{ gameProducts.length }} produk tersedia</div>
            </div>
          </div>
        </div>
        <a href="/ppob/games" style="position:absolute;top:16px;left:32px;font-size:12px;color:rgba(255,255,255,0.6);text-decoration:none">
          ← Game
        </a>
      </div>

      <!-- Konten -->
      <div style="max-width:1280px;margin:0 auto;padding:24px 20px 100px">
        <div style="display:grid;gap:24px" :style="isDesktop ? 'grid-template-columns:1fr 340px' : 'grid-template-columns:1fr'">

          <!-- KIRI: Form -->
          <div style="display:flex;flex-direction:column;gap:16px">

            <!-- Step 1: User ID -->
            <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <div style="width:28px;height:28px;border-radius:50%;background:#1a4fa0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0">1</div>
                <div style="font-size:15px;font-weight:800;color:#1a202c">Informasi Akun</div>
              </div>
              <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:8px">
                User ID <span style="color:#dc2626">*</span>
              </label>
              <input v-model="gameId" type="text"
                :placeholder="`Masukkan User ID ${brand.name}`"
                style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c;background:#f8faff;transition:border 0.2s"
                @focus="$event.target.style.borderColor='#6366f1';$event.target.style.background='white'"
                @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"/>
              <div style="font-size:12px;color:#94a3b8;margin-top:8px">⚠️ Pastikan ID benar. Transaksi berhasil tidak dapat dibatalkan.</div>
            </div>

            <!-- Step 2: Pilih Nominal -->
            <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0"
                  :style="gameId ? 'background:#1a4fa0;color:white' : 'background:#e2e8f0;color:#94a3b8'">2</div>
                <div style="font-size:15px;font-weight:800;" :style="gameId ? 'color:#1a202c' : 'color:#94a3b8'">Pilih Nominal</div>
              </div>

              <div v-if="!gameId" style="text-align:center;padding:24px;color:#94a3b8;font-size:14px">
                Masukkan User ID terlebih dahulu
              </div>
              <div v-else-if="gameProducts.length === 0" style="text-align:center;padding:24px">
                <div style="font-size:32px;margin-bottom:8px">😔</div>
                <div style="font-size:14px;color:#64748b">Produk tidak tersedia saat ini</div>
              </div>
              <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px">
                <button v-for="p in gameProducts" :key="p.buyer_sku_code"
                  @click="selectedProduct = p"
                  style="padding:14px 12px;border-radius:14px;text-align:left;cursor:pointer;border:1.5px solid #e2e8f0;transition:all 0.15s;background:white"
                  :style="selectedProduct && selectedProduct.buyer_sku_code === p.buyer_sku_code
                    ? 'border-color:#6366f1;background:#f5f3ff;box-shadow:0 0 0 3px rgba(99,102,241,0.15)'
                    : 'border-color:#e2e8f0;background:white'">
                  <div style="font-size:12px;font-weight:700;color:#1a202c;margin-bottom:6px;line-height:1.4">{{ cleanName(p.product_name) }}</div>
                  <div style="font-size:14px;font-weight:900;color:#6366f1">{{ fmtRp(p.price) }}</div>
                </button>
              </div>
            </div>

            <!-- Step 3: Email -->
            <div v-if="selectedProduct" style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <div style="width:28px;height:28px;border-radius:50%;background:#1a4fa0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0">3</div>
                <div style="font-size:15px;font-weight:800;color:#1a202c">Email Konfirmasi</div>
              </div>
              <input v-model="buyerEmail" type="email" placeholder="email@anda.com"
                style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c;background:#f8faff;transition:border 0.2s"
                @focus="$event.target.style.borderColor='#6366f1';$event.target.style.background='white';emailConfirmed=false"
                @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"/>
              <div v-if="buyerEmail && buyerEmail.includes('@')"
                style="margin-top:12px;padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px">
                <div style="font-size:12px;color:#92400e;margin-bottom:8px">⚠️ Token akan dikirim ke email ini:</div>
                <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:10px">{{ buyerEmail }}</div>
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                  <input type="checkbox" v-model="emailConfirmed" style="width:16px;height:16px;accent-color:#6366f1">
                  <span style="font-size:13px;color:#64748b;font-weight:600">Ya, email sudah benar</span>
                </label>
              </div>
            </div>

            <!-- Tombol bayar mobile -->
            <div v-if="selectedProduct && !isDesktop"
              style="background:white;border-radius:20px;padding:20px;border:1px solid #e2e8f0">
              <p v-if="orderError" style="color:#dc2626;font-size:13px;text-align:center;margin:0 0 10px">⚠️ {{ orderError }}</p>
              <button @click="showConfirm=true" :disabled="!canBuy"
                style="width:100%;padding:16px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;color:white"
                :style="canBuy ? 'background:linear-gradient(135deg,#6366f1,#4f46e5);box-shadow:0 4px 20px rgba(99,102,241,0.35)' : 'background:#e2e8f0;cursor:not-allowed'">
                {{ ordering ? 'Memproses...' : 'Bayar ' + fmtRp(selectedProduct.price) + ' →' }}
              </button>
            </div>
          </div>

          <!-- KANAN: Sticky Summary -->
          <div v-if="isDesktop" style="position:sticky;top:130px;height:fit-content">
            <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
              <div style="font-size:13px;font-weight:800;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px">Ringkasan Pesanan</div>

              <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#f8faff;border-radius:14px;margin-bottom:20px">
                <div style="width:48px;height:48px;border-radius:12px;overflow:hidden;background:#e2e8f0;flex-shrink:0">
                  <img v-if="brand.logo_url || brand.banner_url"
                    :src="brand.logo_url || brand.banner_url"
                    style="width:100%;height:100%;object-fit:cover">
                  <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px">🎮</div>
                </div>
                <div>
                  <div style="font-size:14px;font-weight:700;color:#1a202c">{{ brand.name }}</div>
                  <div style="font-size:12px;color:#64748b">{{ selectedProduct ? cleanName(selectedProduct.product_name) : 'Pilih nominal' }}</div>
                </div>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
                <div style="display:flex;justify-content:space-between">
                  <span style="font-size:13px;color:#64748b">User ID</span>
                  <span style="font-size:13px;font-weight:600;color:#1a202c;font-family:monospace">{{ gameId || '-' }}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="font-size:13px;color:#64748b">Nominal</span>
                  <span style="font-size:13px;font-weight:600;color:#1a202c">{{ selectedProduct ? cleanName(selectedProduct.product_name) : '-' }}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="font-size:13px;color:#64748b">Email</span>
                  <span style="font-size:13px;font-weight:600;color:#1a202c;max-width:160px;text-align:right;word-break:break-all">{{ buyerEmail || '-' }}</span>
                </div>
                <div style="height:1px;background:#e2e8f0;margin:4px 0"></div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:15px;font-weight:800;color:#1a202c">Total</span>
                  <span style="font-size:22px;font-weight:900;color:#6366f1">{{ selectedProduct ? fmtRp(selectedProduct.price) : '-' }}</span>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
                <div v-for="t in ['⚡ Instan','🔒 Aman','📧 Email']" :key="t"
                  style="text-align:center;padding:8px 4px;background:#f8faff;border-radius:10px;font-size:11px;font-weight:700;color:#64748b">{{ t }}</div>
              </div>

              <p v-if="orderError" style="color:#dc2626;font-size:12px;text-align:center;margin:0 0 10px">⚠️ {{ orderError }}</p>
              <button @click="showConfirm=true" :disabled="!canBuy"
                style="width:100%;padding:16px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;color:white;transition:all 0.2s"
                :style="canBuy ? 'background:linear-gradient(135deg,#6366f1,#4f46e5);box-shadow:0 4px 20px rgba(99,102,241,0.35)' : 'background:#e2e8f0;cursor:not-allowed'">
                {{ ordering ? 'Memproses...' : 'Bayar Sekarang →' }}
              </button>

              <div style="text-align:center;margin-top:12px">
                <a href="/ppob/games" style="font-size:12px;color:#94a3b8;text-decoration:none">← Pilih game lain</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>

    <!-- Bottom sticky mobile -->
    <div v-if="selectedProduct && !isDesktop"
      style="position:fixed;bottom:0;left:0;right:0;padding:12px 16px 20px;background:rgba(255,255,255,0.98);backdrop-filter:blur(20px);border-top:1px solid #e2e8f0;z-index:50">
      <div style="display:flex;align-items:center;justify-content:space-between;max-width:600px;margin:0 auto">
        <div>
          <div style="font-size:11px;color:#64748b;font-weight:600">Total Bayar</div>
          <div style="font-size:22px;font-weight:900;color:#6366f1">{{ fmtRp(selectedProduct.price) }}</div>
        </div>
        <button @click="showConfirm=true" :disabled="!canBuy"
          style="padding:14px 28px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;color:white"
          :style="canBuy ? 'background:linear-gradient(135deg,#6366f1,#4f46e5);box-shadow:0 4px 16px rgba(99,102,241,0.4)' : 'background:#e2e8f0'">
          Bayar →
        </button>
      </div>
    </div>

    <!-- Modal Konfirmasi -->
    <div v-if="showConfirm && selectedProduct"
      style="position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,0.6)"
      @click.self="showConfirm=false">
      <div style="background:white;border-radius:24px 24px 0 0;padding:28px 24px 36px;width:100%;max-width:480px;animation:slideUp 0.3s ease">
        <div style="width:40px;height:4px;background:#e2e8f0;border-radius:2px;margin:0 auto 20px"></div>
        <h3 style="font-size:18px;font-weight:800;color:#1a202c;margin:0 0 20px;text-align:center">Konfirmasi Pesanan</h3>
        <div style="background:#f8faff;border-radius:16px;padding:16px;margin-bottom:20px">
          <div v-for="row in confirmRows" :key="row.label"
            style="display:flex;justify-content:space-between;padding:8px 0"
            :style="row.last ? 'border-top:1px solid #e2e8f0;padding-top:12px;margin-top:4px' : 'border-bottom:1px solid #f1f5f9'">
            <span style="font-size:13px;color:#64748b">{{ row.label }}</span>
            <span style="font-size:13px;font-weight:700;color:#1a202c;text-align:right;max-width:60%">{{ row.value }}</span>
          </div>
        </div>
        <div style="display:flex;gap:12px">
          <button @click="showConfirm=false"
            style="flex:1;padding:14px;border-radius:12px;background:#f1f5f9;color:#64748b;border:none;font-size:14px;font-weight:700;cursor:pointer">Batal</button>
          <button @click="bayar" :disabled="ordering"
            style="flex:2;padding:14px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;border:none;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 4px 16px rgba(99,102,241,0.4)">
            {{ ordering ? 'Memproses...' : 'Ya, Bayar Sekarang' }}
          </button>
        </div>
      </div>
    </div>

  </PpobLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const slugVal = route.params.slug as string

useHead({ title: 'Top Up Game — miTRANZ' })

const loadingBrand = ref(true)
const brand = ref<any>(null)
const allProducts = ref<any[]>([])
const gameId = ref('')
const selectedProduct = ref<any>(null)
const buyerEmail = ref('')
const emailConfirmed = ref(false)
const ordering = ref(false)
const orderError = ref('')
const showConfirm = ref(false)
const isDesktop = ref(false)

const canBuy = computed(() =>
  !!selectedProduct.value && !!gameId.value && emailConfirmed.value && !ordering.value
)

const gameProducts = computed(() => allProducts.value)

const confirmRows = computed(() => [
  { label: 'Game', value: brand.value?.name || '-' },
  { label: 'User ID', value: gameId.value || '-' },
  { label: 'Nominal', value: selectedProduct.value ? cleanName(selectedProduct.value.product_name) : '-' },
  { label: 'Email', value: buyerEmail.value || '-' },
  { label: 'Total Bayar', value: selectedProduct.value ? fmtRp(selectedProduct.value.price) : '-', last: true },
])

onMounted(async () => {
  isDesktop.value = window.innerWidth >= 768
  window.addEventListener('resize', () => { isDesktop.value = window.innerWidth >= 768 })
  try {
    const [brandsData, productsData] = await Promise.all([
      $fetch<any[]>('/api/ppob/game-brands'),
      $fetch<any>('/api/ppob/products-raw')
    ])
    const found = brandsData.find((b: any) => b.slug === slugVal)
    brand.value = found || null
    if (found) {
      const kw = found.sku_keyword.toLowerCase()
      const allGames = (productsData?.products ?? []).filter((p: any) => p.category === 'Games')

      allProducts.value = allGames.filter((p: any) =>
        p.brand?.toLowerCase().includes(kw) ||
        p.product_name?.toLowerCase().includes(kw)
      )

    }
  } finally {
    loadingBrand.value = false
  }
})

async function bayar() {
  if (!canBuy.value || !selectedProduct.value) return
  ordering.value = true
  orderError.value = ''
  showConfirm.value = false
  try {
    const res = await $fetch<any>('/api/ppob/order', {
      method: 'POST',
      body: {
        customer_no: gameId.value,
        email: buyerEmail.value,
        product: selectedProduct.value,
      }
    })
    const payUrl = res.paymentUrl || res.invoice?.payment_url
    if (payUrl) window.location.href = payUrl
    else orderError.value = res.message || 'Gagal membuat pesanan'
  } catch (e: any) {
    orderError.value = e?.data?.message || 'Terjadi kesalahan'
  } finally {
    ordering.value = false
  }
}

function cleanName(name: string) {
  if (!name) return ''
  const b = brand.value?.name || ''
  return name.replace(new RegExp('^' + b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*', 'i'), '')
    .replace(/^(Voucher|Game|Top Up|Diamond)\s*/i, '').trim() || name
}

function fmtRp(n: number) {
  if (!n) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}
</script>

<style>
@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
</style>
