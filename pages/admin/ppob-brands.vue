<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-white mb-1">Brand PPOB</h1>
        <p class="text-sm text-gray-400">Kelola brand Game, Pulsa, dan E-Money — logo, banner, urutan</p>
      </div>
      <button @click="openAdd" class="px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style="background:linear-gradient(135deg,#0ea5e9,#0284c7)">+ Tambah</button>
    </div>

    <!-- Tab kategori -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="tab in tabs" :key="tab.value"
        @click="activeTab=tab.value;fetchBrands()"
        class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        :style="activeTab===tab.value
          ? 'background:#1a4fa0;color:white'
          : 'background:rgba(255,255,255,0.08);color:#94a3b8'">
        {{ tab.label }}
      </button>
    </div>

    <!-- Info -->
    <div class="glass p-4 rounded-2xl" style="border:1px solid rgba(99,102,241,0.3);background:rgba(99,102,241,0.08)">
      <p class="text-sm font-medium" style="color:#a5b4fc">
        🖼️ Upload <strong>Banner</strong> untuk tampilan card penuh (seperti artwork game).
        Upload <strong>Logo</strong> untuk tampil di ringkasan pesanan dan fallback card.
        <strong>SKU Keyword</strong> mencocokkan produk Digiflazz ke brand ini.
      </p>
    </div>

    <!-- Grid preview brand -->
    <div v-if="loading" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">Memuat...</div>
    <div v-else>
      <!-- Preview grid seperti frontend -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:24px">
        <div v-for="brand in brands" :key="brand.id"
          style="position:relative;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;background:#1a1a2e;box-shadow:0 4px 12px rgba(0,0,0,0.2);aspect-ratio:2/3">
          <div style="flex:1;overflow:hidden;position:relative;min-height:0">
            <img v-if="brand.banner_url || brand.logo_url"
              :src="brand.banner_url || brand.logo_url"
              style="width:100%;height:100%;object-fit:cover">
            <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1e293b,#0f172a);font-size:40px">
              🎮
            </div>
            <span v-if="brand.badge_text"
              style="position:absolute;top:6px;left:6px;padding:2px 8px;border-radius:100px;font-size:9px;font-weight:800;background:#f59e0b;color:white">
              {{ brand.badge_text }}
            </span>
            <span v-if="!brand.is_active"
              style="position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#f87171">
              NONAKTIF
            </span>
          </div>
          <div style="background:#1a1a2e;padding:10px;text-align:center;border-top:1px solid rgba(255,255,255,0.08)">
            <div style="font-size:11px;font-weight:800;color:white;margin-bottom:2px">{{ brand.name }}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.35)">{{ brand.sort_order }}. {{ brand.sku_keyword }}</div>
          </div>
          <!-- Action buttons -->
          <div style="position:absolute;top:6px;right:6px;display:flex;gap:4px">
            <button @click="openEdit(brand)"
              style="width:26px;height:26px;border-radius:8px;background:rgba(59,130,246,0.9);border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center">
              ✏️
            </button>
            <button @click="hapus(brand)"
              style="width:26px;height:26px;border-radius:8px;background:rgba(239,68,68,0.9);border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center">
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Edit/Add -->
    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.75)" @click.self="modal=null">
      <div class="glass rounded-2xl p-6 w-full max-w-lg space-y-4" style="max-height:90vh;overflow-y:auto">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-white">{{ modal.id ? 'Edit' : 'Tambah' }} Brand</h3>
          <button @click="modal=null" class="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <!-- Preview card -->
        <div style="height:120px;border-radius:14px;overflow:hidden;position:relative;background:#1a1a2e">
          <img v-if="modal.banner_url || modal.logo_url"
            :src="modal.banner_url || modal.logo_url"
            style="width:100%;height:100%;object-fit:cover">
          <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:40px">🎮</div>
          <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.8),transparent);padding:12px;text-align:center">
            <div style="font-size:13px;font-weight:800;color:white">{{ modal.name || 'Nama Brand' }}</div>
          </div>
        </div>

        <!-- Upload banner & logo -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-2">🖼️ Banner Card</label>
            <input type="file" accept="image/*" @change="uploadFile($event,'banner')"
              class="text-xs text-gray-300 w-full" :disabled="uploading.banner">
            <div v-if="uploading.banner" class="text-xs text-blue-400 mt-1">⏳ Upload...</div>
            <div v-if="modal.banner_url && !uploading.banner" class="text-xs text-green-400 mt-1">✓ Banner OK</div>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-2">🏷️ Logo (PNG)</label>
            <input type="file" accept="image/*" @change="uploadFile($event,'logo')"
              class="text-xs text-gray-300 w-full" :disabled="uploading.logo">
            <div v-if="uploading.logo" class="text-xs text-blue-400 mt-1">⏳ Upload...</div>
            <div v-if="modal.logo_url && !uploading.logo" class="text-xs text-green-400 mt-1">✓ Logo OK</div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Nama</label>
              <input v-model="modal.name" type="text"
                class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Slug</label>
              <input v-model="modal.slug" type="text"
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
                <option value="Games">🎮 Game</option>
                <option value="Pulsa">📱 Pulsa</option>
                <option value="EMoney">💳 E-Money</option>
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
            <input v-model="modal.sku_keyword" type="text"
              class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none font-mono"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-1">Badge (opsional)</label>
            <input v-model="modal.badge_text" type="text" placeholder="Populer / Promo / Baru"
              class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
          </div>

          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="modal.is_active" class="w-4 h-4">
            <span class="text-sm text-gray-300">Aktif (tampil di halaman PPOB)</span>
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

