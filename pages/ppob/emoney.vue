<template>
  <PpobLayout>

    <!-- Hero - sama dengan games & pulsa -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 20px 32px">
      <div style="max-width:1280px;margin:0 auto">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">💳</div>
          <div>
            <h1 style="font-size:24px;font-weight:900;color:white;margin:0;letter-spacing:-0.5px">E-Money</h1>
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0">Top up dompet digital, proses instan</p>
          </div>
        </div>
      </div>
    </div>

    <div style="max-width:1280px;margin:0 auto;padding:32px 20px 80px">

      <!-- Grid brand E-Money (sebelum pilih) -->
      <div v-if="!selectedBrand">

        <!-- Loading -->
        <div v-if="loadingBrands" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
          <div v-for="i in 4" :key="i"
            style="aspect-ratio:2/3;border-radius:20px;background:#e2e8f0;animation:skeleton 1.5s ease infinite"></div>
        </div>

        <!-- Grid card brand -->
        <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
          <button v-for="brand in brands" :key="brand.id"
            @click="pilihBrand(brand)"
            class="emoney-card"
            style="position:relative;border-radius:20px;overflow:hidden;border:none;cursor:pointer;display:flex;flex-direction:column;background:#1a1a2e;box-shadow:0 4px 16px rgba(0,0,0,0.12);transition:all 0.3s ease;aspect-ratio:2/3">

            <!-- Cover image -->
            <div style="position:relative;flex:1;overflow:hidden;min-height:0">
              <img v-if="brand.banner_url || brand.logo_url"
                :src="brand.banner_url || brand.logo_url"
                :alt="brand.name"
                class="emoney-card-img"
                style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s ease">
              <div v-else
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1e293b,#0f172a);font-size:56px">
                💳
              </div>

              <!-- Badge -->
              <div v-if="brand.badge_text"
                style="position:absolute;top:10px;left:10px;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:800;background:#f59e0b;color:white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
                {{ brand.badge_text }}
              </div>

              <!-- Hover overlay -->
              <div class="emoney-card-hover"
                style="position:absolute;inset:0;background:rgba(99,102,241,0.82);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s ease;gap:8px">
                <div style="font-size:40px;filter:drop-shadow(0 2px 12px rgba(0,0,0,0.4))">⚡</div>
                <div style="font-size:18px;font-weight:900;color:white;letter-spacing:3px;text-transform:uppercase;text-shadow:0 2px 8px rgba(0,0,0,0.4)">Top Up</div>
              </div>
            </div>

            <!-- Info solid bottom -->
            <div style="background:#1a1a2e;padding:12px 14px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0">
              <div style="font-size:13px;font-weight:800;color:white;line-height:1.3;margin-bottom:3px">{{ brand.name }}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.4);font-weight:600">{{ getProductCount(brand) }} produk</div>
            </div>
          </button>
        </div>

        <!-- Trust badges -->
        <div style="margin-top:40px;background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;display:flex;flex-wrap:wrap;gap:24px;justify-content:center">
          <div v-for="t in trustBadges" :key="t.label" style="display:flex;align-items:center;gap:10px">
            <div style="font-size:24px">{{ t.icon }}</div>
            <div>
              <div style="font-size:13px;font-weight:700;color:#1a202c">{{ t.label }}</div>
              <div style="font-size:12px;color:#64748b">{{ t.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form setelah pilih brand -->
      <div v-else>
        <div style="display:grid;gap:24px" :style="isDesktop ? 'grid-template-columns:1fr 340px' : 'grid-template-columns:1fr'">

          <!-- KIRI -->
          <div style="display:flex;flex-direction:column;gap:16px">

            <!-- Brand terpilih -->
            <div style="background:#f5f3ff;border:1.5px solid #c4b5fd;border-radius:20px;padding:16px;display:flex;align-items:center;gap:14px">
              <div style="width:56px;height:40px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:10px;overflow:hidden;background:#ede9fe">
                <img v-if="selectedBrand.logo_url || selectedBrand.banner_url"
                  :src="selectedBrand.logo_url || selectedBrand.banner_url"
                  style="max-width:56px;max-height:38px;object-fit:contain">
                <span v-else style="font-size:24px">💳</span>
              </div>
              <div style="flex:1">
                <div style="font-size:15px;font-weight:800;color:#1a202c">{{ selectedBrand.name }}</div>
                <div style="font-size:12px;color:#6366f1">{{ brandProducts.length }} nominal tersedia</div>
              </div>
              <button @click="gantiBrand"
                style="padding:8px 14px;border-radius:10px;background:white;color:#6366f1;border:1.5px solid #c4b5fd;font-size:12px;font-weight:700;cursor:pointer">
                Ganti
              </button>
            </div>

            <!-- Nomor HP/Akun -->
            <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <div style="width:28px;height:28px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0">1</div>
                <div style="font-size:15px;font-weight:800;color:#1a202c">Nomor HP / Akun</div>
              </div>
              <input v-model="phoneNo" type="tel" inputmode="numeric" placeholder="08xxxxxxxxxx"
                style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c;background:#f8faff;transition:border 0.2s;font-family:monospace;letter-spacing:1px"
                @focus="$event.target.style.borderColor='#6366f1';$event.target.style.background='white'"
                @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"/>
            </div>

            <!-- Pilih Nominal -->
            <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0"
                  :style="phoneNo ? 'background:#6366f1;color:white' : 'background:#e2e8f0;color:#94a3b8'">2</div>
                <div style="font-size:15px;font-weight:800;" :style="phoneNo ? 'color:#1a202c' : 'color:#94a3b8'">Pilih Nominal</div>
              </div>
              <div v-if="!phoneNo" style="text-align:center;padding:24px;color:#94a3b8;font-size:14px">
                Masukkan nomor HP terlebih dahulu
              </div>
              <div v-else-if="brandProducts.length === 0" style="text-align:center;padding:24px;color:#94a3b8;font-size:14px">
                Produk tidak tersedia
              </div>
              <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px">
                <button v-for="p in brandProducts" :key="p.buyer_sku_code"
                  @click="selectedProduct=p"
                  style="padding:14px 12px;border-radius:14px;text-align:left;cursor:pointer;border:1.5px solid;transition:all 0.15s;background:white"
                  :style="selectedProduct?.buyer_sku_code===p.buyer_sku_code
                    ? 'border-color:#6366f1;background:#f5f3ff;box-shadow:0 0 0 3px rgba(99,102,241,0.12)'
                    : 'border-color:#e2e8f0'">
                  <div style="font-size:12px;font-weight:700;color:#1a202c;margin-bottom:6px;line-height:1.4">{{ cleanName(p.product_name) }}</div>
                  <div style="font-size:14px;font-weight:900;color:#6366f1">{{ fmtRp(p.price) }}</div>
                </button>
              </div>
            </div>

            <!-- Email -->
            <div v-if="selectedProduct" style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <div style="width:28px;height:28px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0">3</div>
                <div style="font-size:15px;font-weight:800;color:#1a202c">Email Konfirmasi</div>
              </div>
              <input v-model="buyerEmail" type="email" placeholder="email@anda.com"
                style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c;background:#f8faff;transition:border 0.2s"
                @focus="$event.target.style.borderColor='#6366f1';$event.target.style.background='white';emailConfirmed=false"
                @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"/>
              <div v-if="buyerEmail.includes('@')"
                style="margin-top:12px;padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px">
                <div style="font-size:12px;color:#92400e;margin-bottom:8px">⚠️ Bukti transaksi akan dikirim ke:</div>
                <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:10px">{{ buyerEmail }}</div>
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                  <input type="checkbox" v-model="emailConfirmed" style="width:16px;height:16px;accent-color:#6366f1">
                  <span style="font-size:13px;color:#64748b;font-weight:600">Ya, email sudah benar</span>
                </label>
              </div>
            </div>

            <!-- Tombol mobile -->
            <div v-if="selectedProduct && !isDesktop"
              style="background:white;border-radius:20px;padding:20px;border:1px solid #e2e8f0">
              <p v-if="orderError" style="color:#dc2626;font-size:13px;text-align:center;margin:0 0 10px">⚠️ {{ orderError }}</p>
              <button @click="showConfirm=true" :disabled="!canBuy"
                style="width:100%;padding:16px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white"
                :style="!canBuy ? 'opacity:0.4;cursor:not-allowed' : 'box-shadow:0 4px 20px rgba(99,102,241,0.35)'">
                {{ ordering ? 'Memproses...' : `Bayar ${fmtRp(selectedProduct.price)} →` }}
              </button>
            </div>
          </div>

          <!-- KANAN sticky summary -->
          <div v-if="isDesktop" style="position:sticky;top:130px;height:fit-content">
            <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
              <div style="font-size:13px;font-weight:800;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px">Ringkasan Pesanan</div>

              <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#f5f3ff;border-radius:14px;margin-bottom:20px">
                <div style="width:48px;height:36px;border-radius:10px;overflow:hidden;background:#ede9fe;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <img v-if="selectedBrand.logo_url || selectedBrand.banner_url"
                    :src="selectedBrand.logo_url || selectedBrand.banner_url"
                    style="max-width:48px;max-height:34px;object-fit:contain">
                  <span v-else style="font-size:20px">💳</span>
                </div>
                <div>
                  <div style="font-size:14px;font-weight:700;color:#1a202c">{{ selectedBrand.name }}</div>
                  <div style="font-size:12px;color:#64748b">{{ selectedProduct ? cleanName(selectedProduct.product_name) : 'Pilih nominal' }}</div>
                </div>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
                <div style="display:flex;justify-content:space-between">
                  <span style="font-size:13px;color:#64748b">Nomor</span>
                  <span style="font-size:13px;font-weight:600;color:#1a202c;font-family:monospace">{{ phoneNo || '-' }}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="font-size:13px;color:#64748b">Nominal</span>
                  <span style="font-size:13px;font-weight:600;color:#1a202c;max-width:160px;text-align:right">{{ selectedProduct ? cleanName(selectedProduct.product_name) : '-' }}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="font-size:13px;color:#64748b">Email</span>
                  <span style="font-size:13px;font-weight:600;color:#1a202c;max-width:160px;text-align:right;word-break:break-all">{{ buyerEmail || '-' }}</span>
                </div>
                <div style="height:1px;background:#e2e8f0"></div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:15px;font-weight:800;color:#1a202c">Total</span>
                  <span style="font-size:22px;font-weight:900;color:#6366f1">{{ selectedProduct ? fmtRp(selectedProduct.price) : '-' }}</span>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
                <div v-for="t in ['⚡ Instan','🔒 Aman','📧 Email']" :key="t"
                  style="text-align:center;padding:8px 4px;background:#f5f3ff;border-radius:10px;font-size:11px;font-weight:700;color:#64748b">{{ t }}</div>
              </div>

              <p v-if="orderError" style="color:#dc2626;font-size:12px;text-align:center;margin:0 0 10px">⚠️ {{ orderError }}</p>
              <button @click="showConfirm=true" :disabled="!canBuy"
                style="width:100%;padding:16px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white"
                :style="!canBuy ? 'opacity:0.4;cursor:not-allowed' : 'box-shadow:0 4px 20px rgba(99,102,241,0.35)'">
                {{ ordering ? 'Memproses...' : 'Bayar Sekarang →' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom sticky mobile -->
    <div v-if="selectedProduct && !isDesktop"
      style="position:fixed;bottom:0;left:0;right:0;padding:12px 16px 20px;background:rgba(255,255,255,0.98);backdrop-filter:blur(20px);border-top:1px solid #e2e8f0;z-index:50">
      <div style="display:flex;align-items:center;justify-content:space-between;max-width:600px;margin:0 auto">
        <div>
          <div style="font-size:11px;color:#64748b;font-weight:600">Total Bayar</div>
          <div style="font-size:22px;font-weight:900;color:#6366f1">{{ fmtRp(selectedProduct.price) }}</div>
        </div>
        <button @click="showConfirm=true" :disabled="!canBuy"
          style="padding:14px 28px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white"
          :style="!canBuy ? 'opacity:0.4' : 'box-shadow:0 4px 16px rgba(99,102,241,0.4)'">
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
useHead({ title: 'E-Money — miTRANZ' })

const loadingBrands = ref(true)
const ordering = ref(false)
const brands = ref<any[]>([])
const allProducts = ref<any[]>([])
const selectedBrand = ref<any>(null)
const phoneNo = ref('')
const selectedProduct = ref<any>(null)
const buyerEmail = ref('')
const emailConfirmed = ref(false)
const orderError = ref('')
const showConfirm = ref(false)
const isDesktop = ref(false)

const trustBadges = [
  { icon: '⚡', label: 'Proses Instan', desc: 'Dalam hitungan detik' },
  { icon: '🔒', label: 'Transaksi Aman', desc: 'Enkripsi penuh' },
  { icon: '📧', label: 'Konfirmasi Email', desc: 'Bukti langsung ke inbox' },
  { icon: '🕐', label: 'Layanan 24 Jam', desc: 'Kapan saja' },
]

// SSR fetch
const { data: emoneyBrands } = await useAsyncData('emoney-brands',
  () => $fetch<any[]>('/api/ppob/operator-brands?category=EMoney'),
  { default: () => [] }
)
const { data: emoneyProducts } = await useAsyncData('emoney-products',
  () => $fetch<any>('/api/ppob/products-raw'),
  { default: () => ({ products: [] }) }
)
brands.value = emoneyBrands.value ?? []
allProducts.value = emoneyProducts.value?.products ?? []
loadingBrands.value = false

onMounted(() => {
  isDesktop.value = window.innerWidth >= 768
  window.addEventListener('resize', () => { isDesktop.value = window.innerWidth >= 768 })
})

const brandProducts = computed(() => {
  if (!selectedBrand.value) return []
  const kw = selectedBrand.value.sku_keyword.toUpperCase()
  return allProducts.value.filter((p: any) =>
    p.brand?.toUpperCase().includes(kw) ||
    p.product_name?.toUpperCase().includes(kw)
  )
})

function getProductCount(brand: any) {
  const kw = brand.sku_keyword.toUpperCase()
  return allProducts.value.filter((p: any) =>
    p.brand?.toUpperCase().includes(kw) ||
    p.product_name?.toUpperCase().includes(kw)
  ).length
}

function pilihBrand(b: any) {
  selectedBrand.value = b
  selectedProduct.value = null
  phoneNo.value = ''
  emailConfirmed.value = false
}

function gantiBrand() {
  selectedBrand.value = null
  selectedProduct.value = null
  phoneNo.value = ''
  emailConfirmed.value = false
}

const canBuy = computed(() =>
  selectedProduct.value && phoneNo.value && emailConfirmed.value && !ordering.value
)

const confirmRows = computed(() => [
  { label: 'E-Money', value: selectedBrand.value?.name },
  { label: 'Nomor', value: phoneNo.value },
  { label: 'Nominal', value: cleanName(selectedProduct.value?.product_name) },
  { label: 'Email', value: buyerEmail.value },
  { label: 'Total Bayar', value: fmtRp(selectedProduct.value?.price), last: true },
])

async function bayar() {
  if (!canBuy.value) return
  ordering.value = true
  orderError.value = ''
  showConfirm.value = false
  try {
    const res = await $fetch<any>('/api/ppob/order', {
      method: 'POST',
      body: {
        customer_no: phoneNo.value,
        email: buyerEmail.value,
        product: selectedProduct.value,
      }
    })
    const payUrl = res.paymentUrl || res.invoice?.payment_url
    if (payUrl) window.location.href = payUrl
    else orderError.value = res.message || 'Gagal membuat pesanan'
  } catch (e: any) {
    orderError.value = e?.data?.message || 'Terjadi kesalahan'
  } finally { ordering.value = false }
}

function cleanName(name: string) {
  if (!name) return ''
  const brand = selectedBrand.value?.name || ''
  return name.replace(new RegExp(`^(${brand}|Top Up|Voucher)\\s*`, 'i'), '').trim() || name
}
function fmtRp(n: number) {
  return n ? new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 }).format(n) : '-'
}
</script>

<style>
@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
@keyframes skeleton { 0%,100% { opacity:0.5 } 50% { opacity:1 } }
.emoney-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.25) !important; }
.emoney-card:hover .emoney-card-img { transform: scale(1.07); }
.emoney-card:hover .emoney-card-hover { opacity: 1 !important; }
</style>
