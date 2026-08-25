<template>
  <PpobLayout>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 20px 32px">
      <div style="max-width:1280px;margin:0 auto">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;font-size:24px">🎮</div>
          <div>
            <h1 style="font-size:24px;font-weight:900;color:white;margin:0;letter-spacing:-0.5px">Voucher Game</h1>
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0">Top up diamond & voucher game favorit kamu</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Game -->
    <div style="max-width:1280px;margin:0 auto;padding:32px 20px">

      <!-- Loading skeleton -->
      <div v-if="loading" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
        <div v-for="i in 8" :key="i"
          style="aspect-ratio:2/3;border-radius:20px;background:#e2e8f0;animation:skeleton 1.5s ease infinite"></div>
      </div>

      <!-- Grid brands -->
      <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
        <a v-for="brand in brands" :key="brand.id"
          :href="`/ppob/games/${brand.slug}`"
          style="position:relative;border-radius:20px;overflow:hidden;text-decoration:none;display:block;aspect-ratio:2/3;background:#1a1a2e;box-shadow:0 4px 16px rgba(0,0,0,0.1);transition:all 0.25s"
          onmouseover="this.style.transform='translateY(-6px)';this.style.boxShadow='0 16px 40px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)'">

          <!-- Cover image -->
          <img v-if="brand.banner_url || brand.logo_url"
            :src="brand.banner_url || brand.logo_url"
            :alt="brand.name"
            style="width:100%;height:100%;object-fit:cover;display:block">

          <!-- Placeholder jika belum ada gambar -->
          <div v-else style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e,#0f3460)">
            <div style="font-size:56px;margin-bottom:12px">🎮</div>
            <div style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.5);text-align:center;padding:0 16px">{{ brand.name }}</div>
          </div>

          <!-- Gradient overlay bawah -->
          <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.4) 50%,transparent 100%);padding:20px 14px 14px">

            <!-- Badge -->
            <div v-if="brand.badge_text" style="margin-bottom:6px">
              <span style="padding:2px 10px;border-radius:100px;font-size:10px;font-weight:800;background:#f59e0b;color:white;letter-spacing:0.5px">
                {{ brand.badge_text }}
              </span>
            </div>

            <div style="font-size:14px;font-weight:800;color:white;line-height:1.2;margin-bottom:4px">{{ brand.name }}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.55)">{{ getProductCount(brand) }} produk</div>
          </div>

          <!-- Arrow -->
          <div style="position:absolute;top:12px;right:12px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;font-size:12px;color:white">
            →
          </div>
        </a>
      </div>

      <!-- Info bawah -->
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
  0%, 100% { opacity: 0.6 }
  50% { opacity: 1 }
}
</style>
