<template>
  <div style="min-height:100vh;background:#f0f4fa;padding:24px 16px">
    <div style="max-width:600px;margin:0 auto">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
        <a href="/dashboard" style="width:36px;height:36px;border-radius:10px;background:white;display:flex;align-items:center;justify-content:center;text-decoration:none;border:1px solid #e2e8f0">←</a>
        <div>
          <h1 style="font-size:20px;font-weight:800;color:#1a202c;margin:0">TV Kabel</h1>
          <p style="font-size:13px;color:#64748b;margin:0">Bayar tagihan TV kabel</p>
        </div>
      </div>

      <!-- Nomor Pelanggan -->
      <div style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:12px">① Nomor Pelanggan</div>
        <input v-model="nomorPelanggan" type="text" placeholder="Masukkan nomor pelanggan TV"
          style="width:100%;box-sizing:border-box;padding:14px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c"
          @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>
      </div>

      <!-- Pilih Paket -->
      <div v-if="nomorPelanggan" style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:12px">② Pilih Paket</div>
        <div v-if="loading" style="text-align:center;color:#64748b;padding:20px">Memuat...</div>
        <div v-else-if="products.length === 0" style="text-align:center;padding:32px;background:#fffbeb;border-radius:16px;border:1px solid #fde68a">
          <div style="font-size:40px;margin-bottom:12px">🔧</div>
          <div style="font-weight:700;color:#92400e;font-size:15px;margin-bottom:6px">Layanan TV Kabel Sementara Tidak Tersedia</div>
          <div style="color:#b45309;font-size:13px">Produk sedang dalam proses penambahan provider baru.</div>
        </div>
        <div v-else style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button v-for="p in products" :key="p.buyer_sku_code"
            @click="selectedProduct = p"
            style="padding:14px;border-radius:12px;text-align:left;cursor:pointer;border:2px solid;transition:all 0.2s"
            :style="selectedProduct?.buyer_sku_code === p.buyer_sku_code ? 'border-color:#1a4fa0;background:#eff6ff' : 'border-color:#e2e8f0;background:white'">
            <div style="font-weight:800;color:#1a202c;font-size:13px;margin-bottom:4px">{{ p.product_name }}</div>
            <div style="font-weight:800;color:#1a4fa0;font-size:13px">{{ formatPrice(p.price) }}</div>
          </button>
        </div>
      </div>

      <!-- Konfirmasi -->
      <div v-if="selectedProduct" style="background:white;border-radius:20px;padding:20px;border:1px solid #e2e8f0">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#64748b;font-size:13px">No. Pelanggan</span><span style="font-weight:600;color:#1a202c;font-size:13px">{{ nomorPelanggan }}</span></div>
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
useHead({ title: 'TV Kabel — miTRANZ' })
const products = ref<any[]>([])
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
        customer_no: nomorPelanggan.value,
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
const nomorPelanggan = ref('')
const selectedProduct = ref<any>(null)
const formatPrice = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n)
onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/ppob/tv/products')
    products.value = res.products || []
  } finally { loading.value = false }
})
</script>
