<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-white mb-1">Brand Game PPOB</h1>
        <p class="text-sm text-gray-400">Kelola daftar game, logo, dan urutan tampilan di halaman voucher game</p>
      </div>
      <button @click="openAdd" class="px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style="background:linear-gradient(135deg,#0ea5e9,#0284c7)">+ Tambah Game</button>
    </div>

    <!-- Info -->
    <div class="glass p-4 rounded-2xl" style="border:1px solid rgba(99,102,241,0.3);background:rgba(99,102,241,0.08)">
      <p class="text-sm font-medium" style="color:#a5b4fc">
        🎮 <strong>SKU Keyword</strong> = kata kunci untuk mencocokkan produk Digiflazz ke brand ini (misal: "Free Fire" akan menangkap semua produk yang namanya mengandung "Free Fire").
        <strong>Logo URL</strong> diisi otomatis setelah upload gambar.
      </p>
    </div>

    <!-- Grid brand -->
    <div v-if="loading" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">Memuat...</div>
    <div v-else class="grid grid-cols-1 gap-4">
      <div v-for="brand in sorted" :key="brand.id"
        class="glass rounded-2xl p-4 flex items-center gap-4">

        <!-- Logo -->
        <div style="width:64px;height:64px;border-radius:12px;overflow:hidden;background:#1e293b;flex-shrink:0;display:flex;align-items:center;justify-content:center">
          <img v-if="brand.logo_url" :src="brand.logo_url" :alt="brand.name"
            style="width:100%;height:100%;object-fit:cover">
          <span v-else style="font-size:28px">🎮</span>
        </div>

        <!-- Info -->
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
          <div class="text-xs text-gray-400 mt-1">SKU: <span class="font-mono text-gray-300">{{ brand.sku_keyword }}</span></div>
          <div class="text-xs text-gray-500 mt-0.5">Urutan: {{ brand.sort_order }}</div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 flex-shrink-0">
          <button @click="openEdit(brand)"
            class="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style="background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.2)">
            ✏️ Edit
          </button>
          <button @click="hapus(brand)"
            class="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style="background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.2)">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.75)" @click.self="modal=null">
      <div class="glass rounded-2xl p-6 w-full max-w-lg space-y-4" style="max-height:90vh;overflow-y:auto">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-white">{{ modal.id ? 'Edit' : 'Tambah' }} Brand Game</h3>
          <button @click="modal=null" class="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <!-- Preview logo -->
        <div class="flex items-center gap-4">
          <div style="width:80px;height:80px;border-radius:16px;overflow:hidden;background:#1e293b;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <img v-if="modal.logo_url" :src="modal.logo_url" style="width:100%;height:100%;object-fit:cover">
            <span v-else style="font-size:36px">🎮</span>
          </div>
          <div class="flex-1">
            <label class="text-xs font-semibold text-gray-400 block mb-2">Upload Logo Game</label>
            <input type="file" accept="image/*" @change="uploadLogo"
              class="text-xs text-gray-300 w-full" :disabled="uploading">
            <div v-if="uploading" class="text-xs text-blue-400 mt-1">⏳ Mengupload...</div>
            <div v-if="modal.logo_url && !uploading" class="text-xs text-green-400 mt-1">✓ Logo tersimpan</div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Nama Game</label>
              <input v-model="modal.name" type="text" placeholder="Free Fire"
                class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Urutan Tampil</label>
              <input v-model.number="modal.sort_order" type="number" min="1"
                class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-1">SKU Keyword</label>
            <input v-model="modal.sku_keyword" type="text" placeholder="Free Fire"
              class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none font-mono"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
            <div class="text-xs text-gray-500 mt-1">Kata kunci untuk mencocokkan produk Digiflazz</div>
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-1">Badge (opsional)</label>
            <input v-model="modal.badge_text" type="text" placeholder="Populer / Baru / Promo"
              class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
          </div>

          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="modal.is_active" class="w-4 h-4">
            <span class="text-sm text-gray-300">Aktif (tampil di halaman game)</span>
          </label>
        </div>

        <div class="flex gap-2 pt-2">
          <button @click="modal=null"
            class="flex-1 py-2 rounded-xl text-sm font-semibold text-gray-400"
            style="background:var(--dash-input-bg)">Batal</button>
          <button @click="simpan" :disabled="saving"
            class="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
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

const sorted = computed(() => [...brands.value].sort((a, b) => a.sort_order - b.sort_order))

const GQL = `query {
  ppob_game_brands(order_by: {sort_order: asc}) {
    id name logo_url sku_keyword badge_text is_active sort_order
  }
}`

async function fetch() {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/graphql/proxy', { method: 'POST', body: { query: GQL } })
    brands.value = res.data?.ppob_game_brands ?? []
  } finally { loading.value = false }
}

onMounted(fetch)

function openAdd() {
  modal.value = { name: '', logo_url: '', sku_keyword: '', badge_text: '', is_active: true, sort_order: 99 }
}
function openEdit(b: any) { modal.value = { ...b } }

async function uploadLogo(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'game-logos')
    const res = await $fetch<any>('/api/admin/upload-asset', { method: 'POST', body: fd })
    modal.value.logo_url = res.url
  } catch (e: any) {
    alert('Upload gagal: ' + (e?.data?.message || e.message))
  } finally { uploading.value = false }
}

async function simpan() {
  saving.value = true
  try {
    await $fetch('/api/admin/ppob-game-brands', {
      method: 'POST',
      body: { action: modal.value.id ? 'update' : 'insert', data: modal.value }
    })
    modal.value = null
    await fetch()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal menyimpan')
  } finally { saving.value = false }
}

async function hapus(b: any) {
  if (!confirm(`Hapus brand "${b.name}"?`)) return
  await $fetch('/api/admin/ppob-game-brands', { method: 'POST', body: { action: 'delete', data: { id: b.id } } })
  await fetch()
}
</script>
