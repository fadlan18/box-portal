<template>
  <div>
    <!-- Print toolbar -->
    <div class="no-print" style="background:#1a202c;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100">
      <div style="display:flex;align-items:center;gap:12px">
        <NuxtLink to="/invoices" style="color:#94a3b8;text-decoration:none;font-size:13px;font-weight:600">← Kembali</NuxtLink>
        <span style="color:#475569;font-size:13px">|</span>
        <span style="color:#94a3b8;font-size:13px">{{ invoice?.invoice_number }}</span>
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        <span class="px-3 py-1 rounded-full text-xs font-bold" :style="statusStyle(invoice?.status)">
          {{ statusLabel(invoice?.status) }}
        </span>
        <button @click="printInvoice"
          style="padding:8px 20px;background:#1a4fa0;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">
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

    <div v-else-if="error" style="display:flex;align-items:center;justify-content:center;min-height:80vh">
      <div style="text-align:center;color:#f87171">
        <div style="font-size:32px;margin-bottom:12px">❌</div>
        <div style="font-size:14px">{{ error }}</div>
      </div>
    </div>

    <!-- TEMPLATE: MODERN -->
    <div v-else-if="invoice && template === 'modern'" id="invoice-print"
      style="background:#f0f4fa;min-height:100vh;padding:40px 24px">
      <div style="max-width:800px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div :style="'background:' + headerColor + ';padding:40px 48px'">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:24px">
            <div>
              <div v-if="logoUrl" style="margin-bottom:12px">
                <img :src="logoUrl" style="height:48px;object-fit:contain" alt="Logo"/>
              </div>
              <div v-else style="font-size:28px;font-weight:900;color:white;letter-spacing:-1px;margin-bottom:4px">
                <span>mi</span><span style="color:#fbbf24">TRANZ</span>
              </div>
              <div style="color:rgba(255,255,255,0.7);font-size:13px">{{ settings.company_tagline }}</div>
              <div style="margin-top:12px;display:flex;flex-direction:column;gap:3px">
                <span style="color:rgba(255,255,255,0.75);font-size:12px">{{ settings.company_address }}</span>
                <span style="color:rgba(255,255,255,0.75);font-size:12px">{{ settings.company_phone }} · {{ settings.company_email }}</span>
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:2px;font-weight:700;margin-bottom:4px">INVOICE</div>
              <div style="font-size:24px;font-weight:900;color:white;margin-bottom:16px">{{ invoice.invoice_number }}</div>
              <div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:12px 16px;text-align:right">
                <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:4px">Tanggal</div>
                <div style="font-size:13px;font-weight:700;color:white">{{ fmtDate(invoice.created_at) }}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:8px;margin-bottom:4px">Jatuh Tempo</div>
                <div style="font-size:13px;font-weight:700;color:white">{{ fmtDate(invoice.due_date) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="invoice.status === 'paid'" style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:10px 48px;display:flex;align-items:center;gap:8px">
          <span style="font-size:14px">✅</span><span style="font-size:13px;font-weight:700;color:#16a34a">LUNAS — {{ fmtDate(invoice.paid_at) }}</span>
        </div>
        <div v-else-if="invoice.status === 'unpaid'" style="background:#fffbeb;border-bottom:1px solid #fde68a;padding:10px 48px;display:flex;align-items:center;gap:8px">
          <span style="font-size:14px">⏳</span><span style="font-size:13px;font-weight:700;color:#d97706">MENUNGGU PEMBAYARAN — Jatuh tempo {{ fmtDate(invoice.due_date) }}</span>
        </div>
        <div style="padding:40px 48px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px">
            <div>
              <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;margin-bottom:8px">DITAGIHKAN KEPADA</div>
              <div style="font-size:16px;font-weight:800;color:#1a202c;margin-bottom:4px">{{ invoice.client?.name }}</div>
              <div style="font-size:13px;color:#64748b;line-height:1.7">{{ invoice.client?.email }}<br>{{ invoice.client?.phone }}</div>
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <thead>
              <tr :style="'background:' + headerColor">
                <th style="padding:12px 16px;text-align:left;font-size:12px;font-weight:700;color:white">DESKRIPSI</th>
                <th style="padding:12px 16px;text-align:center;font-size:12px;font-weight:700;color:white;width:80px">QTY</th>
                <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:700;color:white;width:140px">HARGA</th>
                <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:700;color:white;width:140px">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in invoice.invoice_items" :key="item.id" :style="i % 2 === 0 ? 'background:#f8faff' : 'background:white'">
                <td style="padding:14px 16px;font-size:14px;color:#1a202c;border-bottom:1px solid #f0f4f8">{{ item.description }}</td>
                <td style="padding:14px 16px;text-align:center;font-size:14px;color:#64748b;border-bottom:1px solid #f0f4f8">{{ item.quantity }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;color:#64748b;border-bottom:1px solid #f0f4f8">{{ fmtRp(item.unit_price) }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;font-weight:700;color:#1a202c;border-bottom:1px solid #f0f4f8">{{ fmtRp(item.total) }}</td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex;justify-content:flex-end;margin-bottom:32px">
            <div style="width:280px">
              <div style="display:flex;justify-content:space-between;padding:14px 16px;border-radius:10px" :style="'background:' + headerColor">
                <span style="font-size:14px;font-weight:700;color:white">TOTAL</span>
                <span style="font-size:18px;font-weight:900;color:white">{{ fmtRp(invoice.total) }}</span>
              </div>
            </div>
          </div>
          <div v-if="settings.bank_name" style="background:#f0f7ff;border:1px solid #dbeafe;border-radius:12px;padding:20px;margin-bottom:24px">
            <div style="font-size:12px;font-weight:700;color:#1a4fa0;letter-spacing:1px;margin-bottom:12px">INFORMASI PEMBAYARAN</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
              <div><div style="font-size:11px;color:#94a3b8;margin-bottom:2px">Bank</div><div style="font-size:14px;font-weight:700;color:#1a202c">{{ settings.bank_name }}</div></div>
              <div><div style="font-size:11px;color:#94a3b8;margin-bottom:2px">No. Rekening</div><div style="font-size:14px;font-weight:700;color:#1a202c">{{ settings.bank_account_number }}</div></div>
              <div><div style="font-size:11px;color:#94a3b8;margin-bottom:2px">Atas Nama</div><div style="font-size:14px;font-weight:700;color:#1a202c">{{ settings.bank_account_name }}</div></div>
            </div>
          </div>
          <div v-if="invoice.notes" style="padding-top:20px;border-top:1px solid #f0f4f8">
            <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;margin-bottom:8px">CATATAN</div>
            <div style="font-size:13px;color:#64748b;line-height:1.7">{{ invoice.notes }}</div>
          </div>
        </div>
        <div style="background:#f8faff;border-top:1px solid #e2e8f0;padding:16px 48px;display:flex;justify-content:space-between">
          <div style="font-size:12px;color:#94a3b8">{{ settings.invoice_footer_note }}</div>
          <div style="font-size:12px;color:#94a3b8">{{ settings.company_website }}</div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE: MINIMAL -->
    <div v-else-if="invoice && template === 'minimal'" id="invoice-print"
      style="background:white;min-height:100vh;padding:40px 24px">
      <div style="max-width:800px;margin:0 auto">
        <!-- Header minimal -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;margin-bottom:32px" :style="'border-bottom:3px solid ' + headerColor">
          <div>
            <img v-if="logoUrl" :src="logoUrl" style="height:44px;object-fit:contain;margin-bottom:8px" alt="Logo"/>
            <div v-else style="font-size:26px;font-weight:900;letter-spacing:-1px;margin-bottom:4px">
              <span :style="'color:' + headerColor">mi</span><span style="color:#c0192c">TRANZ</span>
            </div>
            <div style="font-size:12px;color:#94a3b8">{{ settings.company_tagline }}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:32px;font-weight:900;color:#1a202c;letter-spacing:-1px">INVOICE</div>
            <div style="font-size:15px;font-weight:700;margin-top:4px" :style="'color:' + headerColor">{{ invoice.invoice_number }}</div>
          </div>
        </div>
        <!-- Info -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-bottom:40px">
          <div>
            <div style="font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:1.5px;margin-bottom:8px">DARI</div>
            <div style="font-size:13px;font-weight:700;color:#1a202c;margin-bottom:4px">{{ settings.company_name }}</div>
            <div style="font-size:12px;color:#64748b;line-height:1.7">{{ settings.company_address }}<br>{{ settings.company_email }}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:1.5px;margin-bottom:8px">KEPADA</div>
            <div style="font-size:13px;font-weight:700;color:#1a202c;margin-bottom:4px">{{ invoice.client?.name }}</div>
            <div style="font-size:12px;color:#64748b;line-height:1.7">{{ invoice.client?.email }}<br>{{ invoice.client?.phone }}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:1.5px;margin-bottom:8px">DETAIL</div>
            <div style="font-size:12px;color:#64748b;margin-bottom:4px">Tanggal: <strong style="color:#1a202c">{{ fmtDate(invoice.created_at) }}</strong></div>
            <div style="font-size:12px;color:#64748b;margin-bottom:8px">Jatuh Tempo: <strong style="color:#1a202c">{{ fmtDate(invoice.due_date) }}</strong></div>
            <span style="font-size:11px;font-weight:700;padding:4px 12px;border-radius:100px" :style="invoice.status === 'paid' ? 'background:#f0fdf4;color:#16a34a' : 'background:#fffbeb;color:#d97706'">
              {{ statusLabel(invoice.status) }}
            </span>
          </div>
        </div>
        <!-- Tabel minimal -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
          <thead>
            <tr style="border-bottom:2px solid #1a202c">
              <th style="padding:10px 0;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px">DESKRIPSI</th>
              <th style="padding:10px 0;text-align:center;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;width:60px">QTY</th>
              <th style="padding:10px 0;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;width:130px">HARGA</th>
              <th style="padding:10px 0;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;width:130px">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoice.invoice_items" :key="item.id" style="border-bottom:1px solid #f0f4f8">
              <td style="padding:14px 0;font-size:14px;color:#1a202c">{{ item.description }}</td>
              <td style="padding:14px 0;text-align:center;font-size:14px;color:#64748b">{{ item.quantity }}</td>
              <td style="padding:14px 0;text-align:right;font-size:14px;color:#64748b">{{ fmtRp(item.unit_price) }}</td>
              <td style="padding:14px 0;text-align:right;font-size:14px;font-weight:700;color:#1a202c">{{ fmtRp(item.total) }}</td>
            </tr>
          </tbody>
        </table>
        <!-- Total minimal -->
        <div style="display:flex;justify-content:flex-end;margin-bottom:40px">
          <div style="width:260px">
            <div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #1a202c">
              <span style="font-size:16px;font-weight:900;color:#1a202c">TOTAL</span>
              <span style="font-size:20px;font-weight:900" :style="'color:' + headerColor">{{ fmtRp(invoice.total) }}</span>
            </div>
          </div>
        </div>
        <!-- Bank & catatan -->
        <div v-if="settings.bank_name" style="padding:20px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:24px">
          <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;margin-bottom:10px">PEMBAYARAN VIA TRANSFER</div>
          <div style="font-size:13px;color:#1a202c">{{ settings.bank_name }} · <strong>{{ settings.bank_account_number }}</strong> · a.n. {{ settings.bank_account_name }}</div>
        </div>
        <div style="border-top:1px solid #e2e8f0;padding-top:16px;display:flex;justify-content:space-between">
          <div style="font-size:12px;color:#94a3b8">{{ settings.invoice_footer_note }}</div>
          <div style="font-size:12px;color:#94a3b8">{{ settings.company_website }}</div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE: CORPORATE -->
    <div v-else-if="invoice && template === 'corporate'" id="invoice-print"
      style="background:#f0f4fa;min-height:100vh;padding:40px 24px">
      <div style="max-width:800px;margin:0 auto;background:white;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <!-- Header dark -->
        <div style="background:#0f172a;padding:40px 48px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px">
            <img v-if="logoUrl" :src="logoUrl" style="height:40px;object-fit:contain" alt="Logo"/>
            <div v-else style="font-size:24px;font-weight:900;color:white;letter-spacing:-0.5px">
              <span style="color:#60a5fa">mi</span><span style="color:#f87171">TRANZ</span>
            </div>
            <div style="text-align:right">
              <div style="font-size:10px;color:#64748b;letter-spacing:2px;font-weight:700">INVOICE</div>
              <div style="font-size:20px;font-weight:900;color:white">{{ invoice.invoice_number }}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">
            <div>
              <div style="font-size:10px;color:#64748b;letter-spacing:1.5px;font-weight:700;margin-bottom:6px">DARI</div>
              <div style="font-size:13px;font-weight:700;color:white;margin-bottom:2px">{{ settings.company_name }}</div>
              <div style="font-size:11px;color:#64748b;line-height:1.7">{{ settings.company_address }}<br>{{ settings.company_email }}</div>
            </div>
            <div>
              <div style="font-size:10px;color:#64748b;letter-spacing:1.5px;font-weight:700;margin-bottom:6px">KEPADA</div>
              <div style="font-size:13px;font-weight:700;color:white;margin-bottom:2px">{{ invoice.client?.name }}</div>
              <div style="font-size:11px;color:#64748b;line-height:1.7">{{ invoice.client?.email }}<br>{{ invoice.client?.phone }}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:10px;color:#64748b;letter-spacing:1.5px;font-weight:700;margin-bottom:6px">TANGGAL</div>
              <div style="font-size:12px;color:#94a3b8;margin-bottom:2px">{{ fmtDate(invoice.created_at) }}</div>
              <div style="font-size:10px;color:#64748b;margin-bottom:2px">Jatuh Tempo</div>
              <div style="font-size:12px;color:#94a3b8">{{ fmtDate(invoice.due_date) }}</div>
            </div>
          </div>
        </div>
        <!-- Status bar -->
        <div v-if="invoice.status === 'paid'" style="background:#059669;padding:10px 48px">
          <span style="font-size:12px;font-weight:700;color:white;letter-spacing:1px">✓ LUNAS — {{ fmtDate(invoice.paid_at) }}</span>
        </div>
        <div v-else-if="invoice.status === 'unpaid'" style="background:#d97706;padding:10px 48px">
          <span style="font-size:12px;font-weight:700;color:white;letter-spacing:1px">⏳ MENUNGGU PEMBAYARAN</span>
        </div>
        <!-- Body -->
        <div style="padding:40px 48px">
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <thead>
              <tr style="background:#0f172a">
                <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px">DESKRIPSI</th>
                <th style="padding:12px 16px;text-align:center;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;width:80px">QTY</th>
                <th style="padding:12px 16px;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;width:140px">HARGA</th>
                <th style="padding:12px 16px;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;width:140px">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in invoice.invoice_items" :key="item.id" :style="i % 2 === 0 ? 'background:#f8faff' : 'background:white'">
                <td style="padding:14px 16px;font-size:14px;color:#1a202c;border-bottom:1px solid #f0f4f8">{{ item.description }}</td>
                <td style="padding:14px 16px;text-align:center;font-size:14px;color:#64748b;border-bottom:1px solid #f0f4f8">{{ item.quantity }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;color:#64748b;border-bottom:1px solid #f0f4f8">{{ fmtRp(item.unit_price) }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;font-weight:700;color:#1a202c;border-bottom:1px solid #f0f4f8">{{ fmtRp(item.total) }}</td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex;justify-content:flex-end;margin-bottom:32px">
            <div style="width:280px;background:#0f172a;border-radius:8px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:13px;font-weight:700;color:#94a3b8;letter-spacing:1px">TOTAL</span>
              <span style="font-size:20px;font-weight:900;color:white">{{ fmtRp(invoice.total) }}</span>
            </div>
          </div>
          <div v-if="settings.bank_name" style="background:#f8faff;border-left:4px solid #0f172a;padding:16px 20px;margin-bottom:24px">
            <div style="font-size:11px;font-weight:700;color:#64748b;letter-spacing:1px;margin-bottom:8px">PEMBAYARAN</div>
            <div style="font-size:13px;color:#1a202c">{{ settings.bank_name }} · <strong>{{ settings.bank_account_number }}</strong> · a.n. {{ settings.bank_account_name }}</div>
          </div>
          <div v-if="invoice.notes" style="font-size:13px;color:#64748b;line-height:1.7">{{ invoice.notes }}</div>
        </div>
        <div style="background:#0f172a;padding:16px 48px;display:flex;justify-content:space-between">
          <div style="font-size:11px;color:#475569">{{ settings.invoice_footer_note }}</div>
          <div style="font-size:11px;color:#475569">{{ settings.company_website }}</div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE: CLASSIC -->
    <div v-else-if="invoice && template === 'classic'" id="invoice-print"
      style="background:white;min-height:100vh;padding:40px 24px">
      <div style="max-width:800px;margin:0 auto">
        <!-- Garis atas -->
        <div :style="'height:6px;background:' + headerColor + ';margin-bottom:32px'"></div>
        <!-- Header classic -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
          <div>
            <img v-if="logoUrl" :src="logoUrl" style="height:44px;object-fit:contain;margin-bottom:12px" alt="Logo"/>
            <div v-else style="font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:8px">
              <span :style="'color:' + headerColor">mi</span><span style="color:#c0192c">TRANZ</span>
            </div>
            <div style="font-size:12px;color:#64748b;line-height:1.8">
              {{ settings.company_name }}<br>
              {{ settings.company_address }}<br>
              {{ settings.company_phone }}<br>
              {{ settings.company_email }}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:36px;font-weight:900;color:#1a202c;letter-spacing:-2px;margin-bottom:16px">INVOICE</div>
            <div style="border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;text-align:right">
              <div style="font-size:12px;color:#94a3b8;margin-bottom:2px">No. Invoice</div>
              <div style="font-size:15px;font-weight:800;color:#1a202c;margin-bottom:8px">{{ invoice.invoice_number }}</div>
              <div style="font-size:12px;color:#94a3b8;margin-bottom:2px">Tanggal</div>
              <div style="font-size:13px;font-weight:600;color:#1a202c;margin-bottom:8px">{{ fmtDate(invoice.created_at) }}</div>
              <div style="font-size:12px;color:#94a3b8;margin-bottom:2px">Jatuh Tempo</div>
              <div style="font-size:13px;font-weight:600;color:#1a202c">{{ fmtDate(invoice.due_date) }}</div>
            </div>
          </div>
        </div>
        <!-- Kepada -->
        <div style="margin-bottom:32px;padding:16px 20px;background:#f8faff;border-radius:8px">
          <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;margin-bottom:8px">DITAGIHKAN KEPADA</div>
          <div style="font-size:15px;font-weight:800;color:#1a202c;margin-bottom:4px">{{ invoice.client?.name }}</div>
          <div style="font-size:13px;color:#64748b">{{ invoice.client?.email }} · {{ invoice.client?.phone }}</div>
        </div>
        <!-- Status -->
        <div v-if="invoice.status === 'paid'" style="margin-bottom:24px;padding:10px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px">
          <span style="font-size:13px;font-weight:700;color:#16a34a">✅ LUNAS — Dibayar {{ fmtDate(invoice.paid_at) }}</span>
        </div>
        <!-- Tabel classic -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
          <thead>
            <tr :style="'border-top:2px solid ' + headerColor + ';border-bottom:2px solid ' + headerColor">
              <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:#1a202c">Deskripsi</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:700;color:#1a202c;width:60px">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#1a202c;width:130px">Harga</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#1a202c;width:130px">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoice.invoice_items" :key="item.id" style="border-bottom:1px solid #e2e8f0">
              <td style="padding:12px 12px;font-size:14px;color:#1a202c">{{ item.description }}</td>
              <td style="padding:12px 12px;text-align:center;font-size:14px;color:#64748b">{{ item.quantity }}</td>
              <td style="padding:12px 12px;text-align:right;font-size:14px;color:#64748b">{{ fmtRp(item.unit_price) }}</td>
              <td style="padding:12px 12px;text-align:right;font-size:14px;font-weight:700;color:#1a202c">{{ fmtRp(item.total) }}</td>
            </tr>
          </tbody>
        </table>
        <!-- Total classic -->
        <div style="display:flex;justify-content:flex-end;margin-bottom:40px">
          <div style="width:260px">
            <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e2e8f0">
              <span style="font-size:13px;color:#64748b">Subtotal</span>
              <span style="font-size:13px;color:#1a202c;font-weight:600">{{ fmtRp(invoice.subtotal) }}</span>
            </div>
            <div v-if="invoice.tax > 0" style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e2e8f0">
              <span style="font-size:13px;color:#64748b">Pajak</span>
              <span style="font-size:13px;color:#1a202c;font-weight:600">{{ fmtRp(invoice.tax) }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:12px 0">
              <span style="font-size:15px;font-weight:800;color:#1a202c">TOTAL</span>
              <span style="font-size:18px;font-weight:900" :style="'color:' + headerColor">{{ fmtRp(invoice.total) }}</span>
            </div>
          </div>
        </div>
        <!-- Bank classic -->
        <div v-if="settings.bank_name" style="margin-bottom:24px;padding:16px;border:1px solid #e2e8f0;border-radius:8px">
          <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;margin-bottom:8px">INFORMASI REKENING</div>
          <div style="font-size:13px;color:#1a202c">{{ settings.bank_name }} — <strong>{{ settings.bank_account_number }}</strong> — a.n. {{ settings.bank_account_name }}</div>
        </div>
        <div v-if="invoice.notes" style="margin-bottom:24px;font-size:13px;color:#64748b;line-height:1.7">{{ invoice.notes }}</div>
        <!-- Footer garis bawah -->
        <div :style="'height:4px;background:' + headerColor + ';margin-top:32px'"></div>
        <div style="display:flex;justify-content:space-between;padding-top:12px">
          <div style="font-size:11px;color:#94a3b8">{{ settings.invoice_footer_note }}</div>
          <div style="font-size:11px;color:#94a3b8">{{ settings.company_website }}</div>
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

const template = computed(() => settings.value?.invoice_template || 'modern')
const headerColor = computed(() => settings.value?.invoice_color || '#1a4fa0')
const logoUrl = computed(() => {
  const url = settings.value?.company_logo_url || ''
  if (!url) return ''
  if (url.startsWith('http')) return url
  return 'https://paymen.mitranz.com' + url
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

const statusStyle = (s: string) => ({
  paid: 'background:rgba(34,197,94,0.15);color:#16a34a;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
  unpaid: 'background:rgba(245,158,11,0.15);color:#d97706;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
  cancelled: 'background:rgba(239,68,68,0.15);color:#dc2626;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
}[s || ''] || 'background:rgba(100,116,139,0.15);color:#64748b;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700')
</script>

<style>
@media print {
  .no-print { display: none !important; }
  #invoice-print { background: white !important; padding: 0 !important; min-height: auto !important; }
  #invoice-print > div { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
  body { margin: 0; }
}
</style>
