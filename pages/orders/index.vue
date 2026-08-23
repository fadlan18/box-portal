<template>
  <div class="space-y-6">
    <!-- Progress Steps -->
    <div class="flex items-center gap-2 mb-8">
      <template v-for="(s, i) in steps" :key="i">
        <div class="flex items-center gap-2 cursor-pointer" @click="goStep(i)">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            :style="step > i ? 'background:#10b981;color:white'
              : step === i ? 'background:rgba(16,185,129,0.15);color:#10b981;border:2px solid #10b981'
              : 'background:rgba(0,0,0,0.06);color:#9ca3af;border:2px solid rgba(0,0,0,0.1)'">
            <span v-if="step > i">✓</span>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="text-xs font-semibold hidden sm:block"
            :style="step === i ? 'color:#10b981' : step > i ? 'color:#10b981' : 'color:#9ca3af'">{{ s }}</span>
        </div>
        <div v-if="i < steps.length - 1" class="h-px flex-1 max-w-16 transition-all"
          :style="step > i ? 'background:#10b981' : 'background:rgba(0,0,0,0.08)'"/>
      </template>
    </div>

    <!-- Step 1: Kategori -->
    <Transition name="slide-fade" mode="out-in">
    <div v-if="step === 0" key="step0">
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-1" style="color:var(--dash-text-primary)">Pilih Kategori Layanan</h2>
        <p class="text-sm" style="color:var(--dash-text-muted)">Apa yang ingin Anda pesan hari ini?</p>
      </div>
      <div v-if="productLoading" class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="rounded-3xl animate-pulse h-56" style="background:var(--dash-card-bg)"/>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <button v-for="c in visibleCategories" :key="c.val"
          @click="selectCategory(c)"
          class="group relative rounded-2xl text-left transition-all duration-200 p-6 flex flex-col"
          style="background:var(--dash-card-bg);cursor:pointer;height:200px"
          :style="'border:1.5px solid ' + c.border"
          @mouseenter="e => { (e.currentTarget as HTMLElement).style.transform='translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px '+c.shadow }"
          @mouseleave="e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='none' }">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4"
            :style="'background:' + c.iconBg">{{ c.icon }}</div>
          <div class="text-base font-bold mb-1" style="color:var(--dash-text-primary)">{{ c.label }}</div>
          <div class="text-xs leading-relaxed flex-1" style="color:var(--dash-text-muted)">{{ c.desc }}</div>
          <div class="flex items-center justify-between mt-4 pt-3" :style="'border-top:1px solid ' + c.border">
            <span class="text-xs font-semibold flex items-center gap-1 transition-all" :style="'color:' + c.accent">
              {{ c.count }} produk tersedia →
            </span>
          </div>
        </button>
      </div>
    </div>
    </Transition>

    <!-- Step 2: Produk -->
    <Transition name="slide-fade" mode="out-in">
    <div v-if="step === 1" key="step1">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold" style="color:var(--dash-text-primary)">{{ selectedCategory?.label }}</h2>
          <p class="text-sm" style="color:var(--dash-text-muted)">Pilih produk yang sesuai kebutuhan</p>
        </div>
        <button @click="step = 0" class="text-xs font-semibold px-4 py-2 rounded-xl border transition-all"
          style="color:var(--dash-text-muted);border-color:var(--dash-card-border);background:var(--dash-card-bg)">← Kembali</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button v-for="p in filtered" :key="p.id"
          @click="selectProduct(p)"
          class="rounded-2xl p-5 text-left transition-all duration-200 group"
          style="background:var(--dash-card-bg);border:1px solid var(--dash-card-border)"
          @mouseenter="e => { (e.currentTarget as HTMLElement).style.borderColor='#10b981'; (e.currentTarget as HTMLElement).style.transform='translateY(-2px)' }"
          @mouseleave="e => { (e.currentTarget as HTMLElement).style.borderColor='var(--dash-card-border)'; (e.currentTarget as HTMLElement).style.transform='translateY(0)' }">
          <div class="flex items-start gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style="background:rgba(16,185,129,0.1)">
              {{ catIcon(p.category) }}
            </div>
            <div>
              <div class="font-semibold text-sm" style="color:var(--dash-text-primary)">{{ p.name }}</div>
              <div class="text-xs uppercase tracking-wide" style="color:var(--dash-text-muted)">{{ p.category }}</div>
            </div>
          </div>
          <p class="text-xs leading-relaxed line-clamp-2 mb-3" style="color:var(--dash-text-muted)">{{ p.short_desc }}</p>
          <div v-if="p.category === 'ppob'" class="flex items-center justify-between pt-3" style="border-top:1px solid var(--dash-divider)">
            <span class="text-xs" style="color:var(--dash-text-muted)">Transaksi langsung</span>
            <span class="text-xs font-semibold" style="color:#10b981">Buka halaman →</span>
          </div>
          <div v-else-if="getPricingOptions(p).length > 0" class="flex items-center justify-between pt-3" style="border-top:1px solid var(--dash-divider)">
            <span class="text-xs" style="color:var(--dash-text-muted)">Mulai dari</span>
            <span class="text-sm font-bold" style="color:#10b981">{{ rp(Math.min(...getPricingOptions(p).map((o:any) => o.amount))) }}</span>
          </div>
        </button>
      </div>
    </div>
    </Transition>

    <!-- Step 3: Paket -->
    <Transition name="slide-fade" mode="out-in">
    <div v-if="step === 2" key="step2">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold" style="color:var(--dash-text-primary)">{{ selectedProduct?.name }}</h2>
          <p class="text-sm" style="color:var(--dash-text-muted)">Pilih paket yang sesuai</p>
        </div>
        <button @click="step = 1" class="text-xs font-semibold px-4 py-2 rounded-xl border"
          style="color:var(--dash-text-muted);border-color:var(--dash-card-border);background:var(--dash-card-bg)">← Kembali</button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Summary -->
        <div class="space-y-4">
          <div class="rounded-2xl p-5" style="background:var(--dash-card-bg);border:1px solid var(--dash-card-border)">
            <h3 class="text-sm font-semibold mb-3" style="color:var(--dash-text-primary)">Detail Layanan</h3>
            <p class="text-xs leading-relaxed" style="color:var(--dash-text-muted)">{{ selectedProduct?.short_desc }}</p>
          </div>
          <div v-if="selectedOpt" class="rounded-2xl p-5" style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.25)">
            <h3 class="text-sm font-semibold mb-3" style="color:#10b981">Ringkasan Order</h3>
            <div class="space-y-2 text-xs mb-4">
              <div class="flex justify-between"><span style="color:var(--dash-text-muted)">Produk</span><span style="color:var(--dash-text-primary)">{{ selectedProduct?.name }}</span></div>
              <div class="flex justify-between"><span style="color:var(--dash-text-muted)">Paket</span><span style="color:var(--dash-text-primary)">{{ selectedOpt?.label }}</span></div>
              <div class="flex justify-between pt-2" style="border-top:1px solid var(--dash-divider)">
                <span class="font-bold" style="color:var(--dash-text-primary)">Total</span>
                <span class="font-bold text-base" style="color:#10b981">{{ rp(selectedOpt?.amount) }}</span>
              </div>
            </div>
            <button @click="handleOrder(selectedProduct)" :disabled="ordering"
              class="w-full py-3 rounded-xl font-bold text-sm text-white"
              style="background:linear-gradient(135deg,#059669,#10b981);box-shadow:0 4px 16px rgba(16,185,129,0.35)">
              {{ ordering ? 'Memproses...' : 'Order — ' + rp(selectedOpt?.amount) }}
            </button>
          </div>
        </div>
        <!-- Paket -->
        <div class="lg:col-span-2 rounded-2xl p-5" style="background:var(--dash-card-bg);border:1px solid var(--dash-card-border)">
          <h3 class="text-sm font-semibold mb-4" style="color:var(--dash-text-primary)">Pilih Paket</h3>
          <div class="space-y-3">
            <button v-for="opt in getPricingOptions(selectedProduct)" :key="opt.id"
              @click="selectedOpt = opt"
              class="w-full p-4 rounded-xl text-left transition-all"
              :style="selectedOpt?.id === opt.id
                ? 'background:rgba(16,185,129,0.08);border:2px solid #10b981'
                : 'background:var(--dash-input-bg);border:2px solid var(--dash-input-border)'">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    :style="selectedOpt?.id === opt.id ? 'border-color:#10b981' : 'border-color:var(--dash-input-border)'">
                    <div v-if="selectedOpt?.id === opt.id" class="w-2.5 h-2.5 rounded-full" style="background:#10b981"/>
                  </div>
                  <div>
                    <div class="text-sm font-semibold" style="color:var(--dash-text-primary)">{{ opt.label }}</div>
                    <div class="text-xs" style="color:var(--dash-text-muted)">Periode: {{ opt.period }}</div>
                  </div>
                </div>
                <div class="text-base font-bold" style="color:var(--dash-text-primary)">{{ rp(opt.amount) }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    </Transition>

    <!-- Modal sukses -->
    <div v-if="orderSuccess" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="orderSuccess = null">
      <div class="rounded-3xl p-8 max-w-sm w-full text-center" style="background:var(--dash-card-bg);border:1px solid var(--dash-card-border)">
        <div class="text-5xl mb-4">🎉</div>
        <h3 class="font-bold text-xl mb-2" style="color:var(--dash-text-primary)">Order Berhasil!</h3>
        <p class="text-sm mb-6" style="color:var(--dash-text-muted)">Tim kami akan segera memproses pesanan Anda.</p>
        <button @click="orderSuccess = null; step = 0" class="w-full py-2.5 rounded-xl text-sm font-bold text-white" style="background:linear-gradient(135deg,#059669,#10b981)">Order Lagi</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const { products, categories, loading: productLoading, fetchProducts, fetchCategories } = useProducts()
const { createOrder, getPricingOptions, rp } = useOrders()

const step = ref(0)
const steps = ['Kategori', 'Produk', 'Paket & Order']
const activeCat = ref('')
const selectedCategory = ref<any>(null)
const selectedProduct = ref<any>(null)
const selectedOpt = ref<any>(null)
const ordering = ref(false)
const orderSuccess = ref<any>(null)

const catMeta: Record<string, any> = {
  'website': { icon:'🖥️', desc:'Website profesional untuk bisnis, UMKM, dan instansi pemerintah desa', accent:'#2563eb', iconBg:'rgba(37,99,235,0.08)', border:'rgba(37,99,235,0.15)', shadow:'rgba(37,99,235,0.08)' },
  'ppob':    { icon:'⚡', desc:'Token listrik PLN, pulsa, paket data, e-wallet, dan berbagai utilitas digital', accent:'#059669', iconBg:'rgba(5,150,105,0.08)', border:'rgba(5,150,105,0.15)', shadow:'rgba(5,150,105,0.08)' },
  'hiburan': { icon:'🎮', desc:'Voucher game, top up diamond, streaming, dan layanan hiburan digital', accent:'#7c3aed', iconBg:'rgba(124,58,237,0.08)', border:'rgba(124,58,237,0.15)', shadow:'rgba(124,58,237,0.08)' },
}

const defaultMeta = { icon:'📦', desc:'', accent:'#64748b', iconBg:'rgba(100,116,139,0.08)', border:'rgba(100,116,139,0.15)', shadow:'rgba(0,0,0,0.06)' }

const visibleCategories = computed(() =>
  categories.value.filter((c: any) => c.status === 'visible').map((c: any) => ({
    val: c.slug, label: c.name,
    ...( catMeta[c.slug] || defaultMeta ),
    count: products.value.filter((p: any) => p.category === c.slug).length,
  }))
)

const catIcon = (c: string) => ({ website:'🖥️', ppob:'⚡', hiburan:'🎮' }[c] || '📦')

const filtered = computed(() => products.value.filter((p: any) => p.category === activeCat.value))

const ppobRoutes: Record<string, string> = {
  'Token Listrik': '/ppob/pln', 'Pulsa & Paket Data': '/ppob/pulsa',
  'Top Up E-Wallet': '/ppob/emoney', 'TV Kabel': '/ppob/tv', 'Voucher Game': '/ppob/games',
}

function selectCategory(c: any) {
  activeCat.value = c.val; selectedCategory.value = c
  selectedProduct.value = null; selectedOpt.value = null; step.value = 1
}

function selectProduct(p: any) {
  if (p.category === 'ppob') { navigateTo(ppobRoutes[p.name] || '/ppob/pulsa'); return }
  selectedProduct.value = p
  const opts = getPricingOptions(p)
  selectedOpt.value = opts[0] ?? null
  step.value = 2
}

function goStep(i: number) { if (i < step.value) step.value = i }

async function handleOrder(product: any) {
  if (!selectedOpt.value) return
  ordering.value = true
  try {
    const order = await createOrder(product, selectedOpt.value)
    orderSuccess.value = order
  } catch (e: any) {
    alert(e.message || 'Gagal membuat order')
  } finally { ordering.value = false }
}

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories()])
})
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(24px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(-24px); }
</style>
