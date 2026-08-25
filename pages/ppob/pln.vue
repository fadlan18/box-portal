<template>
  <PpobLayout>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1e3a5f 0%,#1a4fa0 100%);padding:40px 20px 32px">
      <div style="max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:16px">
        <div style="width:56px;height:56px;border-radius:16px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">⚡</div>
        <div>
          <h1 style="font-size:24px;font-weight:900;color:white;margin:0;letter-spacing:-0.5px">Token Listrik PLN</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0">Beli token listrik prabayar instan, langsung ke email</p>
        </div>
      </div>
    </div>

    <!-- Konten -->
    <div style="max-width:1280px;margin:0 auto;padding:24px 20px 80px">
      <div style="display:grid;gap:24px" :style="isDesktop ? 'grid-template-columns:1fr 340px' : 'grid-template-columns:1fr'">

        <!-- KIRI: Form -->
        <div style="display:flex;flex-direction:column;gap:16px">

          <!-- Step 1: Nomor Meter -->
          <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
              <div style="width:28px;height:28px;border-radius:50%;background:#1a4fa0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0">1</div>
              <div style="font-size:15px;font-weight:800;color:#1a202c">Nomor Meter / ID Pelanggan</div>
            </div>

            <input v-model="nomorMeter" type="text" inputmode="numeric"
              placeholder="Contoh: 123456789012"
              style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c;background:#f8faff;transition:border 0.2s;font-family:monospace;letter-spacing:1px"
              @focus="$event.target.style.borderColor='#1a4fa0';$event.target.style.background='white'"
              @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"/>

            <!-- Nomor tersimpan -->
            <div v-if="savedNumbers.length" style="margin-top:12px">
              <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;font-weight:700;letter-spacing:0.5px">TERSIMPAN</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                <button v-for="num in savedNumbers" :key="num"
                  @click="nomorMeter = num"
                  style="padding:6px 14px;background:#eff6ff;color:#1a4fa0;border:1px solid #bfdbfe;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;font-family:monospace">
                  {{ num }}
                </button>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
              <div style="font-size:12px;color:#94a3b8">⚠️ Pastikan nomor meter sudah benar</div>
              <button v-if="nomorMeter && !savedNumbers.includes(nomorMeter)" @click="saveNumber"
                style="font-size:12px;color:#1a4fa0;background:none;border:none;cursor:pointer;font-weight:600;padding:0">
                💾 Simpan
              </button>
              <button v-else-if="nomorMeter && savedNumbers.includes(nomorMeter)" @click="removeNumber(nomorMeter)"
                style="font-size:12px;color:#dc2626;background:none;border:none;cursor:pointer;font-weight:600;padding:0">
                🗑 Hapus
              </button>
            </div>
          </div>

          <!-- Step 2: Pilih Nominal -->
          <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
              <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0"
                :style="nomorMeter ? 'background:#1a4fa0;color:white' : 'background:#e2e8f0;color:#94a3b8'">2</div>
              <div style="font-size:15px;font-weight:800;" :style="nomorMeter ? 'color:#1a202c' : 'color:#94a3b8'">Pilih Nominal Token</div>
            </div>

            <div v-if="!nomorMeter" style="text-align:center;padding:24px;color:#94a3b8;font-size:14px">
              Masukkan nomor meter terlebih dahulu
            </div>
            <div v-else-if="loading" style="text-align:center;padding:24px;color:#64748b">Memuat produk...</div>
            <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">
              <button v-for="p in products" :key="p.buyer_sku_code"
                @click="selectedProduct = p"
                style="padding:16px 12px;border-radius:14px;text-align:left;cursor:pointer;border:1.5px solid;transition:all 0.15s;background:white"
                :style="selectedProduct?.buyer_sku_code === p.buyer_sku_code
                  ? 'border-color:#1a4fa0;background:#eff6ff;box-shadow:0 0 0 3px rgba(26,79,160,0.12)'
                  : 'border-color:#e2e8f0'"
                @mouseover="hoverNominal($event, p, selectedProduct)"
                @mouseout="unhoverNominal($event, p, selectedProduct)">
                <div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:4px">PLN TOKEN</div>
                <div style="font-size:14px;font-weight:900;color:#1a202c;margin-bottom:6px">{{ cleanPlnName(p.product_name) }}</div>
                <div style="font-size:15px;font-weight:900;color:#1a4fa0">{{ fmtRp(p.price) }}</div>
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
              @focus="$event.target.style.borderColor='#1a4fa0';$event.target.style.background='white';emailConfirmed=false"
              @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"/>
            <div v-if="buyerEmail.includes('@')"
              style="margin-top:12px;padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px">
              <div style="font-size:12px;color:#92400e;margin-bottom:8px">⚠️ Token listrik akan dikirim ke email ini:</div>
              <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:10px">{{ buyerEmail }}</div>
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                <input type="checkbox" v-model="emailConfirmed" style="width:16px;height:16px;accent-color:#1a4fa0">
                <span style="font-size:13px;color:#64748b;font-weight:600">Ya, email sudah benar</span>
              </label>
            </div>
          </div>

          <!-- Tombol bayar mobile -->
          <div v-if="selectedProduct && !isDesktop"
            style="background:white;border-radius:20px;padding:20px;border:1px solid #e2e8f0">
            <p v-if="orderError" style="color:#dc2626;font-size:13px;text-align:center;margin:0 0 10px">⚠️ {{ orderError }}</p>
            <button @click="showConfirm=true" :disabled="!canBuy"
              style="width:100%;padding:16px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white"
              :style="!canBuy ? 'opacity:0.4;cursor:not-allowed' : 'box-shadow:0 4px 20px rgba(26,79,160,0.35)'">
              {{ ordering ? 'Memproses...' : `Bayar ${fmtRp(selectedProduct.price)} →` }}
            </button>
          </div>
        </div>

        <!-- KANAN: Sticky Summary -->
        <div v-if="isDesktop" style="position:sticky;top:130px;height:fit-content">
          <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
            <div style="font-size:13px;font-weight:800;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px">Ringkasan Pesanan</div>

            <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#f0f6ff;border-radius:14px;margin-bottom:20px">
              <div style="font-size:32px">⚡</div>
              <div>
                <div style="font-size:14px;font-weight:700;color:#1a202c">Token Listrik PLN</div>
                <div style="font-size:12px;color:#64748b">{{ selectedProduct ? cleanPlnName(selectedProduct.product_name) : 'Pilih nominal' }}</div>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:13px;color:#64748b">Nomor Meter</span>
                <span style="font-size:13px;font-weight:600;color:#1a202c;font-family:monospace">{{ nomorMeter || '-' }}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:13px;color:#64748b">Nominal</span>
                <span style="font-size:13px;font-weight:600;color:#1a202c">{{ selectedProduct ? cleanPlnName(selectedProduct.product_name) : '-' }}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:13px;color:#64748b">Email</span>
                <span style="font-size:13px;font-weight:600;color:#1a202c;max-width:160px;text-align:right;word-break:break-all">{{ buyerEmail || '-' }}</span>
              </div>
              <div style="height:1px;background:#e2e8f0"></div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:15px;font-weight:800;color:#1a202c">Total</span>
                <span style="font-size:22px;font-weight:900;color:#1a4fa0">{{ selectedProduct ? fmtRp(selectedProduct.price) : '-' }}</span>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
              <div v-for="t in ['⚡ Instan','🔒 Aman','📧 Email']" :key="t"
                style="text-align:center;padding:8px 4px;background:#f0f6ff;border-radius:10px;font-size:11px;font-weight:700;color:#64748b">{{ t }}</div>
            </div>

            <p v-if="orderError" style="color:#dc2626;font-size:12px;text-align:center;margin:0 0 10px">⚠️ {{ orderError }}</p>

            <button @click="showConfirm=true" :disabled="!canBuy"
              style="width:100%;padding:16px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white"
              :style="!canBuy ? 'opacity:0.4;cursor:not-allowed' : 'box-shadow:0 4px 20px rgba(26,79,160,0.35)'">
              {{ ordering ? 'Memproses...' : 'Bayar Sekarang →' }}
            </button>
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
          <div style="font-size:22px;font-weight:900;color:#1a4fa0">{{ fmtRp(selectedProduct.price) }}</div>
        </div>
        <button @click="showConfirm=true" :disabled="!canBuy"
          style="padding:14px 28px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white"
          :style="!canBuy ? 'opacity:0.4' : 'box-shadow:0 4px 16px rgba(26,79,160,0.4)'">
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
            style="flex:2;padding:14px;border-radius:12px;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white;border:none;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 4px 16px rgba(26,79,160,0.4)">
            {{ ordering ? 'Memproses...' : 'Ya, Bayar Sekarang' }}
          </button>
        </div>
      </div>
    </div>

  </PpobLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Token Listrik PLN — miTRANZ' })

