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
        <span class="px-3 py-1 rounded-full text-xs font-bold" :style="statusBadge(invoice?.status)">
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
        <div style="font-size:14px;color:#374151">Memuat invoice...</div>
      </div>
    </div>

    <div v-else-if="error" style="display:flex;align-items:center;justify-content:center;min-height:80vh">
      <div style="text-align:center">
        <div style="font-size:32px;margin-bottom:12px">❌</div>
        <div style="font-size:14px;color:#374151">{{ error }}</div>
      </div>
    </div>

    <!-- ==================== TEMPLATE: MODERN ==================== -->
    <div v-else-if="invoice && template === 'modern'" id="invoice-print"
      style="background:#f0f4fa;min-height:100vh;padding:40px 24px">
      <div style="max-width:800px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- Header berwarna -->
        <div :style="'background:' + hc + ';padding:40px 48px'">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:24px">
            <div>
              <img v-if="logoUrl" :src="logoUrl" style="height:48px;object-fit:contain;margin-bottom:12px" alt="Logo"/>
              <div v-else style="font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:4px" :style="'color:' + tc">miTRANZ</div>
              <div style="font-size:13px;margin-bottom:12px" :style="'color:' + tc + 'cc'">{{ settings.company_tagline }}</div>
              <div style="font-size:12px;line-height:1.8" :style="'color:' + tc + 'bb'">
                {{ settings.company_name }}<br>
                {{ settings.company_address }}<br>
                {{ settings.company_phone }} · {{ settings.company_email }}
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

        <!-- Status banner -->
        <div v-if="invoice.status === 'paid'" style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:10px 48px;display:flex;align-items:center;gap:8px">
          <span style="font-size:14px">✅</span>
          <span style="font-size:13px;font-weight:700;color:#15803d">LUNAS — {{ fmtDate(invoice.paid_at) }}</span>
        </div>
        <div v-else-if="invoice.status === 'unpaid'" style="background:#fffbeb;border-bottom:1px solid #fde68a;padding:10px 48px;display:flex;align-items:center;gap:8px">
          <span style="font-size:14px">⏳</span>
          <span style="font-size:13px;font-weight:700;color:#b45309">MENUNGGU PEMBAYARAN — Jatuh tempo {{ fmtDate(invoice.due_date) }}</span>
        </div>

        <!-- Body -->
        <div style="padding:40px 48px">
          <!-- Klien -->
          <div style="margin-bottom:32px">
            <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1.5px;margin-bottom:10px">DITAGIHKAN KEPADA</div>
            <div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:6px">{{ invoice.client?.name }}</div>
            <div style="font-size:13px;color:#374151;line-height:1.8">
              {{ invoice.client?.email }}<br>
              <span v-if="invoice.client?.phone">{{ invoice.client?.phone }}</span>
            </div>
          </div>

          <!-- Tabel item -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <thead>
              <tr :style="'background:' + hc">
                <th style="padding:12px 16px;text-align:left;font-size:12px;font-weight:700;letter-spacing:0.5px" :style="'color:' + tc">DESKRIPSI</th>
                <th style="padding:12px 16px;text-align:center;font-size:12px;font-weight:700;width:80px" :style="'color:' + tc">QTY</th>
                <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:700;width:140px" :style="'color:' + tc">HARGA</th>
                <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:700;width:140px" :style="'color:' + tc">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in invoice.invoice_items" :key="item.id"
                :style="i % 2 === 0 ? 'background:#f9fafb' : 'background:white'">
                <td style="padding:14px 16px;font-size:14px;color:#111827;border-bottom:1px solid #f3f4f6">{{ item.description }}</td>
                <td style="padding:14px 16px;text-align:center;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6">{{ item.quantity }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6">{{ fmtRp(item.unit_price) }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;font-weight:700;color:#111827;border-bottom:1px solid #f3f4f6">{{ fmtRp(item.total) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Total -->
          <div style="display:flex;justify-content:flex-end;margin-bottom:32px">
            <div style="width:280px">
              <div v-if="invoice.tax > 0" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6">
                <span style="font-size:13px;color:#374151">Subtotal</span>
                <span style="font-size:13px;color:#111827;font-weight:600">{{ fmtRp(invoice.subtotal) }}</span>
              </div>
              <div v-if="invoice.tax > 0" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6">
                <span style="font-size:13px;color:#374151">Pajak</span>
                <span style="font-size:13px;color:#111827;font-weight:600">{{ fmtRp(invoice.tax) }}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:14px 16px;border-radius:10px;margin-top:8px" :style="'background:' + hc">
                <span style="font-size:14px;font-weight:700" :style="'color:' + tc">TOTAL</span>
                <span style="font-size:18px;font-weight:900" :style="'color:' + tc">{{ fmtRp(invoice.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Info bank -->
          <div v-if="settings.bank_name && invoice.status !== 'paid'" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px">
            <div style="font-size:11px;font-weight:700;color:#1d4ed8;letter-spacing:1px;margin-bottom:12px">INFORMASI REKENING</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
              <div>
                <div style="font-size:11px;color:#6b7280;margin-bottom:4px">Bank</div>
                <div style="font-size:14px;font-weight:700;color:#111827">{{ settings.bank_name }}</div>
              </div>
              <div>
                <div style="font-size:11px;color:#6b7280;margin-bottom:4px">No. Rekening</div>
                <div style="font-size:14px;font-weight:700;color:#111827">{{ settings.bank_account_number }}</div>
              </div>
              <div>
                <div style="font-size:11px;color:#6b7280;margin-bottom:4px">Atas Nama</div>
                <div style="font-size:14px;font-weight:700;color:#111827">{{ settings.bank_account_name }}</div>
              </div>
            </div>
          </div>

          <!-- Catatan -->
          <div v-if="invoice.notes && invoice.status !== 'paid'" style="padding-top:20px;border-top:1px solid #f3f4f6">
            <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;margin-bottom:8px">CATATAN</div>
            <div style="font-size:13px;color:#374151;line-height:1.7">{{ invoice.notes }}</div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 48px;display:flex;justify-content:space-between">
          <div style="font-size:12px;color:#6b7280">{{ settings.invoice_footer_note }}</div>
          <div style="font-size:12px;color:#6b7280">{{ settings.company_website }}</div>
        </div>
      </div>
    </div>

    <!-- ==================== TEMPLATE: MINIMAL ==================== -->
    <div v-else-if="invoice && template === 'minimal'" id="invoice-print"
      style="background:white;min-height:100vh;padding:48px 32px">
      <div style="max-width:800px;margin:0 auto">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;margin-bottom:36px" :style="'border-bottom:3px solid ' + accentColor">
          <div>
            <img v-if="logoUrl" :src="logoUrl" style="height:44px;object-fit:contain;margin-bottom:8px" alt="Logo"/>
            <div v-else style="font-size:26px;font-weight:900;letter-spacing:-1px;margin-bottom:4px" :style="'color:' + hc">miTRANZ</div>
            <div style="font-size:12px;color:#6b7280">{{ settings.company_tagline }}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:32px;font-weight:900;color:#111827;letter-spacing:-1px">INVOICE</div>
            <div style="font-size:15px;font-weight:700;margin-top:4px" :style="'color:' + hc">{{ invoice.invoice_number }}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-bottom:40px">
          <div>
            <div style="font-size:10px;font-weight:700;color:#6b7280;letter-spacing:1.5px;margin-bottom:8px">DARI</div>
            <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:4px">{{ settings.company_name }}</div>
            <div style="font-size:12px;color:#374151;line-height:1.8">{{ settings.company_address }}<br>{{ settings.company_email }}<br>{{ settings.company_phone }}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:#6b7280;letter-spacing:1.5px;margin-bottom:8px">KEPADA</div>
            <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:4px">{{ invoice.client?.name }}</div>
            <div style="font-size:12px;color:#374151;line-height:1.8">{{ invoice.client?.email }}<br>{{ invoice.client?.phone }}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:10px;font-weight:700;color:#6b7280;letter-spacing:1.5px;margin-bottom:8px">DETAIL</div>
            <div style="font-size:12px;color:#374151;margin-bottom:4px">Tanggal: <strong style="color:#111827">{{ fmtDate(invoice.created_at) }}</strong></div>
            <div style="font-size:12px;color:#374151;margin-bottom:8px">Jatuh Tempo: <strong style="color:#111827">{{ fmtDate(invoice.due_date) }}</strong></div>
            <span style="font-size:11px;font-weight:700;padding:4px 12px;border-radius:100px"
              :style="invoice.status === 'paid' ? 'background:#f0fdf4;color:#15803d' : 'background:#fffbeb;color:#b45309'">
              {{ statusLabel(invoice.status) }}
            </span>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
          <thead>
            <tr style="border-bottom:2px solid #111827">
              <th style="padding:10px 0;text-align:left;font-size:11px;font-weight:700;color:#374151;letter-spacing:1px">DESKRIPSI</th>
              <th style="padding:10px 0;text-align:center;font-size:11px;font-weight:700;color:#374151;letter-spacing:1px;width:60px">QTY</th>
              <th style="padding:10px 0;text-align:right;font-size:11px;font-weight:700;color:#374151;letter-spacing:1px;width:130px">HARGA</th>
              <th style="padding:10px 0;text-align:right;font-size:11px;font-weight:700;color:#374151;letter-spacing:1px;width:130px">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoice.invoice_items" :key="item.id" style="border-bottom:1px solid #e5e7eb">
              <td style="padding:14px 0;font-size:14px;color:#111827">{{ item.description }}</td>
              <td style="padding:14px 0;text-align:center;font-size:14px;color:#374151">{{ item.quantity }}</td>
              <td style="padding:14px 0;text-align:right;font-size:14px;color:#374151">{{ fmtRp(item.unit_price) }}</td>
              <td style="padding:14px 0;text-align:right;font-size:14px;font-weight:700;color:#111827">{{ fmtRp(item.total) }}</td>
            </tr>
          </tbody>
        </table>
        <div style="display:flex;justify-content:flex-end;margin-bottom:40px">
          <div style="width:260px">
            <div style="display:flex;justify-content:space-between;padding:16px 0;" :style="'border-top:2px solid ' + accentColor">
              <span style="font-size:16px;font-weight:900;color:#111827">TOTAL</span>
              <span style="font-size:20px;font-weight:900" :style="'color:' + accentColor">{{ fmtRp(invoice.total) }}</span>
            </div>
          </div>
        </div>
        <div v-if="settings.bank_name && invoice.status !== 'paid'" style="padding:16px 20px;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:24px">
          <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;margin-bottom:8px">INFORMASI REKENING</div>
          <div style="font-size:13px;color:#111827">{{ settings.bank_name }} · <strong>{{ settings.bank_account_number }}</strong> · a.n. {{ settings.bank_account_name }}</div>
        </div>
        <div v-if="invoice.notes && invoice.status !== 'paid'" style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;margin-bottom:6px">CATATAN</div>
          <div style="font-size:13px;color:#374151;line-height:1.7">{{ invoice.notes }}</div>
        </div>
        <div style="border-top:1px solid #e5e7eb;padding-top:16px;display:flex;justify-content:space-between">
          <div style="font-size:12px;color:#6b7280">{{ settings.invoice_footer_note }}</div>
          <div style="font-size:12px;color:#6b7280">{{ settings.company_website }}</div>
        </div>
      </div>
    </div>

    <!-- ==================== TEMPLATE: CORPORATE ==================== -->
    <div v-else-if="invoice && template === 'corporate'" id="invoice-print"
      style="background:#f0f4fa;min-height:100vh;padding:40px 24px">
      <div style="max-width:800px;margin:0 auto;background:white;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div style="background:#0f172a;padding:40px 48px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px">
            <img v-if="logoUrl" :src="logoUrl" style="height:40px;object-fit:contain" alt="Logo"/>
            <div v-else style="font-size:24px;font-weight:900;color:white;letter-spacing:-0.5px">miTRANZ</div>
            <div style="text-align:right">
              <div style="font-size:10px;color:#94a3b8;letter-spacing:2px;font-weight:700">INVOICE</div>
              <div style="font-size:20px;font-weight:900;color:white">{{ invoice.invoice_number }}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">
            <div>
              <div style="font-size:10px;color:#94a3b8;letter-spacing:1.5px;font-weight:700;margin-bottom:6px">DARI</div>
              <div style="font-size:13px;font-weight:700;color:white;margin-bottom:4px">{{ settings.company_name }}</div>
              <div style="font-size:11px;color:#94a3b8;line-height:1.7">{{ settings.company_address }}<br>{{ settings.company_email }}<br>{{ settings.company_phone }}</div>
            </div>
            <div>
              <div style="font-size:10px;color:#94a3b8;letter-spacing:1.5px;font-weight:700;margin-bottom:6px">KEPADA</div>
              <div style="font-size:13px;font-weight:700;color:white;margin-bottom:4px">{{ invoice.client?.name }}</div>
              <div style="font-size:11px;color:#94a3b8;line-height:1.7">{{ invoice.client?.email }}<br>{{ invoice.client?.phone }}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:10px;color:#94a3b8;letter-spacing:1.5px;font-weight:700;margin-bottom:6px">TANGGAL</div>
              <div style="font-size:12px;color:#cbd5e1;margin-bottom:4px">{{ fmtDate(invoice.created_at) }}</div>
              <div style="font-size:10px;color:#94a3b8;margin-bottom:4px">Jatuh Tempo</div>
              <div style="font-size:12px;color:#cbd5e1">{{ fmtDate(invoice.due_date) }}</div>
            </div>
          </div>
        </div>
        <div v-if="invoice.status === 'paid'" style="background:#059669;padding:10px 48px">
          <span style="font-size:12px;font-weight:700;color:white;letter-spacing:1px">✓ LUNAS — {{ fmtDate(invoice.paid_at) }}</span>
        </div>
        <div v-else-if="invoice.status === 'unpaid'" style="background:#d97706;padding:10px 48px">
          <span style="font-size:12px;font-weight:700;color:white;letter-spacing:1px">⏳ MENUNGGU PEMBAYARAN</span>
        </div>
        <div style="padding:40px 48px">
          <div style="margin-bottom:28px">
            <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1.5px;margin-bottom:10px">DITAGIHKAN KEPADA</div>
            <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:4px">{{ invoice.client?.name }}</div>
            <div style="font-size:13px;color:#374151">{{ invoice.client?.email }} · {{ invoice.client?.phone }}</div>
          </div>
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
              <tr v-for="(item, i) in invoice.invoice_items" :key="item.id"
                :style="i % 2 === 0 ? 'background:#f9fafb' : 'background:white'">
                <td style="padding:14px 16px;font-size:14px;color:#111827;border-bottom:1px solid #f3f4f6">{{ item.description }}</td>
                <td style="padding:14px 16px;text-align:center;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6">{{ item.quantity }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6">{{ fmtRp(item.unit_price) }}</td>
                <td style="padding:14px 16px;text-align:right;font-size:14px;font-weight:700;color:#111827;border-bottom:1px solid #f3f4f6">{{ fmtRp(item.total) }}</td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex;justify-content:flex-end;margin-bottom:32px">
            <div style="width:280px;background:#0f172a;border-radius:8px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:13px;font-weight:700;color:#94a3b8;letter-spacing:1px">TOTAL</span>
              <span style="font-size:20px;font-weight:900;color:white">{{ fmtRp(invoice.total) }}</span>
            </div>
          </div>
          <div v-if="settings.bank_name && invoice.status !== 'paid'" style="background:#f9fafb;border-left:4px solid #0f172a;padding:16px 20px;margin-bottom:24px">
            <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;margin-bottom:8px">INFORMASI REKENING</div>
            <div style="font-size:13px;color:#111827">{{ settings.bank_name }} · <strong>{{ settings.bank_account_number }}</strong> · a.n. {{ settings.bank_account_name }}</div>
          </div>
          <div v-if="invoice.notes && invoice.status !== 'paid'" style="font-size:13px;color:#374151;line-height:1.7">{{ invoice.notes }}</div>
        </div>
        <div style="background:#0f172a;padding:16px 48px;display:flex;justify-content:space-between">
          <div style="font-size:11px;color:#475569">{{ settings.invoice_footer_note }}</div>
          <div style="font-size:11px;color:#475569">{{ settings.company_website }}</div>
        </div>
      </div>
    </div>

    <!-- ==================== TEMPLATE: CLASSIC ==================== -->
    <div v-else-if="invoice && template === 'classic'" id="invoice-print"
      style="background:white;min-height:100vh;padding:48px 32px">
      <div style="max-width:800px;margin:0 auto">
        <div :style="'height:6px;background:' + accentColor + ';margin-bottom:36px'"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
          <div>
            <img v-if="logoUrl" :src="logoUrl" style="height:44px;object-fit:contain;margin-bottom:12px" alt="Logo"/>
            <div v-else style="font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:8px" :style="'color:' + hc">miTRANZ</div>
            <div style="font-size:12px;color:#374151;line-height:1.9">
              <strong style="color:#111827">{{ settings.company_name }}</strong><br>
              {{ settings.company_address }}<br>
              {{ settings.company_phone }}<br>
              {{ settings.company_email }}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:36px;font-weight:900;color:#111827;letter-spacing:-2px;margin-bottom:16px">INVOICE</div>
            <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;text-align:right">
              <div style="font-size:11px;color:#6b7280;margin-bottom:4px">No. Invoice</div>
              <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:10px">{{ invoice.invoice_number }}</div>
              <div style="font-size:11px;color:#6b7280;margin-bottom:4px">Tanggal</div>
              <div style="font-size:13px;font-weight:600;color:#111827;margin-bottom:10px">{{ fmtDate(invoice.created_at) }}</div>
              <div style="font-size:11px;color:#6b7280;margin-bottom:4px">Jatuh Tempo</div>
              <div style="font-size:13px;font-weight:600;color:#111827">{{ fmtDate(invoice.due_date) }}</div>
            </div>
          </div>
        </div>
        <div style="margin-bottom:32px;padding:16px 20px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb">
          <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;margin-bottom:8px">DITAGIHKAN KEPADA</div>
          <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:4px">{{ invoice.client?.name }}</div>
          <div style="font-size:13px;color:#374151">{{ invoice.client?.email }} · {{ invoice.client?.phone }}</div>
        </div>
        <div v-if="invoice.status === 'paid'" style="margin-bottom:20px;padding:10px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px">
          <span style="font-size:13px;font-weight:700;color:#15803d">✅ LUNAS — Dibayar {{ fmtDate(invoice.paid_at) }}</span>
        </div>
        <div v-else-if="invoice.status === 'unpaid'" style="margin-bottom:20px;padding:10px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px">
          <span style="font-size:13px;font-weight:700;color:#b45309">⏳ MENUNGGU PEMBAYARAN</span>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
          <thead>
            <tr :style="'border-top:2px solid ' + accentColor + ';border-bottom:2px solid ' + accentColor">
              <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:#111827">Deskripsi</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:700;color:#111827;width:60px">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;width:130px">Harga</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#111827;width:130px">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoice.invoice_items" :key="item.id" style="border-bottom:1px solid #e5e7eb">
              <td style="padding:12px 12px;font-size:14px;color:#111827">{{ item.description }}</td>
              <td style="padding:12px 12px;text-align:center;font-size:14px;color:#374151">{{ item.quantity }}</td>
              <td style="padding:12px 12px;text-align:right;font-size:14px;color:#374151">{{ fmtRp(item.unit_price) }}</td>
              <td style="padding:12px 12px;text-align:right;font-size:14px;font-weight:700;color:#111827">{{ fmtRp(item.total) }}</td>
            </tr>
          </tbody>
        </table>
        <div style="display:flex;justify-content:flex-end;margin-bottom:40px">
          <div style="width:260px">
            <div v-if="invoice.tax > 0" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e5e7eb">
              <span style="font-size:13px;color:#374151">Subtotal</span>
              <span style="font-size:13px;color:#111827;font-weight:600">{{ fmtRp(invoice.subtotal) }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:12px 0">
              <span style="font-size:15px;font-weight:800;color:#111827">TOTAL</span>
              <span style="font-size:18px;font-weight:900" :style="'color:' + accentColor">{{ fmtRp(invoice.total) }}</span>
            </div>
          </div>
        </div>
        <div v-if="settings.bank_name && invoice.status !== 'paid'" style="margin-bottom:24px;padding:16px;border:1px solid #e5e7eb;border-radius:8px">
          <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;margin-bottom:8px">INFORMASI REKENING</div>
          <div style="font-size:13px;color:#111827">{{ settings.bank_name }} — <strong>{{ settings.bank_account_number }}</strong> — a.n. {{ settings.bank_account_name }}</div>
        </div>
        <div v-if="invoice.notes && invoice.status !== 'paid'" style="margin-bottom:24px">
          <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;margin-bottom:6px">CATATAN</div>
          <div style="font-size:13px;color:#374151;line-height:1.7">{{ invoice.notes }}</div>
        </div>
        <div :style="'height:4px;background:' + accentColor + ';margin-top:32px'"></div>
        <div style="display:flex;justify-content:space-between;padding-top:12px">
          <div style="font-size:11px;color:#6b7280">{{ settings.invoice_footer_note }}</div>
          <div style="font-size:11px;color:#6b7280">{{ settings.company_website }}</div>
        </div>
      </div>
    </div>

    <!-- ==================== TEMPLATE: PROFESSIONAL ==================== -->
    <div v-else-if="invoice && template === 'professional'" id="invoice-print"
      style="background:#f5f5f5;min-height:100vh;padding:40px 24px">
      <div style="max-width:800px;margin:0 auto;background:white;box-shadow:0 2px 16px rgba(0,0,0,0.1);position:relative;overflow:hidden">

        <!-- Pita status pojok kanan atas -->
        <div style="position:absolute;top:0;right:0;width:140px;height:140px;overflow:hidden;z-index:10;print-color-adjust:exact;-webkit-print-color-adjust:exact">
          <div :style="'position:absolute;top:28px;right:-38px;width:180px;padding:7px 0;text-align:center;font-size:15px;font-weight:900;letter-spacing:2px;transform:rotate(45deg);print-color-adjust:exact;-webkit-print-color-adjust:exact;' + (invoice.status === 'paid' ? 'background:#10b981;color:white' : 'background:#ef4444;color:white')"
            style="box-shadow:0 2px 8px rgba(0,0,0,0.2)">
            {{ invoice.status === 'paid' ? 'PAID' : 'UNPAID' }}
          </div>
        </div>

        <!-- Header -->
        <div style="padding:40px 48px 32px;border-bottom:1px solid #e5e7eb">
          <div style="display:flex;align-items:flex-start;justify-content:space-between">
            <!-- Logo kiri -->
            <div>
              <img v-if="logoUrl" :src="logoUrl" style="height:56px;object-fit:contain;margin-bottom:8px" alt="Logo"/>
              <div v-else style="font-size:28px;font-weight:900;letter-spacing:-1px" :style="'color:' + accentColor">
                miTRANZ
              </div>
            </div>
            <!-- Info perusahaan kanan -->
            <div style="text-align:right;max-width:220px;padding-right:8px">
              <div style="font-size:14px;font-weight:700;color:#111827">{{ settings.company_website || 'mitranz.com' }}</div>
              <div style="font-size:12px;color:#374151;line-height:1.8;margin-top:4px">
                {{ settings.company_name }}<br>
                {{ settings.company_address }}<br>
                {{ settings.company_phone }}<br>
                {{ settings.company_email }}
              </div>
            </div>
          </div>
        </div>

        <!-- Nomor & tanggal invoice -->
        <div style="padding:28px 48px;border-bottom:1px solid #e5e7eb">
          <div style="font-size:22px;font-weight:900;color:#111827;margin-bottom:8px">Invoice #{{ invoice.invoice_number }}</div>
          <div style="font-size:13px;color:#6b7280">Invoice Date: {{ fmtDateEn(invoice.created_at) }}</div>
          <div style="font-size:13px;color:#6b7280">Due Date: {{ fmtDateEn(invoice.due_date) }}</div>
        </div>

        <!-- Invoiced To -->
        <div style="padding:24px 48px;border-bottom:1px solid #e5e7eb">
          <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:8px">Invoiced To</div>
          <div style="font-size:13px;color:#374151;line-height:1.9">
            <strong>{{ invoice.client?.name }}</strong><br>
            {{ invoice.client?.email }}<br>
            <span v-if="invoice.client?.phone">{{ invoice.client?.phone }}<br></span>
            <span v-if="invoice.client?.address">{{ invoice.client?.address }}</span>
          </div>
        </div>

        <!-- Tabel item -->
        <div style="padding:0 48px">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#e5e7eb">
                <th style="padding:12px 16px;text-align:left;font-size:12px;font-weight:700;color:#111827;border-top:2px solid #d1d5db;border-bottom:2px solid #d1d5db">Description</th>
                <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:700;color:#111827;border-top:2px solid #d1d5db;border-bottom:2px solid #d1d5db;width:160px">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in invoice.invoice_items" :key="item.id" :style="i % 2 === 0 ? 'background:white' : 'background:#fafafa'">
                <td style="padding:12px 16px;font-size:13px;color:#374151;border-bottom:1px solid #e5e7eb">
                  {{ item.description }}
                  <span v-if="item.quantity > 1" style="color:#9ca3af;font-size:12px"> (×{{ item.quantity }})</span>
                </td>
                <td style="padding:12px 16px;text-align:right;font-size:13px;color:#374151;border-bottom:1px solid #e5e7eb">{{ fmtRp(item.total) }} IDR</td>
              </tr>
            </tbody>
            <tfoot>
              <tr style="background:#e5e7eb;border-top:2px solid #d1d5db">
                <td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;color:#374151;border-bottom:1px solid #d1d5db">Sub Total</td>
                <td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:700;color:#111827;border-bottom:1px solid #d1d5db">{{ fmtRp(invoice.subtotal || invoice.total) }} IDR</td>
              </tr>
              <tr v-if="invoice.tax > 0" style="background:#e5e7eb">
                <td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;color:#374151;border-bottom:1px solid #d1d5db">Tax</td>
                <td style="padding:10px 16px;text-align:right;font-size:13px;color:#374151;border-bottom:1px solid #d1d5db">{{ fmtRp(invoice.tax) }} IDR</td>
              </tr>
              <tr style="background:#e5e7eb">
                <td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:800;color:#111827;border-top:2px solid #9ca3af">Total</td>
                <td style="padding:12px 16px;text-align:right;font-size:15px;font-weight:900;color:#111827;border-top:2px solid #9ca3af">{{ fmtRp(invoice.total) }} IDR</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Transactions (jika sudah paid) -->
        <div v-if="invoice.payments && invoice.payments.length > 0" style="padding:32px 48px 0">
          <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:16px">Transactions</div>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#f3f4f6">
                <th style="padding:10px 14px;text-align:left;font-size:12px;font-weight:700;color:#374151;border-bottom:1px solid #e5e7eb">Transaction Date</th>
                <th style="padding:10px 14px;text-align:left;font-size:12px;font-weight:700;color:#374151;border-bottom:1px solid #e5e7eb">Gateway</th>
                <th style="padding:10px 14px;text-align:left;font-size:12px;font-weight:700;color:#374151;border-bottom:1px solid #e5e7eb">Transaction ID</th>
                <th style="padding:10px 14px;text-align:right;font-size:12px;font-weight:700;color:#374151;border-bottom:1px solid #e5e7eb">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pay in invoice.payments" :key="pay.id" style="background:#fafafa">
                <td style="padding:10px 14px;font-size:12px;color:#374151;border-bottom:1px solid #f3f4f6">{{ fmtDateEn(pay.paid_at || pay.created_at) }}</td>
                <td style="padding:10px 14px;font-size:12px;color:#374151;border-bottom:1px solid #f3f4f6;text-transform:capitalize">{{ pay.gateway || pay.method || '-' }}</td>
                <td style="padding:10px 14px;font-size:11px;color:#6b7280;border-bottom:1px solid #f3f4f6;font-family:monospace">{{ pay.id?.slice(0,20).toUpperCase() || '-' }}</td>
                <td style="padding:10px 14px;text-align:right;font-size:12px;font-weight:600;color:#111827;border-bottom:1px solid #f3f4f6">{{ fmtRp(pay.amount) }} IDR</td>
              </tr>
              <tr style="background:#f3f4f6">
                <td colspan="3" style="padding:10px 14px;text-align:right;font-size:12px;font-weight:700;color:#374151">Balance</td>
                <td style="padding:10px 14px;text-align:right;font-size:12px;font-weight:700;color:#111827">Rp 0 IDR</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="padding:32px 48px;text-align:center">
          <div style="font-size:11px;color:#9ca3af">PDF Generated on {{ fmtDateEn(new Date().toISOString()) }}</div>
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

// Shorthand untuk warna — hc = header color, tc = text color
const hc = computed(() => settings.value?.invoice_color || '#1a4fa0')
const tc = computed(() => settings.value?.invoice_text_color || '#ffffff')

// Warna teks yang aman di latar putih — jika hc terlalu terang pakai fallback gelap
const accentColor = computed(() => {
  const color = settings.value?.invoice_color || '#1a4fa0'
  // Jika warna terlalu terang (putih atau mendekati), pakai warna gelap
  if (color === '#ffffff' || color === '#fff' || color === 'white') return '#1a202c'
  return color
})
const template = computed(() => settings.value?.invoice_template || 'modern')
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

const fmtDateEn = (d: string) => d ? new Date(d).toLocaleDateString('en-US', {
  weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
}) : '-'

const statusLabel = (s: string) => ({
  unpaid: 'Belum Lunas', paid: 'Lunas',
  cancelled: 'Dibatalkan', pending_confirmation: 'Menunggu Konfirmasi'
}[s || ''] || s)

const statusBadge = (s: string) => ({
  paid: 'background:#f0fdf4;color:#15803d;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
  unpaid: 'background:#fffbeb;color:#b45309;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
  cancelled: 'background:#fff1f2;color:#be123c;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700',
}[s || ''] || 'background:#f9fafb;color:#374151;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700')
</script>

<style>
@media print {
  .no-print { display: none !important; }
  #invoice-print { background: white !important; padding: 0 !important; min-height: auto !important; }
  #invoice-print > div { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
  body { margin: 0; }

  /* Paksa warna background tampil saat print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}

@media (max-width: 768px) {
  /* Toolbar */
  .no-print { flex-wrap: wrap; gap: 8px; padding: 10px 16px !important; }

  /* Invoice wrapper padding */
  #invoice-print { padding: 16px !important; }

  /* Modern template mobile */
  #invoice-print div[style*="padding:40px 48px"] {
    padding: 20px 16px !important;
  }
  #invoice-print div[style*="padding:40px 48px"] > div[style*="display:flex"] {
    flex-direction: column !important;
    gap: 16px !important;
  }

  /* Grid 2 kolom info klien — stack */
  #invoice-print div[style*="grid-template-columns:1fr 1fr"] {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }

  /* Grid 3 kolom bank info — stack */
  #invoice-print div[style*="grid-template-columns:repeat(3,1fr)"] {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  /* Tabel invoice — font lebih kecil */
  #invoice-print table { font-size: 12px !important; }
  #invoice-print table th, #invoice-print table td {
    padding: 8px 8px !important;
  }
  /* Sembunyikan kolom harga satuan di mobile */
  #invoice-print table th:nth-child(3),
  #invoice-print table td:nth-child(3) {
    display: none !important;
  }

  /* Total box full width */
  #invoice-print div[style*="width:280px"],
  #invoice-print div[style*="width:260px"] {
    width: 100% !important;
  }

  /* Minimal template */
  #invoice-print div[style*="grid-template-columns:1fr 1fr 1fr"] {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }

  /* Header font size */
  #invoice-print div[style*="font-size:28px;font-weight:900"] {
    font-size: 20px !important;
  }
  #invoice-print div[style*="font-size:24px;font-weight:900"] {
    font-size: 18px !important;
  }
}
</style>
