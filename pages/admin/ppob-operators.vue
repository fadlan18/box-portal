<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-white mb-1">Operator PPOB</h1>
        <p class="text-sm text-gray-400">Kelola operator Pulsa & E-Money — logo, urutan, aktif/nonaktif</p>
      </div>
      <button @click="openAdd" class="px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style="background:linear-gradient(135deg,#0ea5e9,#0284c7)">+ Tambah</button>
    </div>

    <!-- Tab kategori -->
    <div class="flex gap-2">
      <button v-for="cat in ['Pulsa','EMoney']" :key="cat"
        @click="activeCategory=cat;fetchBrands()"
        class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        :style="activeCategory===cat
          ? 'background:#1a4fa0;color:white'
          : 'background:rgba(255,255,255,0.08);color:#94a3b8'">
        {{ cat === 'Pulsa' ? '📱 Pulsa & Data' : '💳 E-Money' }}
      </button>
    </div>

    <!-- Grid brand -->
    <div v-if="loading" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">Memuat...</div>
    <div v-else class="grid grid-cols-1 gap-3">
      <div v-for="brand in brands" :key="brand.id"
        class="glass rounded-2xl p-4 flex items-center gap-4">
        <div style="width:64px;height:48px;border-radius:10px;overflow:hidden;background:#1e293b;flex-shrink:0;display:flex;align-items:center;justify-content:center">
          <img v-if="brand.logo_url" :src="brand.logo_url" :alt="brand.name"
            style="max-width:60px;max-height:44px;object-fit:contain">
          <span v-else style="font-size:24px">📱</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-white text-sm">{{ brand.name }}</span>
            <span v-if="brand.badge_text" class="px-2 py-0.5 rounded-full text-xs font-bold"
              style="background:rgba(251,191,36,0.15);color:#fbbf24">{{ brand.badge_text }}</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
              :style="brand.is_active ? 'background:rgba(34,197,94,0.15);color:#4ade80' : 'background:rgba(239,68,68,0.15);color:#f87171'">
              {{ brand.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>
          <div class="text-xs text-gray-400 mt-1">SKU: <span class="font-mono text-gray-300">{{ brand.sku_keyword }}</span> · Urutan: {{ brand.sort_order }}</div>
        </div>
        <div class="flex gap-2 flex-shrink-0">
          <button @click="openEdit(brand)" class="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style="background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.2)">✏️ Edit</button>
          <button @click="hapus(brand)" class="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style="background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.2)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.75)" @click.self="modal=null">
      <div class="glass rounded-2xl p-6 w-full max-w-lg space-y-4" style="max-height:90vh;overflow-y:auto">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-white">{{ modal.id ? 'Edit' : 'Tambah' }} Operator</h3>
          <button @click="modal=null" class="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <!-- Preview & upload logo -->
        <div class="flex items-center gap-4">
          <div style="width:80px;height:60px;border-radius:12px;overflow:hidden;background:#1e293b;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <img v-if="modal.logo_url" :src="modal.logo_url" style="max-width:76px;max-height:56px;object-fit:contain">
            <span v-else style="font-size:28px">📱</span>
          </div>
          <div class="flex-1">
            <label class="text-xs font-semibold text-gray-400 block mb-2">Upload Logo (transparan/PNG)</label>
            <input type="file" accept="image/*" @change="uploadLogo" class="text-xs text-gray-300 w-full" :disabled="uploading">
            <div v-if="uploading" class="text-xs text-blue-400 mt-1">⏳ Mengupload...</div>
          </div>
        </div>

        <!-- Banner card -->
        <div class="flex items-center gap-4">
          <div style="width:80px;height:60px;border-radius:12px;overflow:hidden;background:#1e293b;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <img v-if="modal.banner_url" :src="modal.banner_url" style="width:100%;height:100%;object-fit:cover">
            <span v-else style="font-size:20px;color:#64748b">🖼️</span>
          </div>
          <div class="flex-1">
            <label class="text-xs font-semibold text-gray-400 block mb-2">Upload Banner Card (artwork/gambar penuh)</label>
            <input type="file" accept="image/*" @change="uploadBanner" class="text-xs text-gray-300 w-full" :disabled="uploadingBanner">
            <div v-if="uploadingBanner" class="text-xs text-blue-400 mt-1">⏳ Mengupload...</div>
            <div v-if="modal.banner_url" class="text-xs text-green-400 mt-1">✓ Banner tersimpan</div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Nama</label>
              <input v-model="modal.name" type="text" placeholder="Telkomsel"
                class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Slug</label>
              <input v-model="modal.slug" type="text" placeholder="telkomsel"
                class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none font-mono"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Kategori</label>
              <select v-model="modal.category"
                class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
                <option value="Pulsa">Pulsa & Data</option>
                <option value="EMoney">E-Money</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Urutan</label>
              <input v-model.number="modal.sort_order" type="number"
                class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
            </div>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-1">SKU Keyword</label>
            <input v-model="modal.sku_keyword" type="text" placeholder="TELKOMSEL"
              class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none font-mono"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-1">Badge (opsional)</label>
            <input v-model="modal.badge_text" type="text" placeholder="Terlaris / Promo"
              class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
          </div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="modal.is_active" class="w-4 h-4">
            <span class="text-sm text-gray-300">Aktif</span>
          </label>
        </div>

        <div class="flex gap-2 pt-2">
          <button @click="modal=null" class="flex-1 py-2 rounded-xl text-sm font-semibold text-gray-400"
            style="background:var(--dash-input-bg)">Batal</button>
          <button @click="simpan" :disabled="saving" class="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
            style="background:linear-gradient(135deg,#0ea5e9,#0284c7)">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })
