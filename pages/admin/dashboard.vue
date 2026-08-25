<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold" style="color:var(--dash-text-primary)">Admin Dashboard</h1>
      <p class="text-sm" style="color:var(--dash-text-muted)">Ringkasan sistem miTRANZ</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="glass p-4 rounded-2xl">
        <div class="text-2xl mb-1">{{ s.icon }}</div>
        <div class="text-2xl font-bold text-adaptive">
          {{ loading ? '...' : s.value }}
        </div>
        <div class="text-xs mt-1" style="color:var(--dash-text-muted)">{{ s.label }}</div>
      </div>
    </div>

    <!-- Stats baris 2 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in stats2" :key="s.label" class="glass p-4 rounded-2xl">
        <div class="text-2xl mb-1">{{ s.icon }}</div>
        <div class="text-2xl font-bold text-adaptive">
          {{ loading ? '...' : s.value }}
        </div>
        <div class="text-xs mt-1" style="color:var(--dash-text-muted)">{{ s.label }}</div>
      </div>
    </div>

    <!-- Transaksi PPOB terbaru -->
    <div class="glass rounded-2xl overflow-hidden">
      <div class="px-4 py-3 flex items-center justify-between" style="border-bottom:1px solid var(--dash-divider)">
        <h2 class="font-bold text-sm" style="color:var(--dash-text-primary)">Transaksi PPOB Terbaru</h2>
        <span class="text-xs" style="color:var(--dash-text-muted)">10 terakhir</span>
      </div>
      <div v-if="loadingTrx" class="p-6 text-center text-sm" style="color:var(--dash-text-muted)">Memuat...</div>
      <div v-else-if="recentTrx.length === 0" class="p-6 text-center text-sm" style="color:var(--dash-text-muted)">Belum ada transaksi</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:1px solid var(--dash-divider)">
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Waktu</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Produk</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Tujuan</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Harga</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in recentTrx" :key="t.id"
              class="hover:bg-white/5 transition-colors"
              style="border-bottom:1px solid var(--dash-divider)">
              <td class="px-4 py-3 text-xs" style="color:var(--dash-text-muted)">{{ fmtDate(t.created_at) }}</td>
              <td class="px-4 py-3 font-semibold" style="color:var(--dash-text-primary)">{{ t.product_name }}</td>
              <td class="px-4 py-3 font-mono text-xs" style="color:var(--dash-text-muted)">{{ t.customer_no }}</td>
              <td class="px-4 py-3 font-semibold" style="color:var(--dash-text-primary)">{{ fmtRp(t.price) }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-semibold"
                  :style="statusStyle(t.status)">
                  {{ t.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invoice terbaru -->
    <div class="glass rounded-2xl overflow-hidden">
      <div class="px-4 py-3 flex items-center justify-between" style="border-bottom:1px solid var(--dash-divider)">
        <h2 class="font-bold text-sm" style="color:var(--dash-text-primary)">Invoice Terbaru</h2>
        <span class="text-xs" style="color:var(--dash-text-muted)">10 terakhir</span>
      </div>
      <div v-if="loadingInv" class="p-6 text-center text-sm" style="color:var(--dash-text-muted)">Memuat...</div>
      <div v-else-if="recentInv.length === 0" class="p-6 text-center text-sm" style="color:var(--dash-text-muted)">Belum ada invoice</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:1px solid var(--dash-divider)">
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Waktu</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Invoice</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Pelanggan</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Total</th>
              <th class="text-left px-4 py-3 text-xs font-semibold" style="color:var(--dash-text-muted)">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in recentInv" :key="inv.id"
              class="hover:bg-white/5 transition-colors"
              style="border-bottom:1px solid var(--dash-divider)">
              <td class="px-4 py-3 text-xs" style="color:var(--dash-text-muted)">{{ fmtDate(inv.created_at) }}</td>
              <td class="px-4 py-3 font-mono text-xs font-semibold" style="color:var(--dash-text-primary)">{{ inv.invoice_number }}</td>
              <td class="px-4 py-3 text-xs" style="color:var(--dash-text-muted)">{{ inv.client_name }}</td>
              <td class="px-4 py-3 font-semibold" style="color:var(--dash-text-primary)">{{ fmtRp(inv.total_amount) }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-semibold"
                  :style="statusStyle(inv.status)">
                  {{ inv.status }}
                </span>
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

const loading = ref(true)
const loadingTrx = ref(true)
const loadingInv = ref(true)

const data = ref({
  users: 0, orders: 0, chatAktif: 0, ppobTotal: 0,
  ppobBerhasil: 0, ppobGagal: 0, ppobPending: 0, revenueToday: 0
})
const recentTrx = ref<any[]>([])
const recentInv = ref<any[]>([])

const stats = computed(() => [
  { icon: '👥', label: 'Total User', value: data.value.users },
  { icon: '📦', label: 'Total Order', value: data.value.orders },
  { icon: '💬', label: 'Chat Aktif', value: data.value.chatAktif },
  { icon: '⚡', label: 'Total Transaksi PPOB', value: data.value.ppobTotal },
])

const stats2 = computed(() => [
  { icon: '✅', label: 'PPOB Berhasil', value: data.value.ppobBerhasil },
  { icon: '❌', label: 'PPOB Gagal', value: data.value.ppobGagal },
  { icon: '⏳', label: 'PPOB Pending', value: data.value.ppobPending },
  { icon: '📊', label: 'Invoice Lunas', value: data.value.orders },
])

const GQL_STATS = `query {
  users_aggregate { aggregate { count } }
  orders: invoices_aggregate { aggregate { count } }
  chatAktif: chat_sessions_aggregate(where:{is_archived:{_eq:false}}) { aggregate { count } }
  ppobTotal: ppob_transactions_aggregate { aggregate { count } }
  ppobBerhasil: ppob_transactions_aggregate(where:{status:{_eq:"Sukses"}}) { aggregate { count } }
  ppobGagal: ppob_transactions_aggregate(where:{status:{_eq:"Gagal"}}) { aggregate { count } }
  ppobPending: ppob_transactions_aggregate(where:{status:{_eq:"Pending"}}) { aggregate { count } }
}`

const GQL_TRX = `query {
  ppob_transactions(order_by:{created_at:desc}, limit:10) {
    id product_name customer_no price status created_at
  }
}`

const GQL_INV = `query {
  invoices(order_by:{created_at:desc}, limit:10) {
    id invoice_number client_name total_amount status created_at
  }
}`

async function fetchStats() {
  try {
    const res = await $fetch<any>('/api/graphql/proxy', {
      method: 'POST', body: { query: GQL_STATS }
    })
    const d = res.data
    data.value = {
      users: d.users_aggregate.aggregate.count,
      orders: d.orders.aggregate.count,
      chatAktif: d.chatAktif.aggregate.count,
      ppobTotal: d.ppobTotal.aggregate.count,
      ppobBerhasil: d.ppobBerhasil.aggregate.count,
      ppobGagal: d.ppobGagal.aggregate.count,
      ppobPending: d.ppobPending.aggregate.count,
      revenueToday: 0,
    }
  } finally { loading.value = false }
}

async function fetchTrx() {
  try {
    const res = await $fetch<any>('/api/graphql/proxy', {
      method: 'POST', body: { query: GQL_TRX }
    })
    recentTrx.value = res.data?.ppob_transactions ?? []
  } finally { loadingTrx.value = false }
}

async function fetchInv() {
  try {
    const res = await $fetch<any>('/api/graphql/proxy', {
      method: 'POST', body: { query: GQL_INV }
    })
    recentInv.value = res.data?.invoices ?? []
  } finally { loadingInv.value = false }
}

onMounted(() => {
  fetchStats()
  fetchTrx()
  fetchInv()
})

const fmtDate = (d: string) => d ? new Date(d).toLocaleString('id-ID', {
  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
}) : '-'

const fmtRp = (n: number) => n ? new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', minimumFractionDigits: 0
}).format(n) : '-'

const statusStyle = (s: string) => {
  const map: any = {
    'Sukses': 'background:rgba(34,197,94,0.15);color:#4ade80',
    'Gagal': 'background:rgba(239,68,68,0.15);color:#f87171',
    'Pending': 'background:rgba(251,191,36,0.15);color:#fbbf24',
    'paid': 'background:rgba(34,197,94,0.15);color:#4ade80',
    'pending': 'background:rgba(251,191,36,0.15);color:#fbbf24',
    'cancelled': 'background:rgba(239,68,68,0.15);color:#f87171',
  }
  return map[s] || 'background:rgba(100,116,139,0.15);color:#94a3b8'
}
</script>
