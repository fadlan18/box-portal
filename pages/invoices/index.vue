<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-adaptive mb-1">Invoice Saya</h1>
      <p class="text-sm text-gray-400">Riwayat tagihan dan status pembayaran</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="glass p-4 rounded-2xl">
        <div class="text-2xl mb-1">🧾</div>
        <div class="text-2xl font-bold text-adaptive">{{ invoices.length }}</div>
        <div class="text-xs text-gray-400 mt-1">Total Invoice</div>
      </div>
      <div class="glass p-4 rounded-2xl">
        <div class="text-2xl mb-1">⏳</div>
        <div class="text-2xl font-bold text-adaptive">{{ unpaidCount }}</div>
        <div class="text-xs text-gray-400 mt-1">Belum Lunas</div>
      </div>
      <div class="glass p-4 rounded-2xl">
        <div class="text-2xl mb-1">✅</div>
        <div class="text-2xl font-bold text-adaptive">{{ paidCount }}</div>
        <div class="text-xs text-gray-400 mt-1">Lunas</div>
      </div>
    </div>

    <!-- Invoice list -->
    <div class="glass rounded-2xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-400 text-sm">Memuat...</div>
      <div v-else-if="!invoices.length" class="p-8 text-center text-gray-400 text-sm">
        Belum ada invoice
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">No. Invoice</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Deskripsi</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Total</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Jatuh Tempo</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Status</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invoices" :key="inv.id"
              class="hover:bg-white/5 transition-colors"
              style="border-bottom:1px solid rgba(255,255,255,0.04)">
              <td class="px-4 py-3">
                <span class="font-mono text-xs font-semibold" style="color:#60a5fa">
                  {{ inv.invoice_number }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-300 text-xs">
                {{ inv.invoice_items?.[0]?.description || '-' }}
                <span v-if="inv.invoice_items?.length > 1" class="text-gray-500">
                  +{{ inv.invoice_items.length - 1 }} item
                </span>
              </td>
              <td class="px-4 py-3 font-semibold text-adaptive">
                {{ fmtCurrency(inv.total, inv.currency) }}
              </td>
              <td class="px-4 py-3 text-xs text-gray-400">{{ fmtDate(inv.due_date) }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-semibold"
                  :style="statusStyle(inv.status)">
                  {{ statusLabel(inv.status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <a v-if="inv.status === 'unpaid'"
                  :href="`https://paymen.mitranz.com/invoices/${inv.id}`"
                  target="_blank"
                  class="text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style="background:#1a4fa0;color:#ffffff !important">
                  💳 Bayar
                </a>
                <a v-else
                  :href="`https://paymen.mitranz.com/invoices/${inv.id}`"
                  target="_blank"
                  class="text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style="background:rgba(255,255,255,0.08);color:#94a3b8">
                  Detail
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user } = useCustomAuth()
const invoices = ref<any[]>([])
const loading = ref(true)

const unpaidCount = computed(() => invoices.value.filter(i => i.status === 'unpaid').length)
const paidCount = computed(() => invoices.value.filter(i => i.status === 'paid').length)

onMounted(async () => {
  if (!user.value?.id) return
  try {
    // Ambil invoice dari billing via proxy
    const data: any = await $fetch('/api/billing/invoices', {
      query: { user_id: user.value.id }
    })
    invoices.value = data.invoices || []
  } catch (e) {
    console.error('Error loading invoices:', e)
  } finally {
    loading.value = false
  }
})

function fmtCurrency(amount: number, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency, maximumFractionDigits: 0
  }).format(amount || 0)
}

function fmtDate(d: string) {
  return d ? new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : '-'
}

function statusLabel(s: string) {
  return { unpaid: 'Belum Lunas', paid: 'Lunas', cancelled: 'Dibatalkan', overdue: 'Jatuh Tempo' }[s] || s
}

function statusStyle(s: string) {
  const styles: any = {
    unpaid: 'background:rgba(251,191,36,0.15);color:#fbbf24',
    paid: 'background:rgba(34,197,94,0.15);color:#4ade80',
    cancelled: 'background:rgba(239,68,68,0.15);color:#f87171',
    overdue: 'background:rgba(239,68,68,0.2);color:#f87171',
  }
  return styles[s] || 'background:rgba(255,255,255,0.08);color:#94a3b8'
}
</script>
