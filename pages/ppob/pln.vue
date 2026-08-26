<template>
  <PpobLayout>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 20px 32px">
      <div style="max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:16px">
        <div style="width:56px;height:56px;border-radius:16px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;box-shadow:0 4px 16px rgba(0,0,0,0.2)">⚡</div>
        <div>
          <h1 style="font-size:24px;font-weight:900;color:white;margin:0;letter-spacing:-0.5px">Token Listrik PLN</h1>
          <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:0;font-weight:500">Beli token listrik prabayar, proses instan</p>
        </div>
      </div>
    </div>

    <!-- Konten -->
    <div style="background:#f0f4fa;min-height:calc(100vh - 120px)">
      <div style="max-width:1280px;margin:0 auto;padding:28px 20px 100px">
        <div style="display:grid;gap:24px" :style="isDesktop ? 'grid-template-columns:1fr 360px;align-items:start' : 'grid-template-columns:1fr'">

          <!-- KIRI -->
          <div style="display:flex;flex-direction:column;gap:16px">

            <!-- Step 1: Nomor Meter -->
            <div style="background:white;border-radius:24px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8edf5">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
                <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#1a4fa0,#2563eb);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:white;flex-shrink:0;box-shadow:0 4px 12px rgba(26,79,160,0.3)">1</div>
                <div style="font-size:16px;font-weight:800;color:#0f172a">Nomor Meter / ID Pelanggan</div>
              </div>
              <div style="position:relative">
                <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:18px">⚡</span>
                <input v-model="nomorMeter" type="text" inputmode="numeric"
                  placeholder="Contoh: 123456789012"
                  style="width:100%;box-sizing:border-box;padding:14px 16px 14px 44px;border:2px solid #e2e8f0;border-radius:14px;font-size:15px;outline:none;color:#0f172a;background:#f8faff;transition:all 0.2s;font-family:monospace;letter-spacing:1px;font-weight:600"
                  @focus="$event.target.style.borderColor='#1a4fa0';$event.target.style.background='white';$event.target.style.boxShadow='0 0 0 4px rgba(26,79,160,0.08)'"
                  @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff';$event.target.style.boxShadow='none'"/>
              </div>

              <!-- Nomor tersimpan -->
              <div v-if="savedNumbers.length" style="margin-top:12px">
                <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase">Tersimpan</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px">
                  <button v-for="num in savedNumbers" :key="num" @click="nomorMeter=num"
                    style="padding:5px 12px;background:#eff6ff;color:#1a4fa0;border:1px solid #bfdbfe;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;font-family:monospace">
                    {{ num }}
                  </button>
                </div>
              </div>

              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
                <div style="font-size:12px;color:#94a3b8">⚠️ Pastikan nomor meter sudah benar</div>
                <button v-if="nomorMeter && !savedNumbers.includes(nomorMeter)" @click="saveNumber"
                  style="font-size:12px;color:#1a4fa0;background:none;border:none;cursor:pointer;font-weight:700;padding:0">💾 Simpan</button>
                <button v-else-if="nomorMeter && savedNumbers.includes(nomorMeter)" @click="removeNumber(nomorMeter)"
                  style="font-size:12px;color:#f43f5e;background:none;border:none;cursor:pointer;font-weight:700;padding:0">🗑 Hapus</button>
              </div>
            </div>

            <!-- Step 2: Pilih Nominal -->
            <div style="background:white;border-radius:24px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8edf5">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
                <div style="width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0;transition:all 0.3s"
                  :style="nomorMeter ? 'background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white;box-shadow:0 4px 12px rgba(26,79,160,0.3)' : 'background:#f1f5f9;color:#94a3b8'">2</div>
                <div style="font-size:16px;font-weight:800;transition:color 0.3s" :style="nomorMeter ? 'color:#0f172a' : 'color:#94a3b8'">Pilih Nominal Token</div>
              </div>

              <div v-if="!nomorMeter"
                style="text-align:center;padding:32px;color:#94a3b8;font-size:14px;background:#f8faff;border-radius:16px;border:2px dashed #e2e8f0">
                <div style="font-size:32px;margin-bottom:8px">👆</div>
                Masukkan nomor meter terlebih dahulu
              </div>
              <div v-else-if="loading" style="text-align:center;padding:32px;color:#64748b">Memuat produk...</div>
              <template v-else>
                <!-- Featured -->
                <div v-if="featuredProducts.length > 0" style="margin-bottom:20px">
                  <div style="font-size:11px;font-weight:800;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px">⭐ Rekomendasi</div>
                  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:10px">
                    <button v-for="p in featuredProducts" :key="p.buyer_sku_code"
                      @click="selectedProduct=p"
                      style="padding:16px 12px;border-radius:16px;text-align:center;cursor:pointer;border:2px solid;transition:all 0.2s;background:white;position:relative;overflow:hidden"
                      :style="selectedProduct?.buyer_sku_code===p.buyer_sku_code
                        ? 'border-color:#1a4fa0;background:linear-gradient(135deg,#eff6ff,#dbeafe);box-shadow:0 4px 16px rgba(26,79,160,0.2)'
                        : 'border-color:#e8edf5'">
                      <div v-if="p.badge_text"
                        style="position:absolute;top:0;right:0;padding:3px 8px;background:#f59e0b;color:white;font-size:9px;font-weight:800;border-radius:0 16px 0 10px">
                        {{ p.badge_text }}
                      </div>
                      <div v-if="selectedProduct?.buyer_sku_code===p.buyer_sku_code"
                        style="position:absolute;top:8px;left:8px;width:18px;height:18px;background:#1a4fa0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;color:white">✓</div>
                      <div style="font-size:22px;margin-bottom:6px">⚡</div>
                      <div style="font-size:12px;font-weight:700;color:#1e293b;margin-bottom:6px;line-height:1.3">{{ cleanPlnName(p.product_name) }}</div>
                      <div style="font-size:15px;font-weight:900;color:#1a4fa0">{{ fmtRp(p.price) }}</div>
                    </button>
                  </div>
                </div>

                <!-- Semua nominal -->
                <div>
                  <div v-if="featuredProducts.length > 0"
                    style="font-size:11px;font-weight:800;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px">Semua Nominal</div>
                  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px">
                    <button v-for="p in products" :key="p.buyer_sku_code"
                      @click="selectedProduct=p"
                      style="padding:14px 10px;border-radius:14px;text-align:center;cursor:pointer;border:2px solid;transition:all 0.2s;position:relative"
                      :style="selectedProduct?.buyer_sku_code===p.buyer_sku_code
                        ? 'border-color:#1a4fa0;background:linear-gradient(135deg,#eff6ff,#dbeafe)'
                        : 'border-color:#e8edf5;background:white'">
                      <div v-if="selectedProduct?.buyer_sku_code===p.buyer_sku_code"
                        style="position:absolute;top:6px;right:6px;width:16px;height:16px;background:#1a4fa0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;color:white">✓</div>
                      <div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.3px">PLN Token</div>
                      <div style="font-size:12px;font-weight:800;color:#0f172a;margin-bottom:4px;line-height:1.3">{{ cleanPlnName(p.product_name) }}</div>
                      <div style="font-size:14px;font-weight:900;color:#1a4fa0">{{ fmtRp(p.price) }}</div>
                    </button>
                  </div>
                </div>
              </template>
            </div>

            <!-- Step 3: Email -->
            <div v-if="selectedProduct" style="background:white;border-radius:24px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8edf5;animation:fadeIn 0.3s ease">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
                <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#1a4fa0,#2563eb);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:white;flex-shrink:0;box-shadow:0 4px 12px rgba(26,79,160,0.3)">3</div>
                <div style="font-size:16px;font-weight:800;color:#0f172a">Email Konfirmasi</div>
              </div>
              <div style="position:relative">
                <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:18px">📧</span>
                <input v-model="buyerEmail" type="email" placeholder="email@anda.com"
                  style="width:100%;box-sizing:border-box;padding:14px 16px 14px 44px;border:2px solid #e2e8f0;border-radius:14px;font-size:15px;outline:none;color:#0f172a;background:#f8faff;transition:all 0.2s;font-weight:500"
                  @focus="$event.target.style.borderColor='#1a4fa0';$event.target.style.background='white';$event.target.style.boxShadow='0 0 0 4px rgba(26,79,160,0.08)';emailConfirmed=false"
                  @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff';$event.target.style.boxShadow='none'"/>
              </div>
              <div v-if="buyerEmail && buyerEmail.includes('@')"
                style="margin-top:12px;padding:14px 16px;background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1.5px solid #fde68a;border-radius:14px;display:flex;align-items:flex-start;gap:10px">
                <span style="font-size:18px;flex-shrink:0">⚠️</span>
                <div style="flex:1">
                  <div style="font-size:12px;color:#92400e;margin-bottom:6px;font-weight:600">Token listrik dikirim ke email ini:</div>
                  <div style="font-size:14px;font-weight:800;color:#78350f;margin-bottom:10px">{{ buyerEmail }}</div>
                  <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                    <input type="checkbox" v-model="emailConfirmed" style="width:16px;height:16px;accent-color:#1a4fa0">
                    <span style="font-size:13px;color:#92400e;font-weight:600">Email sudah benar</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Mobile bayar -->
            <div v-if="selectedProduct && !isDesktop"
              style="background:white;border-radius:24px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8edf5">
              <button @click="showConfirm=true" :disabled="!canBuy"
                style="width:100%;padding:17px;border:none;border-radius:16px;font-size:16px;font-weight:900;cursor:pointer;color:white;transition:all 0.2s"
                :style="canBuy ? 'background:linear-gradient(135deg,#1a4fa0,#2563eb);box-shadow:0 6px 24px rgba(26,79,160,0.4)' : 'background:#e2e8f0;cursor:not-allowed;color:#94a3b8'">
                {{ ordering ? '⏳ Memproses...' : `Bayar ${fmtRp(selectedProduct.price)} →` }}
              </button>
            </div>
          </div>

          <!-- KANAN: Summary -->
          <div v-if="isDesktop" style="position:sticky;top:140px">
            <div style="background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);border:1px solid #e8edf5">
              <div style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:20px 24px">
                <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:16px">Ringkasan Pesanan</div>
                <div style="display:flex;align-items:center;gap:12px">
                  <div style="width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid rgba(255,255,255,0.15)">⚡</div>
                  <div>
                    <div style="font-size:15px;font-weight:800;color:white">Token Listrik PLN</div>
                    <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:2px">{{ selectedProduct ? cleanPlnName(selectedProduct.product_name) : 'Pilih nominal' }}</div>
                  </div>
                </div>
              </div>
              <div style="padding:20px 24px">
                <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-size:13px;color:#64748b">Nomor Meter</span>
                    <span style="font-size:13px;font-weight:700;color:#0f172a;font-family:monospace;background:#f1f5f9;padding:3px 8px;border-radius:6px">{{ nomorMeter || '-' }}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-size:13px;color:#64748b">Nominal</span>
                    <span style="font-size:13px;font-weight:700;color:#0f172a">{{ selectedProduct ? cleanPlnName(selectedProduct.product_name) : '-' }}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-size:13px;color:#64748b">Email</span>
                    <span style="font-size:12px;font-weight:600;color:#0f172a;max-width:160px;text-align:right;word-break:break-all">{{ buyerEmail || '-' }}</span>
                  </div>
                  <div style="height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:4px 0"></div>
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-size:14px;font-weight:800;color:#0f172a">Total Bayar</span>
                    <span style="font-size:26px;font-weight:900;color:#1a4fa0;letter-spacing:-0.5px">{{ selectedProduct ? fmtRp(selectedProduct.price) : '-' }}</span>
                  </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
                  <div v-for="t in trustItems" :key="t.label"
                    style="text-align:center;padding:10px 6px;background:#f8faff;border-radius:12px;border:1px solid #e8edf5">
                    <div style="font-size:20px;margin-bottom:4px">{{ t.icon }}</div>
                    <div style="font-size:10px;font-weight:700;color:#64748b;line-height:1.3">{{ t.label }}</div>
                  </div>
                </div>

                <p v-if="orderError" style="color:#f43f5e;font-size:12px;text-align:center;margin:0 0 12px;font-weight:600">⚠️ {{ orderError }}</p>
                <button @click="showConfirm=true" :disabled="!canBuy"
                  style="width:100%;padding:17px;border:none;border-radius:16px;font-size:16px;font-weight:900;cursor:pointer;color:white;transition:all 0.2s"
                  :style="canBuy ? 'background:linear-gradient(135deg,#1a4fa0,#2563eb);box-shadow:0 6px 24px rgba(26,79,160,0.4)' : 'background:#e2e8f0;cursor:not-allowed;color:#94a3b8'">
                  {{ ordering ? '⏳ Memproses...' : 'Bayar Sekarang →' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom sticky mobile -->
    <div v-if="selectedProduct && !isDesktop"
      style="position:fixed;bottom:0;left:0;right:0;z-index:50;background:white;border-top:1px solid #e2e8f0;box-shadow:0 -4px 20px rgba(0,0,0,0.1)">
      <div style="padding:12px 16px 20px;max-width:600px;margin:0 auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div>
            <div style="font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Total Bayar</div>
            <div style="font-size:24px;font-weight:900;color:#1a4fa0;letter-spacing:-0.5px">{{ fmtRp(selectedProduct.price) }}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px;color:#64748b">{{ cleanPlnName(selectedProduct.product_name) }}</div>
            <div style="font-size:11px;color:#94a3b8;font-family:monospace">{{ nomorMeter }}</div>
          </div>
        </div>
        <button @click="showConfirm=true" :disabled="!canBuy"
          style="width:100%;padding:16px;border:none;border-radius:16px;font-size:16px;font-weight:900;cursor:pointer;color:white"
          :style="canBuy ? 'background:linear-gradient(135deg,#1a4fa0,#2563eb);box-shadow:0 4px 16px rgba(26,79,160,0.4)' : 'background:#e2e8f0;color:#94a3b8'">
          Bayar Sekarang →
        </button>
      </div>
    </div>

    <!-- Modal Konfirmasi -->
    <div v-if="showConfirm && selectedProduct"
      style="position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center;background:rgba(15,23,42,0.75);backdrop-filter:blur(4px)"
      @click.self="showConfirm=false">
      <div style="background:white;border-radius:28px 28px 0 0;padding:28px 24px 40px;width:100%;max-width:520px;animation:slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)">
        <div style="width:40px;height:4px;background:#e2e8f0;border-radius:2px;margin:0 auto 24px"></div>
        <div style="text-align:center;margin-bottom:24px">
          <div style="width:64px;height:64px;border-radius:20px;background:linear-gradient(135deg,#1a4fa0,#2563eb);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px;box-shadow:0 8px 24px rgba(26,79,160,0.3)">⚡</div>
          <h3 style="font-size:20px;font-weight:900;color:#0f172a;margin:0 0 4px">Konfirmasi Pesanan</h3>
          <p style="font-size:13px;color:#64748b;margin:0">Periksa kembali sebelum membayar</p>
        </div>
        <div style="background:#f8faff;border-radius:20px;padding:20px;margin-bottom:20px;border:1px solid #e8edf5">
          <div v-for="row in confirmRows" :key="row.label"
            style="display:flex;justify-content:space-between;align-items:center;padding:10px 0"
            :style="row.last ? 'border-top:2px solid #e2e8f0;padding-top:14px;margin-top:4px' : 'border-bottom:1px solid #f1f5f9'">
            <span style="font-size:13px;color:#64748b;font-weight:500">{{ row.label }}</span>
            <span style="font-weight:800;text-align:right;max-width:60%"
              :style="row.last ? 'font-size:22px;color:#1a4fa0;letter-spacing:-0.5px' : 'font-size:13px;color:#0f172a'">
              {{ row.value }}
            </span>
          </div>
        </div>
        <div style="display:flex;gap:12px">
          <button @click="showConfirm=false"
            style="flex:1;padding:15px;border-radius:16px;background:#f1f5f9;color:#64748b;border:none;font-size:14px;font-weight:700;cursor:pointer">Batal</button>
          <button @click="bayar" :disabled="ordering"
            style="flex:2;padding:15px;border-radius:16px;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white;border:none;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 6px 20px rgba(26,79,160,0.4)">
            {{ ordering ? '⏳ Memproses...' : '✓ Ya, Bayar Sekarang' }}
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
const productConfigs = ref<any[]>([])

const trustItems = [
  { icon: '⚡', label: 'Proses Instan' },
  { icon: '🔒', label: 'Transaksi Aman' },
  { icon: '📧', label: 'Notif Email' },
]

// SSR fetch
const { data: plnRaw } = await useAsyncData('pln-products',
  () => $fetch<any>('/api/ppob/products?category=PLN'),
  { default: () => ({ products: [] }) }
)
const { data: plnConfigs } = await useAsyncData('pln-configs',
  () => $fetch<any[]>('/api/ppob/product-configs?category=PLN'),
  { default: () => [] }
)
products.value = plnRaw.value?.products ?? []
productConfigs.value = plnConfigs.value ?? []
loading.value = false

onMounted(() => {
  isDesktop.value = window.innerWidth >= 768
  window.addEventListener('resize', () => { isDesktop.value = window.innerWidth >= 768 })
  savedNumbers.value = JSON.parse(localStorage.getItem('pln_saved') || '[]')
})

const featuredProducts = computed(() => {
  if (!productConfigs.value.length) return []
  const featuredSkus = productConfigs.value.filter(c => c.is_featured).map(c => ({ sku: c.sku_code, badge: c.badge_text }))
  return products.value
    .filter(p => featuredSkus.some(f => f.sku === p.buyer_sku_code))
    .map(p => ({ ...p, badge_text: featuredSkus.find(f => f.sku === p.buyer_sku_code)?.badge || '' }))
})

const canBuy = computed(() => selectedProduct.value && nomorMeter.value && emailConfirmed.value && !ordering.value)

const confirmRows = computed(() => [
  { label: 'Nomor Meter', value: nomorMeter.value },
  { label: 'Nominal', value: cleanPlnName(selectedProduct.value?.product_name) },
  { label: 'Email', value: buyerEmail.value },
  { label: 'Total', value: fmtRp(selectedProduct.value?.price), last: true },
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
      body: { customer_no: nomorMeter.value, email: buyerEmail.value, product: selectedProduct.value }
    })
    const payUrl = res.paymentUrl || res.invoice?.payment_url
    if (payUrl) window.location.href = payUrl
    else orderError.value = res.message || 'Gagal membuat pesanan'
  } catch (e: any) {
    orderError.value = e?.data?.message || 'Terjadi kesalahan'
  } finally { ordering.value = false }
}

function cleanPlnName(name: string) {
  if (!name) return ''
  return name.replace(/^(PLN|Token|Listrik|Token Listrik PLN)\s*/i, '').trim() || name
}
function fmtRp(n: number) {
  return n ? new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 }).format(n) : '-'
}
function hoverNominal(e: any, p: any, sel: any) {
  if (sel?.buyer_sku_code !== p.buyer_sku_code) e.currentTarget.style.borderColor = '#93c5fd'
}
function unhoverNominal(e: any, p: any, sel: any) {
  if (sel?.buyer_sku_code !== p.buyer_sku_code) e.currentTarget.style.borderColor = '#e8edf5'
}
</script>

<style>
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px) }
  to { opacity: 1; transform: translateY(0) }
}
</style>
