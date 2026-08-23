<template>
  <div class="space-y-6" v-if="ticket">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <NuxtLink to="/tickets" class="text-xs text-gray-400 hover:text-gray-300 mb-2 block">← Kembali</NuxtLink>
        <h1 class="font-display text-xl font-bold text-adaptive">{{ ticket.subject }}</h1>
        <div class="flex gap-2 mt-2">
          <span class="px-2 py-0.5 rounded-full text-xs font-bold" :style="priorityStyle(ticket.priority)">{{ priorityLabel(ticket.priority) }}</span>
          <span class="px-2 py-0.5 rounded-full text-xs font-bold" :style="statusStyle(ticket.status)">{{ statusLabel(ticket.status) }}</span>
        </div>
      </div>
      <div class="text-xs text-gray-500">{{ fmtDate(ticket.created_at) }}</div>
    </div>

    <!-- Thread pesan -->
    <div class="space-y-3">
      <div v-for="msg in ticket.ticket_messages" :key="msg.id"
        class="glass rounded-2xl p-4"
        :class="msg.is_staff ? 'border-l-4' : ''"
        :style="msg.is_staff ? 'border-left-color:#1a4fa0' : ''">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold" :style="msg.is_staff ? 'color:#60a5fa' : 'color:var(--dash-text-muted)'">
              {{ msg.is_staff ? '🛡️ Tim Support' : '👤 ' + msg.sender_name }}
            </span>
          </div>
          <span class="text-xs text-gray-500">{{ fmtDateTime(msg.created_at) }}</span>
        </div>
        <p class="text-sm text-adaptive whitespace-pre-wrap">{{ msg.message }}</p>
      </div>
    </div>

    <!-- Form balas -->
    <div v-if="ticket.status !== 'closed'" class="glass rounded-2xl p-5 space-y-3">
      <h3 class="font-semibold text-adaptive text-sm">Balas Tiket</h3>
      <textarea v-model="reply" rows="3" placeholder="Tulis balasan Anda..."
        class="w-full px-4 py-3 rounded-xl text-sm outline-none text-adaptive resize-none"
        style="background:var(--dash-input-bg);border:1px solid var(--dash-input-border)"></textarea>
      <p v-if="replyError" class="text-red-400 text-sm">⚠️ {{ replyError }}</p>
      <button @click="sendReply" :disabled="sending"
        class="px-6 py-2.5 rounded-xl text-sm font-bold"
        style="background:#1a4fa0;color:#ffffff">
        {{ sending ? 'Mengirim...' : 'Kirim Balasan' }}
      </button>
    </div>
    <div v-else class="glass rounded-2xl p-4 text-center text-gray-400 text-sm">
      Tiket ini telah ditutup
    </div>
  </div>
  <div v-else-if="loading" class="glass p-8 rounded-2xl text-center text-gray-400 text-sm">Memuat...</div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const ticket = ref<any>(null)
const loading = ref(true)
const reply = ref('')
const sending = ref(false)
const replyError = ref('')

onMounted(load)

async function load() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/tickets/' + route.params.id, { credentials: 'include' })
    ticket.value = res.ticket
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

async function sendReply() {
  replyError.value = ''
  if (!reply.value.trim()) { replyError.value = 'Pesan tidak boleh kosong'; return }
  sending.value = true
  try {
    await $fetch('/api/tickets/' + route.params.id + '/reply', {
      method: 'POST', credentials: 'include', body: { message: reply.value }
    })
    reply.value = ''
    await load()
  } catch (e: any) {
    replyError.value = e?.data?.message || 'Gagal mengirim'
  } finally { sending.value = false }
}

function statusLabel(s: string) { return { open: 'Open', answered: 'Dijawab', closed: 'Ditutup' }[s] || s }
function statusStyle(s: string) { return { open: 'background:rgba(59,130,246,0.15);color:#60a5fa', answered: 'background:rgba(34,197,94,0.15);color:#4ade80', closed: 'background:rgba(255,255,255,0.08);color:#94a3b8' }[s] || '' }
function priorityLabel(s: string) { return { low: 'Rendah', normal: 'Normal', high: 'Tinggi' }[s] || s }
function priorityStyle(s: string) { return { low: 'background:rgba(148,163,184,0.15);color:#94a3b8', normal: 'background:rgba(251,191,36,0.15);color:#fbbf24', high: 'background:rgba(239,68,68,0.15);color:#f87171' }[s] || '' }
function fmtDate(d: string) { return d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' }
function fmtDateTime(d: string) { return d ? new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-' }
</script>
