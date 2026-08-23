<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-adaptive mb-1">Support Tickets</h1>
        <p class="text-sm text-gray-400">Ajukan pertanyaan atau kendala kepada tim kami</p>
      </div>
      <button @click="showForm = true"
        class="px-4 py-2.5 rounded-xl text-sm font-bold"
        style="background:#1a4fa0;color:#ffffff">
        + Buat Tiket
      </button>
    </div>

    <!-- Form buat tiket baru -->
    <div v-if="showForm" class="glass rounded-2xl p-6 space-y-4">
      <h2 class="font-bold text-adaptive text-lg">Buat Tiket Baru</h2>
      <div>
        <label class="text-xs font-semibold text-gray-400 block mb-2">Subject</label>
        <input v-model="form.subject" type="text" placeholder="Deskripsikan masalah Anda secara singkat"
          class="w-full px-4 py-3 rounded-xl text-sm outline-none text-adaptive"
          style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)" />
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-400 block mb-2">Prioritas</label>
        <select v-model="form.priority"
          class="w-full px-4 py-3 rounded-xl text-sm outline-none text-adaptive"
          style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)">
          <option value="low">Rendah</option>
          <option value="normal">Normal</option>
          <option value="high">Tinggi</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-400 block mb-2">Pesan</label>
        <textarea v-model="form.message" rows="4" placeholder="Jelaskan kendala atau pertanyaan Anda..."
          class="w-full px-4 py-3 rounded-xl text-sm outline-none text-adaptive resize-none"
          style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)"></textarea>
      </div>
      <p v-if="formError" class="text-red-400 text-sm">⚠️ {{ formError }}</p>
      <div class="flex gap-3">
        <button @click="showForm = false"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold"
          style="background:var(--dash-input-bg);color:var(--dash-text-muted);border:1px solid var(--dash-card-border)">
          Batal
        </button>
        <button @click="createTicket" :disabled="submitting"
          class="px-6 py-2.5 rounded-xl text-sm font-bold"
          style="background:#1a4fa0;color:#ffffff">
          {{ submitting ? 'Mengirim...' : 'Kirim Tiket' }}
        </button>
      </div>
    </div>

    <!-- List tiket -->
    <div v-if="loading" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">Memuat tiket...</div>
    <div v-else-if="!tickets.length" class="glass p-8 rounded-2xl text-center">
      <div class="text-4xl mb-3">🎫</div>
      <div class="text-adaptive font-semibold mb-1">Belum ada tiket</div>
      <p class="text-gray-400 text-sm">Buat tiket baru jika Anda membutuhkan bantuan</p>
    </div>
    <div v-else class="space-y-3">
      <NuxtLink v-for="t in tickets" :key="t.id" :to="`/tickets/${t.id}`"
        class="glass rounded-2xl p-5 block hover:bg-white/5 transition-all">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-bold text-adaptive text-base">{{ t.subject }}</h3>
          <div class="flex items-center gap-2 ml-3 shrink-0">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold"
              :style="priorityStyle(t.priority)">{{ priorityLabel(t.priority) }}</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold"
              :style="statusStyle(t.status)">{{ statusLabel(t.status) }}</span>
          </div>
        </div>
        <div v-if="t.ticket_messages?.[0]" class="text-gray-400 text-sm truncate mb-2">
          {{ t.ticket_messages[0].is_staff ? '[Staff] ' : '' }}{{ t.ticket_messages[0].message }}
        </div>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>{{ t.ticket_messages_aggregate?.aggregate?.count || 0 }} pesan</span>
          <span>{{ fmtDate(t.updated_at) }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const tickets = ref([])
const loading = ref(true)
const showForm = ref(false)
const submitting = ref(false)
const formError = ref('')
const form = reactive({ subject: '', message: '', priority: 'normal' })

onMounted(load)

async function load() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/tickets', { credentials: 'include' })
    tickets.value = res.tickets || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

async function createTicket() {
  formError.value = ''
  if (!form.subject) { formError.value = 'Subject wajib diisi'; return }
  if (!form.message) { formError.value = 'Pesan wajib diisi'; return }
  submitting.value = true
  try {
    const res: any = await $fetch('/api/tickets', {
      method: 'POST', credentials: 'include', body: { ...form }
    })
    if (res.ok) {
      showForm.value = false
      form.subject = ''; form.message = ''; form.priority = 'normal'
      await load()
      navigateTo('/tickets/' + res.ticket.id)
    }
  } catch (e: any) {
    formError.value = e?.data?.message || 'Gagal membuat tiket'
  } finally { submitting.value = false }
}

function statusLabel(s: string) {
  return { open: 'Open', answered: 'Dijawab', closed: 'Ditutup' }[s] || s
}
function statusStyle(s: string) {
  return { open: 'background:rgba(59,130,246,0.15);color:#60a5fa', answered: 'background:rgba(34,197,94,0.15);color:#4ade80', closed: 'background:rgba(255,255,255,0.08);color:#94a3b8' }[s] || ''
}
function priorityLabel(s: string) {
  return { low: 'Rendah', normal: 'Normal', high: 'Tinggi' }[s] || s
}
function priorityStyle(s: string) {
  return { low: 'background:rgba(148,163,184,0.15);color:#94a3b8', normal: 'background:rgba(251,191,36,0.15);color:#fbbf24', high: 'background:rgba(239,68,68,0.15);color:#f87171' }[s] || ''
}
function fmtDate(d: string) {
  return d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
}
</script>
