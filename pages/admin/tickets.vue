<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-adaptive mb-1">Kelola Tickets</h1>
        <p class="text-sm text-gray-400">{{ tickets.length }} tiket ditemukan</p>
      </div>
      <select v-model="filterStatus" @change="load"
        class="px-3 py-2 rounded-xl text-sm outline-none text-adaptive"
        style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
        <option value="">Semua Status</option>
        <option value="open">Open</option>
        <option value="answered">Dijawab</option>
        <option value="closed">Ditutup</option>
      </select>
    </div>

    <div v-if="loading" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">Memuat...</div>
    <div v-else-if="!tickets.length" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">
      Tidak ada tiket
    </div>
    <div v-else class="glass rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead style="border-bottom:1px solid var(--dash-divider)">
          <tr>
            <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Subject</th>
            <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">User</th>
            <th class="text-center px-4 py-3 text-xs text-gray-500 font-semibold">Prioritas</th>
            <th class="text-center px-4 py-3 text-xs text-gray-500 font-semibold">Status</th>
            <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Update</th>
            <th class="text-center px-4 py-3 text-xs text-gray-500 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id"
            class="hover:bg-white/5 transition-colors"
            style="border-bottom:1px solid var(--dash-divider)">
            <td class="px-4 py-3">
              <NuxtLink :to="`/tickets/${t.id}`" class="font-semibold text-adaptive hover:underline">
                {{ t.subject }}
              </NuxtLink>
              <div v-if="t.ticket_messages?.[0]" class="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                {{ t.ticket_messages[0].is_staff ? '[Staff] ' : '' }}{{ t.ticket_messages[0].message }}
              </div>
            </td>
            <td class="px-4 py-3 text-xs text-gray-400">{{ t.user_id?.slice(0,8) }}...</td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-xs font-bold" :style="priorityStyle(t.priority)">
                {{ priorityLabel(t.priority) }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-xs font-bold" :style="statusStyle(t.status)">
                {{ statusLabel(t.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-xs text-gray-400">{{ fmtDate(t.updated_at) }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-1 justify-center">
                <NuxtLink :to="`/tickets/${t.id}`"
                  class="px-2 py-1 rounded-lg text-xs font-semibold"
                  style="background:var(--dash-accent-light);color:#60a5fa">
                  Balas
                </NuxtLink>
                <button v-if="t.status !== 'closed'" @click="closeTicket(t.id)"
                  class="px-2 py-1 rounded-lg text-xs font-semibold"
                  style="background:rgba(255,255,255,0.06);color:#94a3b8">
                  Tutup
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

const tickets = ref([])
const loading = ref(true)
const filterStatus = ref('')

onMounted(load)

async function load() {
  loading.value = true
  try {
    const params = filterStatus.value ? { status: filterStatus.value } : {}
    const res: any = await $fetch('/api/admin/tickets', { credentials: 'include', query: params })
    tickets.value = res.tickets || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

async function closeTicket(id: string) {
  if (!confirm('Tutup tiket ini?')) return
  await $fetch('/api/admin/tickets/' + id, {
    method: 'PATCH', credentials: 'include', body: { status: 'closed' }
  })
  await load()
}

function statusLabel(s: string) { return { open: 'Open', answered: 'Dijawab', closed: 'Ditutup' }[s] || s }
function statusStyle(s: string) { return { open: 'background:rgba(59,130,246,0.15);color:#60a5fa', answered: 'background:rgba(34,197,94,0.15);color:#4ade80', closed: 'background:rgba(255,255,255,0.08);color:#94a3b8' }[s] || '' }
function priorityLabel(s: string) { return { low: 'Rendah', normal: 'Normal', high: 'Tinggi' }[s] || s }
function priorityStyle(s: string) { return { low: 'background:rgba(148,163,184,0.15);color:#94a3b8', normal: 'background:rgba(251,191,36,0.15);color:#fbbf24', high: 'background:rgba(239,68,68,0.15);color:#f87171' }[s] || '' }
function fmtDate(d: string) { return d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' }
</script>
