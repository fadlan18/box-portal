<template>
  <div>
    <!-- Print toolbar -->
    <div class="no-print" style="background:#1a202c;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="color:#94a3b8;font-size:13px;font-weight:600">{{ invoice?.invoice_number }}</span>
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        <span class="px-3 py-1 rounded-full text-xs font-bold" :style="statusBadge(invoice?.status)">
          {{ statusLabel(invoice?.status) }}
        </span>
        <button @click="printInvoice"
          style="padding:8px 20px;background:#1a4fa0;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">
          🖨️ Print / Download PDF
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" style="display:flex;align-items:center;justify-content:center;min-height:80vh">
      <div style="text-align:center">
        <div style="font-size:32px;margin-bottom:12px">❌</div>
        <div style="font-size:14px;color:#374151">{{ error }}</div>
        <a href="/" style="display:inline-block;margin-top:16px;color:#1a4fa0;font-size:13px">← Kembali ke miTRANZ</a>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" style="display:flex;align-items:center;justify-content:center;min-height:80vh">
      <div style="text-align:center;color:#64748b">
        <div style="font-size:32px;margin-bottom:12px">⏳</div>
        <div style="font-size:14px">Memuat invoice...</div>
      </div>
    </div>

    <!-- Invoice content — pakai komponen yang sama dengan halaman invoices/[id].vue -->
    <div v-else-if="invoice" id="invoice-content">

      <!-- MODERN -->
      <div v-if="template === 'modern'" id="invoice-print" style="background:white;min-height:100vh;padding:40px 24px">
        <div style="max-width:800px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
          <div :style="'background:' + hc + ';padding:40px 48px'">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:24px">
              <div>
                <img v-if="logoUrl" :src="logoUrl" style="height:48px;object-fit:contain;margin-bottom:12px" alt="Logo"/>
                <div v-else style="font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:4px" :style="'color:' + tc">miTRANZ</div>
                <div style="font-size:13px;margin-bottom:12px" :style="'color:' + tc + 'cc'">{{ settings.company_tagline }}</div>
                <div style="font-size:12px;line-height:1.8" :style="'color:' + tc + 'bb'">
                  {{ settings.company_name }}<br>{{ settings.company_address }}<br>{{ settings.company_phone }} · {{ settings.company_email }}
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:11px;letter-spacing:2px;font-weight:700;margin-bottom:8px" :style="'color:' + tc + 'aa'">INVOICE</div>
                <div style="font-size:22px;font-weight:900;margin-bottom:16px" :style="'color:' + tc">{{ invoice.invoice_number }}</div>
                <div style="border-radius:8px;padding:12px 16px;text-align:right" :style="'background:' + tc + '22'">
                  <div style="font-size:11px;margin-bottom:4px" :style="'color:' + tc + 'aa'">Tanggal</div>
                  <div style="font-size:13px;font-weight:700" :style="'color:' + tc">{{ fmtDate(invoice.created_at) }}</div>
                  <div style="font-size:11px;margin-top:8px;margin-bottom:4px" :style="'color:' + tc + 'aa'">Jatuh Tempo</div>
                  <div style="font-size:13px;font-weight:700" :style="'color:' + tc">{{ fmtDate(invoice.due_date) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="invoice.status === 'paid'" style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:10px 48px;display:flex;align-items:center;gap:8px">
            <span>✅</span><span style="font-size:13px;font-weight:700;color:#15803d">LUNAS — {{ fmtDate(invoice.paid_at) }}</span>
          </div>
          <div style="padding:40px 48px">
            <div style="margin-bottom:32px">
              <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1.5px;margin-bottom:10px">DITAGIHKAN KEPADA</div>
              <div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:6px">{{ invoice.client?.name }}</div>
              <div style="font-size:13px;color:#374151;line-height:1.8">{{ invoice.client?.email }}<br>{{ invoice.client?.phone }}</div>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <thead>
                <tr :style="'background:' + hc">
                  <th style="padding:12px 16px;text-align:left;font-size:12px;font-weight:700" :style="'color:' + tc">DESKRIPSI</th>
                  <th style="padding:12px 16px;text-align:center;font-size:12px;font-weight:700;width:80px" :style="'color:' + tc">QTY</th>
                  <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:700;width:140px" :style="'color:' + tc">HARGA</th>
                  <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:700;width:140px" :style="'color:' + tc">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in invoice.invoice_items" :key="item.id" :style="i%2===0?'background:#f9fafb':'background:white'">
                  <td style="padding:14px 16px;font-size:14px;color:#111827;border-bottom:1px solid #f3f4f6">{{ item.description }}</td>
                  <td style="padding:14px 16px;text-align:center;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6">{{ item.quantity }}</td>
                  <td style="padding:14px 16px;text-align:right;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6">{{ fmtRp(item.unit_price) }}</td>
                  <td style="padding:14px 16px;text-align:right;font-size:14px;font-weight:700;color:#111827;border-bottom:1px solid #f3f4f6">{{ fmtRp(item.total) }}</td>
                </tr>
              </tbody>
            </table>
            <div style="display:flex;justify-content:flex-end;margin-bottom:32px">
              <div style="width:280px">
                <div style="display:flex;justify-content:space-between;padding:14px 16px;border-radius:10px;margin-top:8px" :style="'background:' + hc">
                  <span style="font-size:14px;font-weight:700" :style="'color:' + tc">TOTAL</span>
                  <span style="font-size:18px;font-weight:900" :style="'color:' + tc">{{ fmtRp(invoice.total) }}</span>
                </div>
              </div>
            </div>
            <div v-if="invoice.notes && invoice.status !== 'paid'" style="padding-top:20px;border-top:1px solid #f3f4f6">
              <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;margin-bottom:8px">CATATAN</div>
              <div style="font-size:13px;color:#374151;line-height:1.7">{{ invoice.notes }}</div>
            </div>
          </div>
          <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 48px;display:flex;justify-content:space-between">
            <div style="font-size:12px;color:#6b7280">{{ settings.invoice_footer_note }}</div>
            <div style="font-size:12px;color:#6b7280">{{ settings.company_website }}</div>
          </div>
        </div>
      </div>

      <!-- Untuk template lain — redirect ke billing portal -->
      <div v-else style="display:flex;align-items:center;justify-content:center;min-height:80vh">
        <div style="text-align:center;color:#64748b">
          <div style="font-size:32px;margin-bottom:12px">📄</div>
          <div style="font-size:14px;margin-bottom:16px">Invoice {{ invoice.invoice_number }}</div>
          <a :href="'https://paymen.mitranz.com/invoices/' + invoice.id"
            style="display:inline-block;padding:10px 24px;background:#1a4fa0;color:white;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700">
            Lihat di Billing Portal
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const invoice = ref<any>(null)
const settings = ref<any>({})
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const token = route.query.token as string
  if (!token) { error.value = 'Token tidak valid'; loading.value = false; return }

  try {
    // Verifikasi token
    const verify = await $fetch<any>(`/api/billing/verify-token?token=${token}`)
    if (!verify.ok) throw new Error('Token tidak valid')

    // Fetch invoice dari billing
    const res = await $fetch<any>(`https://paymen.mitranz.com/api/invoices/${route.params.id}`)
    if (res.ok) {
      invoice.value = res.invoice
      settings.value = res.settings || {}
    }
  } catch (e: any) {
    error.value = 'Invoice tidak ditemukan atau link sudah kedaluwarsa'
  } finally {
    loading.value = false
  }
})

const template = computed(() => settings.value?.invoice_template || 'modern')
const hc = computed(() => settings.value?.invoice_color || '#1a4fa0')
const tc = computed(() => settings.value?.invoice_text_color || '#ffffff')
const logoUrl = computed(() => {
  const url = settings.value?.company_logo_url || ''
  if (!url) return ''
  return url.startsWith('http') ? url : 'https://paymen.mitranz.com' + url
})

function printInvoice() { window.print() }

const fmtRp = (n: number) => n ? new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
}).format(n) : 'Rp 0'

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric'
}) : '-'

const statusLabel = (s: string) => ({
  unpaid: 'Belum Lunas', paid: 'Lunas',
  cancelled: 'Dibatalkan', pending_confirmation: 'Menunggu Konfirmasi'
}[s || ''] || s)

const statusBadge = (s: string) => ({
  paid: 'background:#f0fdf4;color:#15803d;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
  unpaid: 'background:#fffbeb;color:#b45309;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
}[s || ''] || 'background:#f9fafb;color:#374151;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700')
</script>

<style>
@page { margin: 0; size: A4; }
@media print {
  .no-print { display: none !important; }
  body { margin: 0; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
</style>
