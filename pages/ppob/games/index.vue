<template>
  <PpobLayout>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 20px 32px">
      <div style="max-width:1280px;margin:0 auto">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;font-size:24px">🎮</div>
          <div>
            <h1 style="font-size:24px;font-weight:900;color:white;margin:0;letter-spacing:-0.5px">Voucher Game</h1>
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0">Top up diamond & voucher game favorit kamu</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Game -->
    <div style="max-width:1280px;margin:0 auto;padding:32px 20px 48px">

      <!-- Loading skeleton -->
      <div v-if="loading" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
        <div v-for="i in 8" :key="i"
          style="aspect-ratio:2/3;border-radius:20px;background:#e2e8f0;animation:skeleton 1.5s ease infinite"></div>
      </div>

      <!-- Grid brands -->
      <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
        <a v-for="brand in brands" :key="brand.id"
          :href="`/ppob/games/${brand.slug}`"
          class="game-card"
          style="position:relative;border-radius:20px;overflow:hidden;text-decoration:none;display:flex;flex-direction:column;background:#1a1a2e;box-shadow:0 4px 16px rgba(0,0,0,0.12);transition:all 0.3s ease;aspect-ratio:2/3">

          <!-- Cover image area -->
          <div style="position:relative;flex:1;overflow:hidden;min-height:0">
            <img v-if="brand.banner_url || brand.logo_url"
              :src="brand.banner_url || brand.logo_url"
              :alt="brand.name"
              class="game-card-img"
              style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s ease">
            <div v-else
              style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e,#0f3460);font-size:56px">
              🎮
            </div>

            <!-- Badge -->
            <div v-if="brand.badge_text"
              style="position:absolute;top:10px;left:10px;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:800;background:#f59e0b;color:white;letter-spacing:0.5px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
              {{ brand.badge_text }}
            </div>

            <!-- Hover overlay Top Up -->
            <div class="game-card-hover"
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
        </a>
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

  </PpobLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Voucher Game — miTRANZ' })

const loading = ref(true)
const brands = ref<any[]>([])
const allProducts = ref<any[]>([])

const trustBadges = [
  { icon: '⚡', label: 'Proses Instan', desc: 'Dalam hitungan detik' },
  { icon: '🔒', label: 'Transaksi Aman', desc: 'Enkripsi penuh' },
  { icon: '📧', label: 'Konfirmasi Email', desc: 'Bukti langsung ke inbox' },
  { icon: '🕐', label: 'Layanan 24 Jam', desc: 'Kapan saja, di mana saja' },
]

onMounted(async () => {
  try {
    const [brandsData, productsData] = await Promise.all([
      $fetch<any[]>('/api/ppob/game-brands'),
      $fetch<any>('/api/ppob/products-raw')
    ])
    brands.value = brandsData
    allProducts.value = (productsData?.products ?? []).filter((p: any) => p.category === 'Games')
  } finally {
    loading.value = false
  }
})

function getProductCount(brand: any) {
  const kw = brand.sku_keyword.toLowerCase()
  return allProducts.value.filter((p: any) =>
    p.brand?.toLowerCase().includes(kw) ||
    p.product_name?.toLowerCase().includes(kw)
  ).length
}
</script>

<style>
@keyframes skeleton {
  0%, 100% { opacity: 0.5 }
  50% { opacity: 1 }
}
.game-card:hover {
  transform: translateY(-6px) !important;
  box-shadow: 0 20px 48px rgba(0,0,0,0.25) !important;
}
.game-card:hover .game-card-img {
  transform: scale(1.07);
}
.game-card:hover .game-card-hover {
  opacity: 1 !important;
}
</style>
