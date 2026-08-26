<template>
  <PpobLayout>

    <div v-if="loadingBrand" style="max-width:1280px;margin:0 auto;padding:80px 20px;text-align:center;color:#64748b">
      <div style="font-size:40px;margin-bottom:12px;animation:spin 1s linear infinite">⚡</div>
      <div style="font-size:14px;font-weight:600">Memuat...</div>
    </div>

    <div v-else-if="!brand" style="max-width:1280px;margin:0 auto;padding:80px 20px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">🎮</div>
      <h2 style="font-size:20px;font-weight:800;color:#1a202c;margin:0 0 8px">Game tidak ditemukan</h2>
      <a href="/ppob/games" style="color:#6366f1;font-weight:600;text-decoration:none">← Kembali ke daftar game</a>
    </div>

    <template v-else>

      <!-- Banner hero -->
      <div style="position:relative;height:220px;overflow:hidden;background:#1a1a2e">
        <img v-if="brand.banner_url || brand.logo_url"
          :src="brand.banner_url || brand.logo_url"
          :alt="brand.name"
          style="width:100%;height:100%;object-fit:cover;filter:blur(3px) brightness(0.45);transform:scale(1.05)">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,23,42,0.3) 0%,rgba(15,23,42,0.85) 100%)"></div>

        <!-- Breadcrumb -->
        <a href="/ppob/games"
          style="position:absolute;top:20px;left:24px;display:flex;align-items:center;gap:6px;color:rgba(255,255,255,0.6);text-decoration:none;font-size:13px;font-weight:600;background:rgba(0,0,0,0.25);padding:6px 12px;border-radius:100px;backdrop-filter:blur(8px)">
          ← Game
        </a>

        <!-- Brand info -->
        <div style="position:absolute;bottom:0;left:0;right:0;padding:20px 28px;display:flex;align-items:flex-end;gap:16px;max-width:1280px;margin:0 auto">
          <div style="width:80px;height:80px;border-radius:20px;overflow:hidden;border:3px solid rgba(255,255,255,0.25);flex-shrink:0;background:#0f3460;box-shadow:0 8px 24px rgba(0,0,0,0.4)">
            <img v-if="brand.logo_url || brand.banner_url"
              :src="brand.logo_url || brand.banner_url"
              style="width:100%;height:100%;object-fit:cover">
            <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px">🎮</div>
          </div>
          <div style="padding-bottom:4px">
            <div v-if="brand.badge_text"
              style="display:inline-block;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:800;background:#f59e0b;color:white;margin-bottom:6px;letter-spacing:0.5px">
              {{ brand.badge_text }}
            </div>
            <h1 style="font-size:28px;font-weight:900;color:white;margin:0;letter-spacing:-0.5px;text-shadow:0 2px 12px rgba(0,0,0,0.5)">{{ brand.name }}</h1>
            <div style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px;font-weight:500">{{ gameProducts.length }} produk tersedia</div>
          </div>
        </div>
      </div>

      <!-- Konten -->
      <div style="background:#f0f4fa;min-height:calc(100vh - 220px)">
        <div style="max-width:1280px;margin:0 auto;padding:28px 20px 100px">
          <div style="display:grid;gap:24px" :style="isDesktop ? 'grid-template-columns:1fr 360px;align-items:start' : 'grid-template-columns:1fr'">

            <!-- KIRI: Form -->
            <div style="display:flex;flex-direction:column;gap:16px">

              <!-- Step 1: User ID -->
              <div style="background:white;border-radius:24px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8edf5">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
                  <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:white;flex-shrink:0;box-shadow:0 4px 12px rgba(99,102,241,0.3)">1</div>
                  <div style="font-size:16px;font-weight:800;color:#0f172a">Informasi Akun</div>
                </div>
                <label style="font-size:12px;font-weight:700;color:#64748b;display:block;margin-bottom:8px;letter-spacing:0.5px;text-transform:uppercase">
                  User ID <span style="color:#f43f5e">*</span>
                </label>
                <div style="position:relative">
                  <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:18px">🎮</span>
                  <input v-model="gameId" type="text"
                    :placeholder="`Masukkan User ID ${brand.name}`"
                    style="width:100%;box-sizing:border-box;padding:14px 16px 14px 44px;border:2px solid #e2e8f0;border-radius:14px;font-size:15px;outline:none;color:#0f172a;background:#f8faff;transition:all 0.2s;font-weight:500"
                    @focus="$event.target.style.borderColor='#6366f1';$event.target.style.background='white';$event.target.style.boxShadow='0 0 0 4px rgba(99,102,241,0.08)'"
                    @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff';$event.target.style.boxShadow='none'"/>
                </div>
                <div style="font-size:12px;color:#94a3b8;margin-top:10px;display:flex;align-items:center;gap:6px">
                  <span>⚠️</span> Pastikan ID benar. Transaksi berhasil tidak dapat dibatalkan.
                </div>
              </div>

              <!-- Step 2: Pilih Nominal -->
              <div style="background:white;border-radius:24px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8edf5">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
                  <div style="width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0;transition:all 0.3s"
                    :style="gameId
                      ? 'background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;box-shadow:0 4px 12px rgba(99,102,241,0.3)'
                      : 'background:#f1f5f9;color:#94a3b8'">2</div>
                  <div style="font-size:16px;font-weight:800;transition:color 0.3s" :style="gameId ? 'color:#0f172a' : 'color:#94a3b8'">Pilih Nominal</div>
                </div>

                <div v-if="!gameId"
                  style="text-align:center;padding:32px;color:#94a3b8;font-size:14px;background:#f8faff;border-radius:16px;border:2px dashed #e2e8f0">
                  <div style="font-size:32px;margin-bottom:8px">👆</div>
                  Masukkan User ID terlebih dahulu
                </div>
                <div v-else-if="gameProducts.length === 0"
                  style="text-align:center;padding:32px;background:#f8faff;border-radius:16px">
                  <div style="font-size:32px;margin-bottom:8px">😔</div>
                  <div style="font-size:14px;color:#64748b">Produk tidak tersedia saat ini</div>
                </div>
                <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:10px">
                  <button v-for="p in gameProducts" :key="p.buyer_sku_code"
                    @click="selectedProduct=p"
                    style="padding:16px 12px;border-radius:16px;text-align:center;cursor:pointer;border:2px solid;transition:all 0.2s;background:white;position:relative;overflow:hidden"
                    :style="selectedProduct?.buyer_sku_code===p.buyer_sku_code
                      ? 'border-color:#6366f1;background:linear-gradient(135deg,#f5f3ff,#ede9fe);box-shadow:0 4px 16px rgba(99,102,241,0.2)'
                      : 'border-color:#e8edf5;background:white'">
                    <!-- Selected checkmark -->
                    <div v-if="selectedProduct?.buyer_sku_code===p.buyer_sku_code"
                      style="position:absolute;top:8px;right:8px;width:18px;height:18px;background:#6366f1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;color:white">✓</div>
                    <div style="font-size:24px;margin-bottom:6px">💎</div>
                    <div style="font-size:12px;font-weight:700;color:#1e293b;margin-bottom:6px;line-height:1.3">{{ cleanName(p.product_name) }}</div>
                    <div style="font-size:15px;font-weight:900;color:#6366f1">{{ fmtRp(p.price) }}</div>
                  </button>
                </div>
              </div>

              <!-- Step 3: Email -->
              <div v-if="selectedProduct" style="background:white;border-radius:24px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8edf5;animation:fadeIn 0.3s ease">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
                  <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:white;flex-shrink:0;box-shadow:0 4px 12px rgba(99,102,241,0.3)">3</div>
                  <div style="font-size:16px;font-weight:800;color:#0f172a">Email Konfirmasi</div>
                </div>
                <div style="position:relative">
                  <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:18px">📧</span>
                  <input v-model="buyerEmail" type="email" placeholder="email@anda.com"
                    style="width:100%;box-sizing:border-box;padding:14px 16px 14px 44px;border:2px solid #e2e8f0;border-radius:14px;font-size:15px;outline:none;color:#0f172a;background:#f8faff;transition:all 0.2s;font-weight:500"
                    @focus="$event.target.style.borderColor='#6366f1';$event.target.style.background='white';$event.target.style.boxShadow='0 0 0 4px rgba(99,102,241,0.08)';emailConfirmed=false"
                    @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff';$event.target.style.boxShadow='none'"/>
                </div>
                <div v-if="buyerEmail && buyerEmail.includes('@')"
                  style="margin-top:12px;padding:14px 16px;background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1.5px solid #fde68a;border-radius:14px;display:flex;align-items:flex-start;gap:10px">
                  <span style="font-size:18px;flex-shrink:0">⚠️</span>
                  <div style="flex:1">
                    <div style="font-size:12px;color:#92400e;margin-bottom:6px;font-weight:600">Bukti transaksi dikirim ke:</div>
                    <div style="font-size:14px;font-weight:800;color:#78350f;margin-bottom:10px">{{ buyerEmail }}</div>
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                      <input type="checkbox" v-model="emailConfirmed" style="width:16px;height:16px;accent-color:#6366f1">
                      <span style="font-size:13px;color:#92400e;font-weight:600">Email sudah benar</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Mobile: tombol bayar -->
              <div v-if="selectedProduct && !isDesktop"
                style="background:white;border-radius:24px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8edf5">
                <p v-if="orderError" style="color:#f43f5e;font-size:13px;text-align:center;margin:0 0 10px;font-weight:600">⚠️ {{ orderError }}</p>
                <button @click="showConfirm=true" :disabled="!canBuy"
                  style="width:100%;padding:17px;border:none;border-radius:16px;font-size:16px;font-weight:900;cursor:pointer;color:white;letter-spacing:0.3px;transition:all 0.2s"
                  :style="canBuy
                    ? 'background:linear-gradient(135deg,#6366f1,#4f46e5);box-shadow:0 6px 24px rgba(99,102,241,0.4)'
                    : 'background:#e2e8f0;cursor:not-allowed;color:#94a3b8'">
                  {{ ordering ? '⏳ Memproses...' : `Bayar ${fmtRp(selectedProduct.price)} →` }}
                </button>
              </div>
            </div>

            <!-- KANAN: Sticky Summary -->
            <div v-if="isDesktop" style="position:sticky;top:140px">
              <div style="background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);border:1px solid #e8edf5">

                <!-- Header summary dengan gradient -->
                <div style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:20px 24px">
                  <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:16px">Ringkasan Pesanan</div>
                  <div style="display:flex;align-items:center;gap:12px">
                    <div style="width:52px;height:52px;border-radius:14px;overflow:hidden;border:2px solid rgba(255,255,255,0.2);flex-shrink:0">
                      <img v-if="brand.logo_url || brand.banner_url"
                        :src="brand.logo_url || brand.banner_url"
                        style="width:100%;height:100%;object-fit:cover">
                      <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px;background:#0f3460">🎮</div>
                    </div>
                    <div>
                      <div style="font-size:15px;font-weight:800;color:white">{{ brand.name }}</div>
                      <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:2px">
                        {{ selectedProduct ? cleanName(selectedProduct.product_name) : 'Pilih nominal' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Detail -->
                <div style="padding:20px 24px">
                  <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <span style="font-size:13px;color:#64748b;font-weight:500">User ID</span>
                      <span style="font-size:13px;font-weight:700;color:#0f172a;font-family:monospace;background:#f1f5f9;padding:3px 8px;border-radius:6px">{{ gameId || '-' }}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <span style="font-size:13px;color:#64748b;font-weight:500">Nominal</span>
                      <span style="font-size:13px;font-weight:700;color:#0f172a;max-width:160px;text-align:right">{{ selectedProduct ? cleanName(selectedProduct.product_name) : '-' }}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <span style="font-size:13px;color:#64748b;font-weight:500">Email</span>
                      <span style="font-size:12px;font-weight:600;color:#0f172a;max-width:160px;text-align:right;word-break:break-all">{{ buyerEmail || '-' }}</span>
                    </div>

                    <div style="height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:4px 0"></div>

                    <!-- Total -->
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <span style="font-size:14px;font-weight:800;color:#0f172a">Total Bayar</span>
                      <span style="font-size:26px;font-weight:900;color:#6366f1;letter-spacing:-0.5px">
                        {{ selectedProduct ? fmtRp(selectedProduct.price) : '-' }}
                      </span>
                    </div>
                  </div>

                  <!-- Trust badges -->
                  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
                    <div v-for="t in trustItems" :key="t.label"
                      style="text-align:center;padding:10px 6px;background:#f8faff;border-radius:12px;border:1px solid #e8edf5">
                      <div style="font-size:20px;margin-bottom:4px">{{ t.icon }}</div>
                      <div style="font-size:10px;font-weight:700;color:#64748b;line-height:1.3">{{ t.label }}</div>
                    </div>
                  </div>

                  <p v-if="orderError" style="color:#f43f5e;font-size:12px;text-align:center;margin:0 0 12px;font-weight:600">⚠️ {{ orderError }}</p>

                  <button @click="showConfirm=true" :disabled="!canBuy"
                    style="width:100%;padding:17px;border:none;border-radius:16px;font-size:16px;font-weight:900;cursor:pointer;color:white;letter-spacing:0.3px;transition:all 0.2s"
                    :style="canBuy
                      ? 'background:linear-gradient(135deg,#6366f1,#4f46e5);box-shadow:0 6px 24px rgba(99,102,241,0.4)'
                      : 'background:#e2e8f0;cursor:not-allowed;color:#94a3b8'">
                    {{ ordering ? '⏳ Memproses...' : 'Bayar Sekarang →' }}
                  </button>

                  <a href="/ppob/games"
                    style="display:block;text-align:center;margin-top:12px;font-size:12px;color:#94a3b8;text-decoration:none;font-weight:600">
                    ← Pilih game lain
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </template>

    <!-- Bottom sticky mobile -->
    <div v-if="selectedProduct && !isDesktop"
      style="position:fixed;bottom:0;left:0;right:0;z-index:50;background:white;border-top:1px solid #e2e8f0;box-shadow:0 -4px 20px rgba(0,0,0,0.1)">
      <div style="padding:12px 16px 20px;max-width:600px;margin:0 auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div>
            <div style="font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Total Bayar</div>
            <div style="font-size:24px;font-weight:900;color:#6366f1;letter-spacing:-0.5px">{{ fmtRp(selectedProduct.price) }}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px;color:#64748b">{{ cleanName(selectedProduct.product_name) }}</div>
            <div style="font-size:11px;color:#94a3b8">{{ gameId }}</div>
          </div>
        </div>
        <button @click="showConfirm=true" :disabled="!canBuy"
          style="width:100%;padding:16px;border:none;border-radius:16px;font-size:16px;font-weight:900;cursor:pointer;color:white;transition:all 0.2s"
          :style="canBuy
            ? 'background:linear-gradient(135deg,#6366f1,#4f46e5);box-shadow:0 4px 16px rgba(99,102,241,0.4)'
            : 'background:#e2e8f0;color:#94a3b8'">
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
          <div style="width:64px;height:64px;border-radius:20px;overflow:hidden;margin:0 auto 12px;border:2px solid #e2e8f0">
            <img v-if="brand.logo_url || brand.banner_url"
              :src="brand.logo_url || brand.banner_url"
              style="width:100%;height:100%;object-fit:cover">
            <div v-else style="width:100%;height:100%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:28px">🎮</div>
          </div>
          <h3 style="font-size:20px;font-weight:900;color:#0f172a;margin:0 0 4px">Konfirmasi Pesanan</h3>
          <p style="font-size:13px;color:#64748b;margin:0">Periksa kembali sebelum membayar</p>
        </div>

        <div style="background:#f8faff;border-radius:20px;padding:20px;margin-bottom:20px;border:1px solid #e8edf5">
          <div v-for="row in confirmRows" :key="row.label"
            style="display:flex;justify-content:space-between;align-items:center;padding:10px 0"
            :style="row.last
              ? 'border-top:2px solid #e2e8f0;padding-top:14px;margin-top:4px'
              : 'border-bottom:1px solid #f1f5f9'">
            <span style="font-size:13px;color:#64748b;font-weight:500">{{ row.label }}</span>
            <span style="font-weight:800;text-align:right;max-width:60%"
              :style="row.last ? 'font-size:22px;color:#6366f1;letter-spacing:-0.5px' : 'font-size:13px;color:#0f172a'">
              {{ row.value }}
            </span>
          </div>
        </div>

        <div style="display:flex;gap:12px">
          <button @click="showConfirm=false"
            style="flex:1;padding:15px;border-radius:16px;background:#f1f5f9;color:#64748b;border:none;font-size:14px;font-weight:700;cursor:pointer">
            Batal
          </button>
          <button @click="bayar" :disabled="ordering"
            style="flex:2;padding:15px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;border:none;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 6px 20px rgba(99,102,241,0.4)">
            {{ ordering ? '⏳ Memproses...' : '✓ Ya, Bayar Sekarang' }}
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

const trustItems = [
  { icon: '⚡', label: 'Proses Instan' },
  { icon: '🔒', label: 'Transaksi Aman' },
  { icon: '📧', label: 'Notif Email' },
]

const canBuy = computed(() =>
  !!selectedProduct.value && !!gameId.value && emailConfirmed.value && !ordering.value
)

const gameProducts = computed(() => allProducts.value)

const confirmRows = computed(() => [
  { label: 'Game', value: brand.value?.name || '-' },
  { label: 'User ID', value: gameId.value || '-' },
  { label: 'Nominal', value: selectedProduct.value ? cleanName(selectedProduct.value.product_name) : '-' },
  { label: 'Email', value: buyerEmail.value || '-' },
  { label: 'Total', value: selectedProduct.value ? fmtRp(selectedProduct.value.price) : '-', last: true },
])

onMounted(async () => {
  isDesktop.value = window.innerWidth >= 768
  window.addEventListener('resize', () => { isDesktop.value = window.innerWidth >= 768 })
  try {
    const [brandsData, productsData] = await Promise.all([
      $fetch<any[]>('/api/ppob/game-brands'),
      $fetch<any>('/api/ppob/products?category=Games')
    ])
    const found = brandsData.find((b: any) => b.slug === slugVal)
    brand.value = found || null
    if (found) {
      const kw = found.sku_keyword.toLowerCase()
      allProducts.value = (productsData?.products ?? []).filter((p: any) =>
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
  return name
    .replace(new RegExp('^' + b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*', 'i'), '')
    .replace(/^(MOBILELEGEND|Voucher|Game|Top Up|Diamond)\s*[-–]?\s*/i, '')
    .trim() || name
}

function fmtRp(n: number) {
  if (!n) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
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
@keyframes spin {
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
}
</style>
