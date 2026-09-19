<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold" style="color:var(--dash-text-primary)">Kelola Produk</h1>
        <p class="text-sm" style="color:var(--dash-text-muted)">Manajemen produk dan layanan miTRANZ</p>
      </div>
      <button @click="openAdd"
        class="px-4 py-2 rounded-xl text-sm font-bold text-white"
        style="background:linear-gradient(135deg,#1a4fa0,#2563eb)">
        + Tambah Produk
      </button>
    </div>

    <!-- Filter kategori -->
    <div class="flex flex-wrap gap-2">
      <button v-for="c in ['semua', 'website', 'ppob', 'hiburan', 'hosting', 'license']" :key="c"
        @click="filterCat = c"
        class="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
        :style="filterCat === c
          ? 'background:rgba(26,79,160,0.15);border-color:rgba(26,79,160,0.4);color:#3b82f6'
          : 'border-color:var(--dash-card-border);color:var(--dash-text-muted)'">
        {{ c.charAt(0).toUpperCase() + c.slice(1) }}
      </button>
    </div>

    <!-- Tabel produk -->
    <div class="glass rounded-2xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-sm" style="color:var(--dash-text-muted)">Memuat...</div>
      <div v-else-if="filtered.length === 0" class="p-8 text-center text-sm" style="color:var(--dash-text-muted)">Belum ada produk</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:1px solid var(--dash-divider)">
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Nama Produk</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Kategori</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Paket</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Status</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id" style="border-bottom:1px solid var(--dash-divider)">
              <td class="px-4 py-3">
                <div class="font-semibold" style="color:var(--dash-text-primary)">{{ p.name }}</div>
                <div class="text-xs mt-0.5 line-clamp-1" style="color:var(--dash-text-muted)">{{ p.short_desc }}</div>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs px-2 py-1 rounded-full font-semibold"
                  style="background:rgba(59,130,246,0.1);color:#60a5fa;border:1px solid rgba(59,130,246,0.2)">
                  {{ p.category }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs" style="color:var(--dash-text-muted)">
                  {{ p.specs?.pricing?.length || 0 }} paket
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs px-2 py-1 rounded-full font-semibold"
                  :style="p.status === 'active'
                    ? 'background:rgba(34,197,94,0.1);color:#4ade80;border:1px solid rgba(34,197,94,0.2)'
                    : 'background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.2)'">
                  {{ p.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button @click="editProduct(p)" class="text-xs px-3 py-1 rounded-lg font-semibold"
                  style="background:rgba(59,130,246,0.1);color:#60a5fa;border:1px solid rgba(59,130,246,0.2)">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal tambah/edit produk -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.7)" @click.self="closeModal">
      <div class="rounded-2xl p-6 w-full max-w-2xl space-y-5"
        style="background:var(--dash-card-bg);border:1px solid var(--dash-card-border);max-height:90vh;overflow-y:auto">

        <div class="flex items-center justify-between">
          <h3 class="font-bold text-lg" style="color:var(--dash-text-primary)">
            {{ editingProduct ? 'Edit Produk' : 'Tambah Produk' }}
          </h3>
          <button @click="closeModal" class="text-xl" style="color:var(--dash-text-muted)">✕</button>
        </div>

        <!-- Info dasar -->
        <div class="space-y-3">
          <div>
            <label class="text-xs font-semibold block mb-1" style="color:var(--dash-text-muted)">Nama Produk</label>
            <input v-model="form.name" type="text" class="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold block mb-1" style="color:var(--dash-text-muted)">Kategori</label>
              <select v-model="form.category" class="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)">
                <option value="website">website</option>
                <option value="ppob">ppob</option>
                <option value="hiburan">hiburan</option>
                <option value="hosting">hosting</option>
                <option value="license">license</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-semibold block mb-1" style="color:var(--dash-text-muted)">Status</label>
              <select v-model="form.status" class="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-xs font-semibold block mb-1" style="color:var(--dash-text-muted)">Deskripsi Singkat</label>
            <textarea v-model="form.short_desc" rows="2" class="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)"/>
          </div>
        </div>

        <!-- Kelola Pricing -->
        <div style="border-top:1px solid var(--dash-divider);padding-top:16px">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="text-sm font-bold" style="color:var(--dash-text-primary)">Paket & Harga</h4>
              <p class="text-xs" style="color:var(--dash-text-muted)">Kelola sub-opsi paket produk ini</p>
            </div>
            <button @click="addPricing"
              class="text-xs px-3 py-1.5 rounded-lg font-semibold"
              style="background:rgba(26,79,160,0.1);color:#1a4fa0;border:1px solid rgba(26,79,160,0.2)">
              + Tambah Paket
            </button>
          </div>

          <div v-if="form.pricing.length === 0" class="text-center py-4 rounded-xl text-xs"
            style="background:var(--dash-input-bg);color:var(--dash-text-muted)">
            Belum ada paket. Klik "+ Tambah Paket" untuk menambahkan.
          </div>

          <div v-else class="space-y-3">
            <div v-for="(pr, idx) in form.pricing" :key="pr.id"
              class="rounded-xl p-4 space-y-3"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-card-border)">

              <div class="flex items-center justify-between">
                <span class="text-xs font-bold" style="color:var(--dash-text-muted)">Paket #{{ idx + 1 }}</span>
                <button @click="removePricing(idx)"
                  class="text-xs px-2 py-1 rounded-lg"
                  style="color:#f87171;background:rgba(239,68,68,0.08)">
                  Hapus
                </button>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-2">
                  <label class="text-xs font-semibold block mb-1" style="color:var(--dash-text-muted)">Label Paket</label>
                  <input v-model="pr.label" type="text" placeholder="Contoh: Paket Promo 1 Tahun"
                    class="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style="background:var(--dash-card-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)"/>
                </div>
                <div>
                  <label class="text-xs font-semibold block mb-1" style="color:var(--dash-text-muted)">Harga (Rp)</label>
                  <input v-model.number="pr.amount" type="number" placeholder="0"
                    class="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style="background:var(--dash-card-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)"/>
                </div>
                <div>
                  <label class="text-xs font-semibold block mb-1" style="color:var(--dash-text-muted)">Periode</label>
                  <input v-model="pr.period" type="text" placeholder="Contoh: project / 1 thn"
                    class="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style="background:var(--dash-card-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)"/>
                </div>
                <div>
                  <label class="text-xs font-semibold block mb-1" style="color:var(--dash-text-muted)">Tipe</label>
                  <select v-model="pr.type" class="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style="background:var(--dash-card-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)">
                    <option value="main">Paket Utama</option>
                    <option value="addon">Layanan Tambahan</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-semibold block mb-1" style="color:var(--dash-text-muted)">Label Promo</label>
                  <input v-model="pr.promo_label" type="text" placeholder="Contoh: Promo / Hemat 15%"
                    class="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style="background:var(--dash-card-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)"/>
                </div>
                <div class="flex items-center gap-2 mt-4">
                  <input v-model="pr.promo" type="checkbox" :id="'promo-'+idx" class="rounded"/>
                  <label :for="'promo-'+idx" class="text-xs" style="color:var(--dash-text-muted)">Tandai sebagai Promo</label>
                </div>
              </div>

              <!-- Preview harga -->
              <div class="text-xs font-semibold mt-1" style="color:#1a4fa0">
                {{ pr.label || '—' }} →
                {{ pr.amount ? new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(pr.amount) : 'Rp 0' }}
                <span v-if="pr.type === 'addon'" class="ml-1 px-1.5 py-0.5 rounded text-xs"
                  style="background:rgba(16,185,129,0.1);color:#10b981">Tambahan</span>
                <span v-else class="ml-1 px-1.5 py-0.5 rounded text-xs"
                  style="background:rgba(26,79,160,0.1);color:#1a4fa0">Utama</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Aksi -->
        <div class="flex gap-3 pt-2" style="border-top:1px solid var(--dash-divider)">
          <button @click="closeModal" class="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
            style="color:var(--dash-text-muted);border-color:var(--dash-card-border)">Batal</button>
          <button @click="saveProduct" :disabled="saving"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
            style="background:linear-gradient(135deg,#1a4fa0,#2563eb)">
            {{ saving ? 'Menyimpan...' : 'Simpan Produk' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'admin' })

const products = ref<any[]>([])
const loading = ref(false)
const filterCat = ref('semua')
const showModal = ref(false)
const editingProduct = ref<any>(null)
const saving = ref(false)

const form = ref({
  name: '', category: 'website', short_desc: '', status: 'active',
  pricing: [] as any[]
})

const GQL_LIST = `query {
  products(order_by:{category:asc,sort_order:asc}) {
    id name category short_desc specs status sort_order featured
  }
}`

async function fetchProducts() {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/graphql/proxy', { method: 'POST', body: { query: GQL_LIST } })
    products.value = res.data?.products || []
  } finally { loading.value = false }
}

