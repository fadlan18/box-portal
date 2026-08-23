<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold" style="color:var(--dash-text-primary)">Riwayat Chat</h1>
        <p class="text-sm" style="color:var(--dash-text-muted)">Kelola sesi chat pengunjung</p>
      </div>
      <div class="flex gap-2">
        <button @click="runCleanup" class="px-4 py-2 rounded-xl text-sm font-semibold" style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.3)">🗑️ Bersihkan Arsip Lama</button>
        <button @click="fetchSessions" class="px-4 py-2 rounded-xl text-sm font-semibold text-adaptive" style="background:linear-gradient(135deg,#0ea5e9,#0284c7)">🔄 Refresh</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="glass p-4 rounded-2xl">
        <div class="text-2xl mb-1">{{ s.icon }}</div>
        <div class="text-2xl font-bold text-adaptive">{{ s.value }}</div>
        <div class="text-xs mt-1" style="color:var(--dash-text-muted)">{{ s.label }}</div>
      </div>
    </div>

    <!-- Filter -->
    <div class="glass p-4 rounded-2xl flex flex-wrap gap-3 items-center">
      <input v-model="search" type="text" placeholder="Cari nama, email, atau HP..."
        class="flex-1 min-w-48 px-3 py-2 rounded-xl text-sm outline-none"
        style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border);color:var(--dash-text-primary)"/>
      <div class="flex rounded-xl overflow-hidden" style="border:1px solid var(--dash-input-border)">
        <button @click="showArchived = false" class="px-4 py-2 text-xs font-semibold transition-all"
          :style="!showArchived ? 'background:#1a4fa0;color:white' : 'background:var(--dash-input-bg);color:var(--dash-text-muted)'">Aktif</button>
        <button @click="showArchived = true" class="px-4 py-2 text-xs font-semibold transition-all"
          :style="showArchived ? 'background:#64748b;color:white' : 'background:var(--dash-input-bg);color:var(--dash-text-muted)'">Diarsipkan</button>
      </div>
    </div>

    <!-- Tabel -->
    <div class="glass rounded-2xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-sm" style="color:var(--dash-text-muted)">Memuat data...</div>
      <div v-else-if="filtered.length === 0" class="p-8 text-center text-sm" style="color:var(--dash-text-muted)">
        {{ showArchived ? 'Tidak ada sesi yang diarsipkan' : 'Belum ada riwayat chat' }}
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:1px solid var(--dash-divider)">
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Pengunjung</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Kontak</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Pesan Pertama</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Waktu</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in filtered" :key="s.id" style="border-bottom:1px solid var(--dash-divider)">
              <td class="px-4 py-3">
                <div class="font-semibold text-sm" style="color:var(--dash-text-primary)">{{ s.name }}</div>
                <div class="text-xs font-mono" style="color:var(--dash-text-muted)">{{ s.session_id?.slice(0,8) }}...</div>
              </td>
              <td class="px-4 py-3">
                <div class="text-xs" style="color:var(--dash-text-primary)">{{ s.email }}</div>
                <div class="text-xs" style="color:var(--dash-text-muted)">{{ s.phone }}</div>
              </td>
              <td class="px-4 py-3"><div class="text-xs max-w-xs truncate" style="color:var(--dash-text-muted)">{{ s.first_message }}</div></td>
              <td class="px-4 py-3 text-xs" style="color:var(--dash-text-muted)">{{ fmtDate(s.started_at) }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button @click="archiveSession(s)" class="text-xs px-2 py-1 rounded-lg font-semibold"
                    :style="s.is_archived ? 'background:rgba(34,197,94,0.15);color:#4ade80' : 'background:rgba(100,116,139,0.15);color:#94a3b8'">
                    {{ s.is_archived ? '↩ Restore' : '📁 Arsip' }}
                  </button>
                  <button v-if="s.is_archived" @click="deleteSession(s)" class="text-xs px-2 py-1 rounded-lg font-semibold" style="background:rgba(239,68,68,0.15);color:#f87171">🗑️ Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'admin' })

const sessions = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const showArchived = ref(false)
const cleanupResult = ref<number | null>(null)

const GQL = `query { chat_sessions(order_by:{started_at:desc},limit:200) {
  id session_id name email phone first_message message_count started_at last_activity is_archived archived_at
}}`

async function fetchSessions() {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/graphql/proxy', { method: 'POST', body: { query: GQL } }).catch(() => null)
    sessions.value = res?.data?.chat_sessions ?? []
  } finally { loading.value = false }
}

onMounted(() => fetchSessions())

const filtered = computed(() => {
  let list = sessions.value.filter(s => s.is_archived === showArchived.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(s => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.phone?.includes(q))
  }
  return list
})

const stats = computed(() => {
  const today = new Date(); today.setHours(0,0,0,0)
  const active = sessions.value.filter(s => !s.is_archived)
  return [
    { icon: '💬', label: 'Total Aktif', value: active.length },
    { icon: '📅', label: 'Hari Ini', value: active.filter(s => new Date(s.started_at) >= today).length },
    { icon: '📨', label: 'Total Pesan', value: active.reduce((a,s) => a+(s.message_count||0), 0) },
    { icon: '📁', label: 'Diarsipkan', value: sessions.value.filter(s => s.is_archived).length },
  ]
})

const fmtDate = (d: string) => d ? new Date(d).toLocaleString('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '-'

async function archiveSession(s: any) {
  await $fetch('/api/admin/chat/archive', { method: 'POST', body: { id: s.id, restore: s.is_archived } }).catch(() => {})
  await fetchSessions()
}

async function deleteSession(s: any) {
  if (!confirm(`Hapus permanen sesi chat "${s.name}"?`)) return
  await $fetch('/api/admin/chat/delete', { method: 'POST', body: { id: s.id } }).catch(() => {})
  await fetchSessions()
}

async function runCleanup() {
  if (!confirm('Hapus semua arsip chat lebih dari 30 hari?')) return
  const res = await $fetch<any>('/api/admin/chat/cleanup', { method: 'POST' }).catch(() => ({ deleted: 0 }))
  cleanupResult.value = res.deleted || 0
  await fetchSessions()
}
</script>
