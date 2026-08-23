<template>
  <div style="min-height:100vh;background:#f0f4fa;padding:24px 16px">
    <div style="max-width:600px;margin:0 auto">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
        <a href="/dashboard" style="width:36px;height:36px;border-radius:10px;background:white;display:flex;align-items:center;justify-content:center;text-decoration:none;border:1px solid #e2e8f0">←</a>
        <div>
          <h1 style="font-size:20px;font-weight:800;color:#1a202c;margin:0">Top Up E-Wallet</h1>
          <p style="font-size:13px;color:#64748b;margin:0">GoPay, OVO, DANA, ShopeePay instan</p>
        </div>
      </div>

      <!-- Pilih E-Wallet -->
      <div style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:14px">① Pilih E-Wallet</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          <button v-for="brand in brands" :key="brand.name"
            @click="selectBrand(brand.name)"
            style="padding:16px 8px;border-radius:14px;cursor:pointer;transition:all 0.2s;border:2px solid;display:flex;flex-direction:column;align-items:center;gap:8px"
            :style="selectedBrand === brand.name ? 'border-color:#1a4fa0;background:#eff6ff' : 'border-color:#e2e8f0;background:white'">
            <div style="height:32px;display:flex;align-items:center;justify-content:center">
              <img v-if="brand.logo" :src="brand.logo" :alt="brand.name" style="max-width:64px;max-height:30px;object-fit:contain"/>
              <span v-else style="font-size:24px">{{ brand.icon }}</span>
            </div>
            <span style="font-weight:700;color:#1a202c;font-size:12px">{{ brand.name }}</span>
          </button>
        </div>
      </div>

      <!-- Nomor Akun -->
      <div v-if="selectedBrand" style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:12px">② Nomor HP / Akun {{ selectedBrand }}</div>
        <input v-model="phoneNo" type="tel" placeholder="08xxxxxxxxxx"
          style="width:100%;box-sizing:border-box;padding:14px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c"
          @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>
      </div>

      <!-- Pilih Nominal -->
      <div v-if="selectedBrand && phoneNo" style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:12px">③ Pilih Nominal</div>
        <div v-if="brandProducts.length === 0" style="text-align:center;padding:32px;background:#fffbeb;border-radius:16px;border:1px solid #fde68a">
          <div style="font-size:40px;margin-bottom:12px">🔧</div>
          <div style="font-weight:700;color:#92400e;font-size:15px;margin-bottom:6px">Layanan {{ selectedBrand }} Sementara Tidak Tersedia</div>
          <div style="color:#b45309;font-size:13px">Produk sedang dalam proses penambahan provider baru.</div>
        </div>
        <div v-else style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button v-for="p in brandProducts" :key="p.buyer_sku_code"
            @click="selectedProduct = p"
            style="padding:14px;border-radius:12px;text-align:left;cursor:pointer;border:2px solid;transition:all 0.2s"
            :style="selectedProduct?.buyer_sku_code === p.buyer_sku_code ? 'border-color:#1a4fa0;background:#eff6ff' : 'border-color:#e2e8f0;background:white'">
            <div style="font-weight:800;color:#1a202c;font-size:14px;margin-bottom:4px">{{ formatNominal(p.product_name) }}</div>
            <div style="font-weight:800;color:#1a4fa0;font-size:13px">{{ formatPrice(p.price) }}</div>
          </button>
        </div>
      </div>

      <!-- Konfirmasi -->
      <div v-if="selectedProduct" style="background:white;border-radius:20px;padding:20px;border:1px solid #e2e8f0">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#64748b;font-size:13px">E-Wallet</span><span style="font-weight:600;color:#1a202c;font-size:13px">{{ selectedBrand }}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#64748b;font-size:13px">No HP / Akun</span><span style="font-weight:600;color:#1a202c;font-size:13px">{{ phoneNo }}</span></div>
        <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0">
          <span style="font-weight:700;color:#1a202c">Total Bayar</span>
          <span style="font-weight:800;color:#1a4fa0;font-size:16px">{{ formatPrice(selectedProduct.price) }}</span>
        </div>
        <div style="margin-top:12px;padding:10px;background:#fffbeb;border-radius:10px;font-size:12px;color:#92400e;border:1px solid #fde68a">
          <!-- Email -->
          <div style="margin-top:12px">
            <label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:6px">Email untuk bukti transaksi</label>
            <input v-model="buyerEmail" type="email" placeholder="email@anda.com"
              style="width:100%;box-sizing:border-box;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none" />
          </div>
        </div>
        <p v-if="orderError" style="color:#dc2626;font-size:13px;text-align:center;margin:8px 0 0">⚠️ {{ orderError }}</p>
        <div style="display:flex;gap:12px;margin-top:12px">
          <button @click="step = 1" style="flex:1;padding:14px;background:white;color:#64748b;border:2px solid #e2e8f0;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer">← Kembali</button>
          <button @click="bayar" :disabled="ordering"
            style="flex:2;padding:14px;background:#1a4fa0;color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer"
            :style="ordering ? 'opacity:0.6' : ''">
            {{ ordering ? 'Memproses...' : 'Bayar Sekarang →' }}
          </button>
        </div>
      </div>
    </div>
    <!-- Link riwayat -->
    <div style="text-align:center;margin-top:16px">
      <a href="/ppob/riwayat" style="font-size:13px;color:#1a4fa0;text-decoration:none;font-weight:600">
        📋 Cek Riwayat Transaksi
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Top Up E-Wallet — miTRANZ' })

const allProducts = ref<any[]>([])
const buyerEmail = ref('')
const ordering = ref(false)
const orderError = ref('')

async function bayar() {
  if (!buyerEmail.value) { orderError.value = 'Email wajib diisi'; return }
  if (!buyerEmail.value.includes('@')) { orderError.value = 'Email tidak valid'; return }
  ordering.value = true
  orderError.value = ''
  try {
    const res: any = await $fetch('/api/ppob/order', {
      method: 'POST',
      body: {
        customer_no: nomorHP.value,
        product: selectedProduct.value,
        email: buyerEmail.value,
        name: buyerEmail.value,
      }
    })
    if (res.invoice?.id) {
      window.location.href = `https://paymen.mitranz.com/invoices/${res.invoice.id}`
    }
  } catch (e: any) {
    orderError.value = e?.data?.message || 'Gagal membuat pesanan'
  } finally {
    ordering.value = false
  }
}

const loading = ref(false)
const selectedBrand = ref('')
const phoneNo = ref('')
const selectedProduct = ref<any>(null)

const brands = [
  { name: 'DANA', icon: '💙', logo: '/images/ewallet/dana.png' },
  { name: 'GO PAY', icon: '💚', logo: '/images/ewallet/gopay.png' },
  { name: 'OVO', icon: '💜', logo: '/images/ewallet/ovo.jpg' },
  { name: 'SHOPEE PAY', icon: '🧡', logo: '/images/ewallet/shopeepay.png' },
]

const formatPrice = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n)
const formatNominal = (name: string) => name.replace(/DANA |GO PAY |OVO |SHOPEE PAY /i, '')
const brandProducts = computed(() => allProducts.value.filter(p => p.brand === selectedBrand.value))

function selectBrand(brand: string) { selectedBrand.value = brand; phoneNo.value = ''; selectedProduct.value = null }

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/ppob/emoney/products')
    allProducts.value = res.products || []
  } finally { loading.value = false }
})
</script>