const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const brands = ref<any[]>([])
const modal = ref<any>(null)
const activeCategory = ref('Pulsa')

const GQL = (cat: string) => `query {
  ppob_operator_brands(
    where: {category: {_eq: "${cat}"}}
    order_by: {sort_order: asc}
  ) { id name slug logo_url category sku_keyword badge_text is_active sort_order }
}`

async function fetchBrands() {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/graphql/proxy', {
      method: 'POST', body: { query: GQL(activeCategory.value) }
    })
    brands.value = res.data?.ppob_operator_brands ?? []
  } finally { loading.value = false }
}
onMounted(fetchBrands)

function openAdd() {
  modal.value = { name:'', slug:'', logo_url:'', banner_url:'', category: activeCategory.value,
    sku_keyword:'', badge_text:'', is_active:true, sort_order:99 }
}
function openEdit(b: any) { modal.value = { ...b } }

async function uploadLogo(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'operators')
    const res = await $fetch<any>('/api/admin/upload-asset', { method: 'POST', body: fd })
    modal.value.logo_url = res.url
  } catch (e: any) {
    alert('Upload gagal: ' + (e?.data?.message || e.message))
  } finally { uploading.value = false }
}

const uploadingBanner = ref(false)
async function uploadBanner(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingBanner.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'operator-banners')
    const res = await $fetch<any>('/api/admin/upload-asset', { method: 'POST', body: fd })
    modal.value.banner_url = res.url
  } catch (e: any) {
    alert('Upload banner gagal: ' + (e?.data?.message || e.message))
  } finally { uploadingBanner.value = false }
}

async function simpan() {
  saving.value = true
  try {
    await $fetch('/api/admin/ppob-operator-brands', {
      method: 'POST',
      body: { action: modal.value.id ? 'update' : 'insert', data: modal.value }
    })
    modal.value = null
    await fetchBrands()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal')
  } finally { saving.value = false }
}

async function hapus(b: any) {
  if (!confirm(`Hapus "${b.name}"?`)) return
  await $fetch('/api/admin/ppob-operator-brands', {
    method: 'POST', body: { action: 'delete', data: { id: b.id } }
  })
  await fetchBrands()
}
</script>
