<template>
  <div style="min-height:100vh;background:#f0f4fa;padding:24px 16px">
    <div style="max-width:600px;margin:0 auto">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
        <a href="/dashboard" style="width:36px;height:36px;border-radius:10px;background:white;display:flex;align-items:center;justify-content:center;text-decoration:none;border:1px solid #e2e8f0">←</a>
        <div>
          <h1 style="font-size:20px;font-weight:800;color:#1a202c;margin:0">Voucher Game</h1>
          <p style="font-size:13px;color:#64748b;margin:0">Top up diamond, gold, dan voucher game</p>
        </div>
      </div>

      <!-- Pilih Game -->
      <div style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:14px">① Pilih Game</div>
        <div v-if="loading" style="text-align:center;color:#64748b;padding:20px">Memuat...</div>
        <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px">
          <button v-for="(prods, brand) in grouped" :key="brand"
            @click="selectGame(String(brand))"
            style="padding:16px;border-radius:12px;cursor:pointer;transition:all 0.2s;border:2px solid;display:flex;align-items:center;gap:10px"
            :style="selectedGame === brand ? 'border-color:#1a4fa0;background:#eff6ff' : 'border-color:#e2e8f0;background:white'">
            <div style="width:48px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <img v-if="getGameLogo(String(brand))" :src="getGameLogo(String(brand))" :alt="String(brand)" style="max-width:48px;max-height:34px;object-fit:contain;border-radius:6px"/>
              <span v-else style="font-size:28px">🎮</span>
            </div>
            <div style="text-align:left">
              <div style="font-weight:700;color:#1a202c;font-size:12px">{{ brand }}</div>
              <div style="font-size:11px;color:#64748b">{{ prods.length }} produk</div>
            </div>
          </button>
        </div>
      </div>

      <!-- ID Game -->
      <div v-if="selectedGame" style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:12px">② ID / User Game</div>
        <input v-model="gameId" type="text" placeholder="Masukkan ID game Anda"
          style="width:100%;box-sizing:border-box;padding:14px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c"
          @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>
      </div>

      <!-- Pilih Nominal -->
      <div v-if="selectedGame && gameId" style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #e2e8f0">
        <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:12px">③ Pilih Nominal</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button v-for="p in gameProducts" :key="p.buyer_sku_code"
            @click="selectedProduct = p"
            style="padding:14px;border-radius:12px;text-align:left;cursor:pointer;border:2px solid;transition:all 0.2s"
            :style="selectedProduct?.buyer_sku_code === p.buyer_sku_code ? 'border-color:#1a4fa0;background:#eff6ff' : 'border-color:#e2e8f0;background:white'">
            <div style="font-weight:800;color:#1a202c;font-size:13px;margin-bottom:4px">{{ cleanGameName(p.product_name) }}</div>
            <div style="font-weight:800;color:#1a4fa0;font-size:13px">{{ formatPrice(p.price) }}</div>
          </button>
        </div>
      </div>

      <!-- Konfirmasi -->
      <div v-if="selectedProduct" style="background:white;border-radius:20px;padding:20px;border:1px solid #e2e8f0">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#64748b;font-size:13px">Game</span><span style="font-weight:600;color:#1a202c;font-size:13px">{{ selectedGame }}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#64748b;font-size:13px">ID Game</span><span style="font-weight:600;color:#1a202c;font-size:13px">{{ gameId }}</span></div>
        <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0">
          <span style="font-weight:700;color:#1a202c">Total Bayar</span>
          <span style="font-weight:800;color:#1a4fa0;font-size:16px">{{ formatPrice(selectedProduct.price) }}</span>
        </div>
        <div style="margin-top:12px;padding:10px;background:#fffbeb;border-radius:10px;font-size:12px;color:#92400e;border:1px solid #fde68a">
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
              <span style="font-weight:600;color:#1a202c">{{ nomorAkun.value }}</span>
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
useHead({ title: 'Voucher Game — miTRANZ' })

const { getGameLogo } = useOperatorLogo()
const allProducts = ref<any[]>([])
const grouped = ref<Record<string, any[]>>({})
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
        customer_no: nomorAkun.value,
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
const selectedGame = ref('')
const gameId = ref('')
const selectedProduct = ref<any>(null)

const formatPrice = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n)
const cleanGameName = (name: string) => name.replace(/MOBILE LEGENDS?|FREE FIRE|FREEFIRE/gi, '').trim()
const gameProducts = computed(() => allProducts.value.filter(p => p.brand === selectedGame.value))

function selectGame(brand: string) { selectedGame.value = brand; selectedProduct.value = null }

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/ppob/games/products')
    allProducts.value = res.products || []
    grouped.value = res.grouped || {}
  } finally { loading.value = false }
})
</script>