const tabs = [
  { value: 'Games', label: '🎮 Game' },
  { value: 'Pulsa', label: '📱 Pulsa' },
  { value: 'EMoney', label: '💳 E-Money' },
]

const activeTab = ref('Games')
const loading = ref(false)
const saving = ref(false)
const uploading = ref({ banner: false, logo: false })
const brands = ref<any[]>([])
const modal = ref<any>(null)

// Query berbeda untuk Games vs Operator
async function fetchBrands() {
  loading.value = true
  try {
    if (activeTab.value === 'Games') {
      const res = await $fetch<any>('/api/graphql/proxy', {
        method: 'POST',
        body: { query: `query {
          ppob_game_brands(order_by: {sort_order: asc}) {
            id name slug logo_url banner_url sku_keyword badge_text is_active sort_order
          }
        }` }
      })
      brands.value = (res.data?.ppob_game_brands ?? []).map((b: any) => ({ ...b, category: 'Games' }))
    } else {
      const res = await $fetch<any>('/api/graphql/proxy', {
        method: 'POST',
        body: { query: `query {
          ppob_operator_brands(
            where: {category: {_eq: "${activeTab.value}"}}
            order_by: {sort_order: asc}
          ) {
            id name slug logo_url banner_url sku_keyword badge_text is_active sort_order category
          }
        }` }
      })
      brands.value = res.data?.ppob_operator_brands ?? []
    }
  } finally { loading.value = false }
}
onMounted(fetchBrands)

function openAdd() {
  modal.value = {
    name: '', slug: '', logo_url: '', banner_url: '',
    category: activeTab.value, sku_keyword: '',
    badge_text: '', is_active: true, sort_order: 99
  }
}
function openEdit(b: any) { modal.value = { ...b } }

async function uploadFile(e: Event, type: 'banner' | 'logo') {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value[type] = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', activeTab.value === 'Games' ? 'game-logos' : 'operator-banners')
    const res = await $fetch<any>('/api/admin/upload-asset', { method: 'POST', body: fd })
    if (type === 'banner') modal.value.banner_url = res.url
    else modal.value.logo_url = res.url
  } catch (e: any) {
    alert('Upload gagal: ' + (e?.data?.message || e.message))
  } finally { uploading.value[type] = false }
}

async function simpan() {
  saving.value = true
  try {
    const isGame = activeTab.value === 'Games'
    const endpoint = isGame ? '/api/admin/ppob-game-brands' : '/api/admin/ppob-operator-brands'
    await $fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
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
  const isGame = b.category === 'Games'
  const endpoint = isGame ? '/api/admin/ppob-game-brands' : '/api/admin/ppob-operator-brands'
  await $fetch(endpoint, { method: 'POST', body: { action: 'delete', data: { id: b.id } } })
  await fetchBrands()
}
</script>
