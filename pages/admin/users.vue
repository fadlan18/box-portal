<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-adaptive mb-1">Kelola User</h1>
        <p class="text-sm text-gray-400">{{ users.length }} pengguna terdaftar</p>
      </div>
    </div>
    <div v-if="loading" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">Memuat...</div>
    <div v-else class="glass rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead style="border-bottom:1px solid var(--dash-divider)">
          <tr>
            <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Pengguna</th>
            <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Role</th>
            <th class="text-center px-4 py-3 text-xs text-gray-500 font-semibold">Status</th>
            <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Bergabung</th>
            <th class="text-center px-4 py-3 text-xs text-gray-500 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="hover:bg-white/5 transition-colors" style="border-bottom:1px solid var(--dash-divider)">
            <td class="px-4 py-3">
              <div class="font-semibold text-adaptive">{{ u.name }}</div>
              <div class="text-xs text-gray-400">{{ u.email }}</div>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded-full text-xs font-bold"
                :style="u.role === 'admin' ? 'background:rgba(139,92,246,0.15);color:#a78bfa' : 'background:rgba(59,130,246,0.15);color:#60a5fa'">
                {{ u.role }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-xs font-bold"
                :style="u.is_active ? 'background:rgba(34,197,94,0.15);color:#4ade80' : 'background:rgba(239,68,68,0.15);color:#f87171'">
                {{ u.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td class="px-4 py-3 text-xs text-gray-400">{{ fmtDate(u.created_at) }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-1 justify-center">
                <button @click="toggleActive(u)" class="px-2 py-1 rounded-lg text-xs font-semibold"
                  :style="u.is_active ? 'background:rgba(239,68,68,0.15);color:#f87171' : 'background:rgba(34,197,94,0.15);color:#4ade80'">
                  {{ u.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                </button>
                <button v-if="u.role !== 'admin'" @click="setAdmin(u)" class="px-2 py-1 rounded-lg text-xs font-semibold"
                  style="background:rgba(139,92,246,0.15);color:#a78bfa">
                  Jadikan Admin
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })
const users = ref([])
const loading = ref(true)
onMounted(load)
async function load() {
  loading.value = true
  try {
    const headers = useRequestHeaders(['cookie'])
    const res: any = await $fetch('/api/admin/users', { credentials: 'include', headers })
    users.value = res.users || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}
async function toggleActive(u: any) {
  if (!confirm((u.is_active ? 'Nonaktifkan' : 'Aktifkan') + ' user ' + u.email + '?')) return
  await $fetch('/api/admin/users/' + u.id, { method: 'PATCH', credentials: 'include', body: { is_active: !u.is_active } })
  await load()
}
async function setAdmin(u: any) {
  if (!confirm('Jadikan ' + u.email + ' sebagai admin?')) return
  await $fetch('/api/admin/users/' + u.id, { method: 'PATCH', credentials: 'include', body: { role: 'admin' } })
  await load()
}
function fmtDate(d: string) {
  return d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
}
</script>