const loading = ref(false)
const ordering = ref(false)
const nomorMeter = ref('')
const selectedProduct = ref<any>(null)
const buyerEmail = ref('')
const emailConfirmed = ref(false)
const orderError = ref('')
const showConfirm = ref(false)
const products = ref<any[]>([])
const savedNumbers = ref<string[]>([])
const isDesktop = ref(false)

onMounted(async () => {
  isDesktop.value = window.innerWidth >= 768
  window.addEventListener('resize', () => { isDesktop.value = window.innerWidth >= 768 })
  savedNumbers.value = JSON.parse(localStorage.getItem('pln_saved') || '[]')

  loading.value = true
  try {
    const data = await $fetch<any>('/api/ppob/products-raw')
    products.value = (data?.products ?? []).filter((p: any) => p.category === 'PLN')
  } finally { loading.value = false }
})

const canBuy = computed(() => selectedProduct.value && nomorMeter.value && emailConfirmed.value && !ordering.value)

const confirmRows = computed(() => [
  { label: 'Nomor Meter', value: nomorMeter.value },
  { label: 'Nominal', value: cleanPlnName(selectedProduct.value?.product_name) },
  { label: 'Email', value: buyerEmail.value },
  { label: 'Total Bayar', value: fmtRp(selectedProduct.value?.price), last: true },
])

