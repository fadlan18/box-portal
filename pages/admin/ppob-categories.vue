<template>
  <div class="space-y-6">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-white mb-1">Kategori PPOB</h1>
        <p class="text-sm text-gray-400">Kelola layanan PPOB yang tampil di landing page dan halaman semua layanan</p>
      </div>
      <button @click="openAdd"
        class="px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style="background:linear-gradient(135deg,#0ea5e9,#0284c7)">
        + Tambah Layanan
      </button>
    </div>

    <!-- Info featured -->
    <div class="glass p-4 rounded-2xl" style="border:1px solid rgba(251,191,36,0.4);background:rgba(251,191,36,0.12)">
      <p class="text-sm font-medium" style="color:#92400e">
        ⭐ <strong>Featured</strong> = tampil di landing page (max 6, urut berdasarkan "Urutan").
        Yang tidak featured tetap tampil di halaman <code style="background:rgba(0,0,0,0.08);padding:1px 6px;border-radius:4px">/ppob</code>.
        Yang non-aktif tidak tampil sama sekali kecuali di halaman ini.
      </p>
    </div>

    <!-- Tabel -->
    <div class="glass rounded-2xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-400 text-sm">Memuat data...</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:1px solid var(--dash-divider)">
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Urutan</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Icon</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Nama</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Deskripsi</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">URL</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Featured</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Aktif</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in sorted" :key="cat.id"
              class="hover:bg-white/5 transition-colors"
              style="border-bottom:1px solid var(--dash-divider)">
              <td class="px-4 py-3">
                <span class="text-white font-bold">{{ cat.featured_order }}</span>
              </td>
              <td class="px-4 py-3 text-2xl">{{ cat.icon }}</td>
              <td class="px-4 py-3 font-semibold text-white">{{ cat.name }}</td>
              <td class="px-4 py-3 text-gray-400 text-xs">{{ cat.description }}</td>
              <td class="px-4 py-3 text-gray-400 text-xs font-mono">{{ cat.href }}</td>
              <td class="px-4 py-3">
                <button @click="toggleFeatured(cat)"
                  class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                  :style="cat.is_featured
                    ? 'background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)'
                    : 'background:rgba(100,116,139,0.15);color:#64748b;border:1px solid rgba(100,116,139,0.2)'">
                  {{ cat.is_featured ? '⭐ Ya' : '— Tidak' }}
                </button>
              </td>
              <td class="px-4 py-3">
                <button @click="toggleActive(cat)"
                  class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                  :style="cat.is_active
                    ? 'background:rgba(34,197,94,0.15);color:#4ade80;border:1px solid rgba(34,197,94,0.2)'
                    : 'background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.2)'">
                  {{ cat.is_active ? '✓ Aktif' : '✕ Nonaktif' }}
                </button>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button @click="openEdit(cat)"
                    class="text-xs px-2 py-1 rounded-lg font-semibold"
                    style="background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.2)">
                    ✏️ Edit
                  </button>
                  <button @click="hapus(cat)"
                    class="text-xs px-2 py-1 rounded-lg font-semibold"
                    style="background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.2)">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Edit/Add -->
    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.7)" @click.self="modal=null">
      <div class="glass rounded-2xl p-6 w-full max-w-md space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-white">{{ modal.id ? 'Edit' : 'Tambah' }} Layanan PPOB</h3>
          <button @click="modal=null" class="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Icon (emoji)</label>
              <input v-model="modal.icon" type="text" placeholder="⚡"
                class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none text-center text-2xl"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 block mb-1">Urutan Featured</label>
              <input v-model.number="modal.featured_order" type="number" min="1" max="99"
                class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-1">Nama Layanan</label>
            <input v-model="modal.name" type="text" placeholder="Token Listrik PLN"
              class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-1">Deskripsi Singkat</label>
            <input v-model="modal.description" type="text" placeholder="PLN prabayar instan"
              class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-400 block mb-1">URL Halaman</label>
            <input v-model="modal.href" type="text" placeholder="/ppob/pln"
              class="w-full px-3 py-2 rounded-xl text-sm text-white outline-none font-mono"
              style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
          </div>

          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="modal.is_featured" class="w-4 h-4">
              <span class="text-sm text-gray-300">Featured (landing page)</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="modal.is_active" class="w-4 h-4">
              <span class="text-sm text-gray-300">Aktif</span>
            </label>
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button @click="modal=null"
            class="flex-1 py-2 rounded-xl text-sm font-semibold text-gray-400"
            style="background:var(--dash-input-bg)">Batal</button>
          <button @click="simpan"
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
const categories = ref<any[]>([])
const modal = ref<any>(null)

const sorted = computed(() =>
  [...categories.value].sort((a, b) => a.featured_order - b.featured_order)
)

const GQL = `query {
  ppob_categories(order_by: {featured_order: asc}) {
    id name icon href description is_active is_featured featured_order
  }
}`

async function fetch() {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/graphql/proxy', {
      method: 'POST', body: { query: GQL }
    })
    categories.value = res.data?.ppob_categories ?? []
  } finally { loading.value = false }
}

onMounted(fetch)

function openEdit(cat: any) { modal.value = { ...cat } }
function openAdd() {
  modal.value = {
    name: '', icon: '⚡', href: '/ppob/', description: '',
    is_active: true, is_featured: false, featured_order: 99
  }
}

async function simpan() {
  saving.value = true
  try {
    await $fetch('/api/admin/ppob-categories', {
      method: 'POST',
      body: {
        action: modal.value.id ? 'update' : 'insert',
        data: modal.value
      }
    })
    modal.value = null
    await fetch()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal menyimpan')
  } finally { saving.value = false }
}

async function toggleFeatured(cat: any) {
  const featuredCount = categories.value.filter(c => c.is_featured).length
  if (!cat.is_featured && featuredCount >= 6) {
    alert('Maksimal 6 layanan featured di landing page. Nonaktifkan salah satu terlebih dahulu.')
    return
  }
  await $fetch('/api/admin/ppob-categories', {
    method: 'POST',
    body: { action: 'update', data: { ...cat, is_featured: !cat.is_featured } }
  })
  await fetch()
}

async function toggleActive(cat: any) {
  await $fetch('/api/admin/ppob-categories', {
    method: 'POST',
    body: { action: 'update', data: { ...cat, is_active: !cat.is_active } }
  })
  await fetch()
}

async function hapus(cat: any) {
  if (!confirm(`Hapus layanan "${cat.name}"?`)) return
  await $fetch('/api/admin/ppob-categories', {
    method: 'POST',
    body: { action: 'delete', data: { id: cat.id } }
  })
  await fetch()
}
</script>
