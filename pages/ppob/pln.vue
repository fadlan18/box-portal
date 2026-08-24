<template>
  <div style="min-height:100vh;background:#f0f4fa;padding:16px 12px">
    <div style="max-width:600px;margin:0 auto">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
        <a href="/dashboard" style="width:36px;height:36px;border-radius:10px;background:white;display:flex;align-items:center;justify-content:center;text-decoration:none;border:1px solid #e2e8f0">←</a>
        <div>
          <h1 style="font-size:20px;font-weight:800;color:#1a202c;margin:0">Token Listrik PLN</h1>
          <p style="font-size:13px;color:#64748b;margin:0">Beli token listrik prabayar instan</p>
        </div>
      </div>

      <!-- Step 1: Nomor Meter -->
      <div v-if="step === 1" style="background:white;border-radius:20px;padding:24px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:15px;font-weight:700;color:#1a202c;margin-bottom:16px">① Nomor Meter / ID Pelanggan</div>
        <input v-model="nomorMeter" type="text" placeholder="Masukkan nomor meter PLN"
          style="width:100%;box-sizing:border-box;padding:14px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c"
          @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>

        <!-- Nomor tersimpan -->
        <div v-if="savedNumbers.length" style="margin-top:10px">
          <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;font-weight:600">TERSIMPAN:</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <button v-for="num in savedNumbers" :key="num"
              @click="nomorMeter = num"
              style="padding:6px 12px;background:#eff6ff;color:#1a4fa0;border:1px solid #bfdbfe;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer">
              {{ num }}
            </button>
          </div>
        </div>

        <!-- Simpan nomor -->
        <div v-if="nomorMeter && !savedNumbers.includes(nomorMeter)" style="margin-top:8px">
          <button @click="saveNumber"
            style="font-size:12px;color:#1a4fa0;background:none;border:none;cursor:pointer;padding:0;font-weight:600">
            💾 Simpan nomor ini
          </button>
        </div>
        <div v-else-if="nomorMeter && savedNumbers.includes(nomorMeter)" style="margin-top:8px">
          <button @click="removeNumber(nomorMeter)"
            style="font-size:12px;color:#dc2626;background:none;border:none;cursor:pointer;padding:0;font-weight:600">
            🗑 Hapus dari tersimpan
          </button>
        </div>
        <button @click="step = 2" :disabled="!nomorMeter.trim()"
          style="width:100%;margin-top:16px;padding:14px;background:#1a4fa0;color:white;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;disabled:opacity-0.5">
          Lanjut →
        </button>
      </div>

      <!-- Step 2: Pilih Nominal -->
      <div v-if="step === 2">
        <div style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
          <div style="font-size:13px;color:#64748b;margin-bottom:4px">Nomor Meter</div>
          <div style="font-size:16px;font-weight:700;color:#1a202c">{{ nomorMeter }}</div>
        </div>

        <!-- Tab Pulsa/Data -->
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <button v-for="tab in ['Token Listrik']" :key="tab"
            style="padding:8px 20px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;background:#1a4fa0;color:white;border:none">
            {{ tab }}
          </button>
        </div>

        <div v-if="loading" style="text-align:center;padding:40px;color:#64748b">Memuat produk...</div>
        <div v-else style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
          <button v-for="p in products" :key="p.buyer_sku_code"
            @click="selectedProduct = p"
            style="padding:16px;border-radius:14px;text-align:left;cursor:pointer;transition:all 0.2s;border:2px solid"
            :style="selectedProduct?.buyer_sku_code === p.buyer_sku_code
              ? 'border-color:#1a4fa0;background:#eff6ff'
              : 'border-color:#e2e8f0;background:white'">
            <div style="font-weight:800;color:#1a202c;font-size:14px;margin-bottom:4px">{{ formatNominal(p.product_name) }}</div>
            <div style="font-size:12px;color:#64748b;margin-bottom:8px">{{ p.desc }}</div>
            <div style="font-weight:800;color:#1a4fa0;font-size:14px">{{ formatPrice(p.price) }}</div>
          </button>
        </div>

        <!-- Konfirmasi -->
        <div v-if="selectedProduct" style="background:white;border-radius:20px;padding:20px;border:1px solid #e2e8f0;margin-bottom:16px">
          <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:12px">Konfirmasi Pembelian</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="color:#64748b;font-size:13px">Nomor Meter</span>
            <span style="font-weight:600;color:#1a202c;font-size:13px">{{ nomorMeter }}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="color:#64748b;font-size:13px">Produk</span>
            <span style="font-weight:600;color:#1a202c;font-size:13px">{{ formatNominal(selectedProduct.product_name) }}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0">
            <span style="font-weight:700;color:#1a202c">Total Bayar</span>
            <span style="font-weight:800;color:#1a4fa0;font-size:16px">{{ formatPrice(selectedProduct.price) }}</span>
          </div>
          <!-- Email -->
          <div style="margin-top:12px">
            <label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:6px">Email untuk bukti transaksi & token</label>
            <input v-model="buyerEmail" type="email" placeholder="email@anda.com"
              style="width:100%;box-sizing:border-box;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none"
              @focus="emailConfirmed = false"
              @blur="emailConfirmed = false" />
            <!-- Konfirmasi email -->
            <div v-if="buyerEmail && buyerEmail.includes('@')" style="margin-top:8px;padding:10px 14px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px">
              <div style="font-size:12px;color:#92400e;margin-bottom:6px">⚠️ Pastikan email sudah benar:</div>
              <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:8px">{{ buyerEmail }}</div>
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                <input type="checkbox" v-model="emailConfirmed" style="width:16px;height:16px" />
                <span style="font-size:13px;color:#64748b">Ya, email sudah benar</span>
              </label>
            </div>
          </div>
        </div>
        <p v-if="orderError" style="color:#dc2626;font-size:13px;text-align:center;margin:8px 0 0">⚠️ {{ orderError }}</p>
        <div style="display:flex;gap:12px;margin-top:12px">
          <button @click="step = 1" style="flex:1;padding:14px;background:white;color:#64748b;border:2px solid #e2e8f0;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer">← Kembali</button>
          <button @click="showConfirm=true"             style="flex:2;padding:14px;background:#1a4fa0;color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer"
            :disabled="ordering || !emailConfirmed"
            :style="(ordering || !emailConfirmed) ? 'opacity:0.5;cursor:not-allowed' : ''">
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

      <!-- Modal Konfirmasi -->
      <div v-if="showConfirm" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:100;display:flex;align-items:flex-end;justify-content:center;padding:16px"
        @click.self="showConfirm=false">
        <div style="background:white;border-radius:20px 20px 20px 20px;padding:28px;width:100%;max-width:480px;box-shadow:0 -4px 24px rgba(0,0,0,0.1)">
          <div style="text-align:center;margin-bottom:20px">
            <div style="font-size:32px;margin-bottom:8px">🛒</div>
            <div style="font-size:18px;font-weight:800;color:#1a202c">Konfirmasi Pesanan</div>
          </div>
          <div style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:20px">
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px">
              <span style="color:#64748b">Produk</span>
              <span style="font-weight:600;color:#1a202c">{{ selectedProduct?.product_name }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px">
              <span style="color:#64748b">No. Tujuan</span>
              <span style="font-weight:600;color:#1a202c">{{ nomorMeter.value }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px">
              <span style="color:#64748b">Email</span>
              <span style="font-weight:600;color:#1a202c">{{ buyerEmail }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0;font-size:16px">
              <span style="font-weight:700;color:#1a202c">Total Bayar</span>
              <span style="font-weight:900;color:#1a4fa0">{{ formatPrice(selectedProduct?.price) }}</span>
            </div>
          </div>
          <div style="display:flex;gap:10px">
            <button @click="showConfirm=false"
              style="flex:1;padding:13px;background:#f1f5f9;color:#64748b;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer">
              Batal
            </button>
            <button @click="konfirmasiDanBayar" :disabled="ordering"
              style="flex:2;padding:13px;background:#1a4fa0;color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer"
              :style="ordering ? 'opacity:0.6' : ''">
              {{ ordering ? 'Memproses...' : 'Ya, Bayar Sekarang →' }}
            </button>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Token Listrik PLN — miTRANZ' })

const step = ref(1)
const nomorMeter = ref('')
const savedNumbers = ref<string[]>([])

onMounted(() => {
  try {
    const saved = localStorage.getItem('pln:saved_numbers')
    if (saved) savedNumbers.value = JSON.parse(saved)
  } catch {}
})

function saveNumber() {
  if (!nomorMeter.value) return
  const list = [...new Set([nomorMeter.value, ...savedNumbers.value])].slice(0, 5)
  savedNumbers.value = list
  localStorage.setItem('pln:saved_numbers', JSON.stringify(list))
}

function removeNumber(num: string) {
  savedNumbers.value = savedNumbers.value.filter(n => n !== num)
  localStorage.setItem('pln:saved_numbers', JSON.stringify(savedNumbers.value))
}
const products = ref<any[]>([])
const selectedProduct = ref<any>(null)
const loading = ref(false)
const buyerEmail = ref('')
const emailConfirmed = ref(false)
const showConfirm = ref(false)
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
        customer_no: nomorMeter.value,
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

const formatPrice = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n)
const formatNominal = (name: string) => name.replace(/PLN\s*/i, '').trim()

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/ppob/pln/products')
    products.value = res.products || []
  } finally { loading.value = false }
})
</script>