function saveNumber() {
  if (!nomorMeter.value || savedNumbers.value.includes(nomorMeter.value)) return
  savedNumbers.value.push(nomorMeter.value)
  localStorage.setItem('pln_saved', JSON.stringify(savedNumbers.value))
}
function removeNumber(num: string) {
  savedNumbers.value = savedNumbers.value.filter(n => n !== num)
  localStorage.setItem('pln_saved', JSON.stringify(savedNumbers.value))
}

async function bayar() {
  if (!canBuy.value) return
  ordering.value = true
  orderError.value = ''
  showConfirm.value = false
  try {
    const res = await $fetch<any>('/api/ppob/order', {
      method: 'POST',
      body: {
        sku: selectedProduct.value.buyer_sku_code,
        customerNo: nomorMeter.value,
        email: buyerEmail.value,
        price: selectedProduct.value.price,
        productName: selectedProduct.value.product_name,
      }
    })
    if (res.paymentUrl) window.location.href = res.paymentUrl
    else orderError.value = res.message || 'Gagal membuat pesanan'
  } catch (e: any) {
    orderError.value = e?.data?.message || 'Terjadi kesalahan'
  } finally { ordering.value = false }
}

function hoverNominal(e: any, p: any, sel: any) {
  if (sel?.buyer_sku_code !== p.buyer_sku_code) e.currentTarget.style.borderColor = '#93c5fd'
}
function unhoverNominal(e: any, p: any, sel: any) {
  if (sel?.buyer_sku_code !== p.buyer_sku_code) e.currentTarget.style.borderColor = '#e2e8f0'
}
function cleanPlnName(name: string) {
  if (!name) return ''
  return name.replace(/^(PLN|Token|Listrik|Token Listrik PLN)\s*/i, '').trim() || name
}
function fmtRp(n: number) {
  return n ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n) : '-'
}
</script>

<style>
@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
</style>
