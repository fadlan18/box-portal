<template>
  <div style="min-height:100vh;background:#f0f4fa;padding:24px 16px">
    <div style="max-width:600px;margin:0 auto">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
        <a href="/dashboard" style="width:36px;height:36px;border-radius:10px;background:white;display:flex;align-items:center;justify-content:center;text-decoration:none;border:1px solid #e2e8f0">←</a>
        <div>
          <h1 style="font-size:20px;font-weight:800;color:#1a202c;margin:0">Pulsa & Paket Data</h1>
          <p style="font-size:13px;color:#64748b;margin:0">Semua operator tersedia</p>
        </div>
      </div>

      <!-- Pilih Operator -->
      <div style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:14px">Pilih Operator</div>
        <div v-if="loading" style="text-align:center;color:#64748b;padding:20px">Memuat...</div>
        <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px">
          <button v-for="(prods, brand) in grouped" :key="brand"
            @click="selectOperator(String(brand))"
            style="padding:12px 8px;border-radius:12px;cursor:pointer;transition:all 0.2s;border:2px solid;display:flex;flex-direction:column;align-items:center;gap:6px"
            :style="selectedOperator === brand ? 'border-color:#1a4fa0;background:#eff6ff' : 'border-color:#e2e8f0;background:white'">
            <div style="width:48px;height:32px;display:flex;align-items:center;justify-content:center">
              <img v-if="getOperatorLogo(String(brand))" :src="getOperatorLogo(String(brand))" :alt="String(brand)" style="max-width:48px;max-height:30px;object-fit:contain"/>
              <span v-else style="font-size:22px">📱</span>
            </div>
            <div style="font-weight:700;color:#1a202c;font-size:11px;text-align:center">{{ brand }}</div>
          </button>
        </div>
      </div>

      <!-- Nomor HP -->
      <div v-if="selectedOperator" style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:12px">② Nomor HP</div>
        <input v-model="phoneNo" type="tel" placeholder="08xxxxxxxxxx"
          style="width:100%;box-sizing:border-box;padding:14px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c"
          @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>
      </div>

      <!-- Tab Pulsa/Data -->
      <div v-if="selectedOperator && phoneNo" style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <button @click="activeTab='Pulsa'"
            style="padding:8px 20px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;border:none"
            :style="activeTab==='Pulsa' ? 'background:#1a4fa0;color:white' : 'background:#f1f5f9;color:#64748b'">
            📞 Pulsa
          </button>
          <button @click="activeTab='Data'"
            style="padding:8px 20px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;border:none"
            :style="activeTab==='Data' ? 'background:#1a4fa0;color:white' : 'background:#f1f5f9;color:#64748b'">
            📶 Data & Paket
          </button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button v-for="p in filteredProducts" :key="p.buyer_sku_code"
            @click="selectedProduct = p"
            style="padding:14px;border-radius:12px;text-align:left;cursor:pointer;border:2px solid;transition:all 0.2s"
            :style="selectedProduct?.buyer_sku_code === p.buyer_sku_code ? 'border-color:#1a4fa0;background:#eff6ff' : 'border-color:#e2e8f0;background:white'">
            <div style="font-weight:800;color:#1a202c;font-size:13px;margin-bottom:2px">{{ cleanName(p.product_name) }}</div>
            <div style="font-size:11px;color:#64748b;margin-bottom:6px">{{ p.desc }}</div>
            <div style="font-weight:800;color:#1a4fa0;font-size:13px">{{ formatPrice(p.price) }}</div>
          </button>
        </div>
      </div>

      <!-- Konfirmasi -->
      <div v-if="selectedProduct" style="background:white;border-radius:20px;padding:20px;border:1px solid #e2e8f0;margin-bottom:16px">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:12px">Konfirmasi</div>
        <div style="space-y:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#64748b;font-size:13px">Operator</span><span style="font-weight:600;color:#1a202c;font-size:13px">{{ selectedOperator }}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#64748b;font-size:13px">Nomor HP</span><span style="font-weight:600;color:#1a202c;font-size:13px">{{ phoneNo }}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#64748b;font-size:13px">Produk</span><span style="font-weight:600;color:#1a202c;font-size:13px">{{ cleanName(selectedProduct.product_name) }}</span></div>
          <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0">
            <span style="font-weight:700;color:#1a202c">Total Bayar</span>
            <span style="font-weight:800;color:#1a4fa0;font-size:16px">{{ formatPrice(selectedProduct.price) }}</span>
          </div>
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
useHead({ title: 'Pulsa & Paket Data — miTRANZ' })

const { getOperatorLogo } = useOperatorLogo()
const allProducts = ref<any[]>([])
const grouped = ref<Record<string, any[]>>({})
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
const selectedOperator = ref('')
const phoneNo = ref('')
const activeTab = ref('Pulsa')
const selectedProduct = ref<any>(null)

const formatPrice = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n)
const cleanName = (name: string) => name.replace(/TELKOMSEL|INDOSAT|XL|AXIS|TRI|THREE|SMARTFREN|BY\.U|BYU/gi, '').trim()

const operatorProducts = computed(() => allProducts.value.filter(p => p.brand === selectedOperator.value))
const filteredProducts = computed(() => operatorProducts.value.filter(p => {
  if (activeTab.value === 'Pulsa') return p.category === 'Pulsa'
  return ['Data', 'Paket SMS & Telpon', 'Masa Aktif', 'Aktivasi Perdana'].includes(p.category)
}))

function selectOperator(brand: string) {
  selectedOperator.value = brand; selectedProduct.value = null
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/ppob/pulsa/products')
    allProducts.value = res.products || []
    grouped.value = res.grouped || {}
  } finally { loading.value = false }
})
</script>
