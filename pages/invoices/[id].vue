<template>
  <div>
    <!-- Print toolbar — tidak tampil saat print -->
    <div class="no-print" style="background:#1a202c;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100">
      <div style="display:flex;align-items:center;gap:12px">
        <NuxtLink to="/invoices" style="color:#94a3b8;text-decoration:none;font-size:13px;font-weight:600">← Kembali</NuxtLink>
        <span style="color:#475569;font-size:13px">|</span>
        <span style="color:#94a3b8;font-size:13px">{{ invoice?.invoice_number }}</span>
      </div>
      <div style="display:flex;gap:10px">
        <span class="px-3 py-1 rounded-full text-xs font-bold"
          :style="statusStyle(invoice?.status)">
          {{ statusLabel(invoice?.status) }}
        </span>
        <button @click="printInvoice"
          style="padding:8px 20px;background:#1a4fa0;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px">
          🖨️ Print / Download PDF
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" style="display:flex;align-items:center;justify-content:center;min-height:80vh">
      <div style="text-align:center;color:#64748b">
        <div style="font-size:32px;margin-bottom:12px">⏳</div>
        <div style="font-size:14px">Memuat invoice...</div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" style="display:flex;align-items:center;justify-content:center;min-height:80vh">
      <div style="text-align:center;color:#f87171">
        <div style="font-size:32px;margin-bottom:12px">❌</div>
        <div style="font-size:14px">{{ error }}</div>
      </div>
    </div>

    <!-- Invoice -->
    <div v-else-if="invoice" id="invoice-print" style="background:#f0f4fa;min-height:100vh;padding:40px 24px">
      <div style="max-width:800px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- Header invoice -->
        <div :style="'background:' + (settings.invoice_color || '#1a4fa0') + ';padding:40px 48px'">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:24px">
            <!-- Logo & nama perusahaan -->
            <div>
              <div v-if="settings.company_logo_url" style="margin-bottom:12px">
                <img :src="settings.company_logo_url" style="height:48px;object-fit:contain" alt="Logo"/>
              </div>
              <div v-else style="font-size:28px;font-weight:900;color:white;letter-spacing:-1px;margin-bottom:4px">
                <span style="color:white">mi</span><span style="color:#fbbf24">TRANZ</span>
              </div>
              <div style="color:rgba(255,255,255,0.7);font-size:13px">{{ settings.company_tagline || 'Solusi Platform Digital Profesional' }}</div>
              <div style="margin-top:12px;display:flex;flex-direction:column;gap:3px">
                <span style="color:rgba(255,255,255,0.75);font-size:12px">{{ settings.company_address }}</span>
                <span style="color:rgba(255,255,255,0.75);font-size:12px">{{ settings.company_phone }} · {{ settings.company_email }}</span>
                <span style="color:rgba(255,255,255,0.75);font-size:12px">{{ settings.company_website }}</span>
              </div>
            </div>

            <!-- Nomor & status invoice -->
            <div style="text-align:right">
              <div style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:2px;font-weight:700;margin-bottom:4px">INVOICE</div>
              <div style="font-size:24px;font-weight:900;color:white;margin-bottom:16px">{{ invoice.invoice_number }}</div>
              <div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:12px 16px;text-align:right">
                <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:4px">Tanggal Dibuat</div>
                <div style="font-size:13px;font-weight:700;color:white">{{ fmtDate(invoice.created_at) }}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:8px;margin-bottom:4px">Jatuh Tempo</div>
                <div style="font-size:13px;font-weight:700;color:white">{{ fmtDate(invoice.due_date) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Status banner -->
        <div v-if="invoice.status === 'paid'"
          style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:12px 48px;display:flex;align-items:center;gap:10px">
          <span style="font-size:16px">✅</span>
          <span style="font-size:13px;font-weight:700;color:#16a34a">LUNAS — Dibayar pada {{ fmtDate(invoice.paid_at) }}</span>
        </div>
        <div v-else-if="invoice.status === 'unpaid'"
          style="background:#fffbeb;border-bottom:1px solid #fde68a;padding:12px 48px;display:flex;align-items:center;gap:10px">
          <span style="font-size:16px">⏳</span>
          <span style="font-size:13px;font-weight:700;color:#d97706">MENUNGGU PEMBAYARAN — Jatuh tempo {{ fmtDate(invoice.due_date) }}</span>
        </div>
        <div v-else-if="invoice.status === 'cancelled'"
          style="background:#fff1f2;border-bottom:1px solid #fecdd3;padding:12px 48px;display:flex;align-items:center;gap:10px">
          <span style="font-size:16px">❌</span>
          <span style="font-size:13px;font-weight:700;color:#e11d48">DIBATALKAN</span>
        </div>

        <!-- Body invoice -->
        <div style="padding:40px 48px">

          <!-- Info klien -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:36px">
            <div>
              <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;margin-bottom:10px">DITAGIHKAN KEPADA</div>
              <div style="font-size:16px;font-weight:800;color:#1a202c;margin-bottom:4px">{{ invoice.client?.name }}</div>
              <div style="font-size:13px;color:#64748b;line-height:1.7">
                {{ invoice.client?.email }}<br>
                <span v-if="invoice.client?.phone">{{ invoice.client?.phone }}<br></span>
                <span v-if="invoice.client?.address">{{ invoice.client?.address }}</span>
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;margin-bottom:10px">RINGKASAN</div>
              <div style="font-size:13px;color:#64748b;margin-bottom:4px">No. Invoice: <strong style="color:#1a202c">{{ invoice.invoice_number }}</strong></div>
              <div style="font-size:13px;color:#64748b;margin-bottom:4px">Tanggal: <strong style="color:#1a202c">{{ fmtDate(invoice.created_at) }}</strong></div>
              <div style="font-size:13px;color:#64748b">Mata Uang: <strong style="color:#1a202c">{{ invoice.currency }}</strong></div>
            </div>
          </div>

          <!-- Tabel item -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <thead>
              <tr :style="'background:' + (settings.invoice_color || '#1a4fa0')">
                <th style="padding:12px 16px;text-align:left;font-size:12px;font-weight:700;color:white;letter-spacing:0.5px">DESKRIPSI</th>
                <th style="padding:12px 16px;text-align:center;font-size:12px;font-weight:700;color:white;letter-spacing:0.5px;width:80px">QTY</th>
                <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:700;color:white;letter-spacing:0.5px;width:140px">HARGA SATUAN</th>
                <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:700;color:white;letter-spacing:0.5px;width:140px">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in invoice.invoice_items" :key="item.id"
                :style="i % 2 === 0 ? 'background:#f8faff' : 'background:white'">
                <td style="padding:14px 16px;font-size:14px;color:#1a202c;border-bottom:1px solid #f0f4f8">{{ item.description }}</td>
                <td style="padding:14px 16px;text-align:center;font-size:14px;color:#64748b;border-bottom:1px solid #f0f4f8">{{ item.quantity }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;color:#64748b;border-bottom:1px solid #f0f4f8">{{ fmtRp(item.unit_price) }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;font-weight:700;color:#1a202c;border-bottom:1px solid #f0f4f8">{{ fmtRp(item.total) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Total -->
          <div style="display:flex;justify-content:flex-end;margin-bottom:32px">
            <div style="width:280px">
              <div v-if="invoice.tax > 0" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f4f8">
                <span style="font-size:13px;color:#64748b">Subtotal</span>
                <span style="font-size:13px;color:#1a202c">{{ fmtRp(invoice.subtotal) }}</span>
              </div>
              <div v-if="invoice.tax > 0" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f4f8">
                <span style="font-size:13px;color:#64748b">Pajak</span>
                <span style="font-size:13px;color:#1a202c">{{ fmtRp(invoice.tax) }}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:14px 16px;border-radius:10px;margin-top:8px"
                :style="'background:' + (settings.invoice_color || '#1a4fa0')">
                <span style="font-size:14px;font-weight:700;color:white">TOTAL</span>
                <span style="font-size:18px;font-weight:900;color:white">{{ fmtRp(invoice.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Info bank jika unpaid -->
          <div v-if="invoice.status === 'unpaid' && settings.bank_name"
            style="background:#f0f7ff;border:1px solid #dbeafe;border-radius:12px;padding:20px;margin-bottom:24px">
            <div style="font-size:12px;font-weight:700;color:#1a4fa0;letter-spacing:1px;margin-bottom:12px">INFORMASI PEMBAYARAN</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">
              <div>
                <div style="font-size:11px;color:#94a3b8;margin-bottom:2px">Bank</div>
                <div style="font-size:14px;font-weight:700;color:#1a202c">{{ settings.bank_name }}</div>
              </div>
              <div>
                <div style="font-size:11px;color:#94a3b8;margin-bottom:2px">No. Rekening</div>
                <div style="font-size:14px;font-weight:700;color:#1a202c">{{ settings.bank_account_number }}</div>
              </div>
              <div>
                <div style="font-size:11px;color:#94a3b8;margin-bottom:2px">Atas Nama</div>
                <div style="font-size:14px;font-weight:700;color:#1a202c">{{ settings.bank_account_name }}</div>
              </div>
            </div>
          </div>

          <!-- Catatan -->
          <div v-if="invoice.notes || settings.invoice_footer_note"
            style="padding-top:20px;border-top:1px solid #f0f4f8">
            <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;margin-bottom:8px">CATATAN</div>
            <div style="font-size:13px;color:#64748b;line-height:1.7">{{ invoice.notes || settings.invoice_footer_note }}</div>
          </div>
        </div>

        <!-- Footer invoice -->
        <div :style="'background:#f8faff;border-top:1px solid #e2e8f0;padding:20px 48px;display:flex;align-items:center;justify-content:space-between'">
          <div style="font-size:12px;color:#94a3b8">{{ settings.invoice_footer_note || 'Terima kasih telah mempercayai miTRANZ.' }}</div>
          <div style="font-size:12px;color:#94a3b8">{{ settings.company_website }}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const route = useRoute()
const { user } = useCustomAuth()

const invoice = ref<any>(null)
const settings = ref<any>({})
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  if (!user.value?.id) return
  try {
    const res = await $fetch<any>(`/api/billing/invoice/${route.params.id}`, {
      query: { user_id: user.value.id }
    })
    invoice.value = res.invoice
    settings.value = res.settings || {}
  } catch (e: any) {
    error.value = e?.data?.message || 'Invoice tidak ditemukan atau akses ditolak'
  } finally {
    loading.value = false
  }
})

function printInvoice() {
  window.print()
}

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

const statusStyle = (s: string) => ({
  paid: 'background:rgba(34,197,94,0.15);color:#16a34a;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
  unpaid: 'background:rgba(245,158,11,0.15);color:#d97706;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
  cancelled: 'background:rgba(239,68,68,0.15);color:#dc2626;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
}[s || ''] || 'background:rgba(100,116,139,0.15);color:#64748b;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700')
</script>

<style>
@media print {
  .no-print { display: none !important; }
  #invoice-print {
    background: white !important;
    padding: 0 !important;
    min-height: auto !important;
  }
  #invoice-print > div {
    box-shadow: none !important;
    border-radius: 0 !important;
    max-width: 100% !important;
  }
  body { margin: 0; }
}
</style>