onMounted(() => fetchProducts())

const filtered = computed(() => {
  if (filterCat.value === 'semua') return products.value
  return products.value.filter((p: any) => p.category === filterCat.value)
})

function openAdd() {
  editingProduct.value = null
  form.value = { name: '', category: 'website', short_desc: '', status: 'active', pricing: [] }
  showModal.value = true
}

function editProduct(p: any) {
  editingProduct.value = p
  form.value = {
    name: p.name,
    category: p.category,
    short_desc: p.short_desc || '',
    status: p.status,
    pricing: JSON.parse(JSON.stringify(p.specs?.pricing || []))
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingProduct.value = null
  form.value = { name: '', category: 'website', short_desc: '', status: 'active', pricing: [] }
}

function addPricing() {
  form.value.pricing.push({
    id: 'p' + Date.now(),
    label: '',
    type: 'main',
    amount: 0,
    period: 'project',
    promo: false,
    promo_label: ''
  })
}

function removePricing(idx: number) {
  form.value.pricing.splice(idx, 1)
}

async function saveProduct() {
  if (!form.value.name) return alert('Nama produk wajib diisi')
  saving.value = true
  try {
    const specs = { pricing: form.value.pricing }
    if (editingProduct.value) {
      await $fetch('/api/graphql/proxy', {
        method: 'POST',
        body: {
          query: `mutation($id:uuid!,$name:String!,$cat:String!,$desc:String!,$status:String!,$specs:jsonb!) {
            update_products_by_pk(pk_columns:{id:$id},_set:{name:$name,category:$cat,short_desc:$desc,status:$status,specs:$specs}) { id }
          }`,
          variables: {
            id: editingProduct.value.id,
            name: form.value.name,
            cat: form.value.category,
            desc: form.value.short_desc,
            status: form.value.status,
            specs
          }
        }
      })
    } else {
      await $fetch('/api/graphql/proxy', {
        method: 'POST',
        body: {
          query: `mutation($name:String!,$cat:String!,$desc:String!,$status:String!,$specs:jsonb!) {
            insert_products_one(object:{name:$name,category:$cat,short_desc:$desc,status:$status,specs:$specs}) { id }
          }`,
          variables: {
            name: form.value.name,
            cat: form.value.category,
            desc: form.value.short_desc,
            status: form.value.status,
            specs
          }
        }
      })
    }
    closeModal()
    await fetchProducts()
  } finally { saving.value = false }
}
</script>
