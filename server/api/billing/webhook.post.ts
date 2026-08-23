import crypto from 'crypto'

// WEBHOOK_SECRET dari runtimeConfig

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event) || ''
  const signature = getHeader(event, 'x-billing-signature') || ''
  const billingEvent = getHeader(event, 'x-billing-event') || ''

  // Verifikasi signature — WAJIB
  if (!signature) {
    console.warn('[Billing Webhook] Ditolak: tidak ada signature')
    throw createError({ statusCode: 403, message: 'Missing signature' })
  }
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex')
  const webhookSecret = useRuntimeConfig().webhookSecret || '0798b667ee9d25fd542cfb5ec2d015c91e3162cfeacccfb8f5364afd1ea4708d'
  if (signature !== expected) {
    console.warn('[Billing Webhook] Ditolak: signature tidak valid')
    throw createError({ statusCode: 403, message: 'Invalid signature' })
  }

  const payload = JSON.parse(body)
  const config = useRuntimeConfig()
  console.log(`[Billing Webhook] Event: ${billingEvent}`, payload.data)

  if (billingEvent === 'invoice.paid') {
    const { invoice_id, invoice_number, payment_method, paid_at } = payload.data
    console.log(`[Billing Webhook] Invoice ${invoice_number} PAID`)

    // Idempotency check — cegah proses duplikat
    const { getRedis } = await import('~/server/utils/redis')
    const redis = getRedis()
    const idemKey = `webhook:paid:${invoice_id}`
    const alreadyProcessed = await redis.get(idemKey).catch(() => null)
    if (alreadyProcessed) {
      console.warn(`[Billing Webhook] Invoice ${invoice_number} sudah diproses sebelumnya, skip`)
      return { ok: true, skipped: true }
    }
    // Lock 24 jam
    await redis.set(idemKey, '1', 'EX', 86400).catch(() => {})

    // 1. Ambil detail invoice dari billing portal
    let invoice: any = null
    try {
      const invoiceRes: any = await $fetch(`${config.billingUrl}/api/invoices/${invoice_id}`, {
        headers: { 'x-api-key': config.billingApiKey }
      })
      invoice = invoiceRes.invoice
    } catch (e: any) {
      console.error('[Billing Webhook] Fetch invoice error:', e.message)
    }

    // 2. Aktivasi service di billing DB
    if (invoice) {
      try {
        // Cek apakah service sudah ada
        const existing: any = await $fetch(`${config.billingUrl}/api/services/by-invoice/${invoice_id}`, {
          headers: { 'x-api-key': config.billingApiKey }
        }).catch(() => null)

        if (!existing?.service) {
          const metadata = invoice.metadata || {}
          const expiresAt = new Date()
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)

          // Ambil client_id dari invoice
          const clientId = invoice.client_id || invoice.client?.id || null

          if (!clientId) {
            console.error('[Billing Webhook] client_id tidak ditemukan di invoice')
          } else {
            await $fetch(`${config.billingUrl}/api/services`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.billingApiKey
              },
              body: {
                invoice_id,
                client_id: clientId,
                name: invoice.invoice_items?.[0]?.description || 'Layanan miTRANZ',
                metadata: {
                  domain: metadata.domain || null,
                  period: metadata.period || null,
                  service_id: metadata.service_id || null,
                },
                expires_at: expiresAt.toISOString(),
              }
            })
            console.log(`[Billing Webhook] Service activated for invoice ${invoice_number}`)
          }
        }
      } catch (e: any) {
        console.error('[Billing Webhook] Activate service error:', e.message)
      }

      // 3. Proses transaksi PPOB jika metadata type === 'ppob'
      const metadata = invoice.metadata || {}
      if (metadata.type === 'ppob') {
        try {
          const { buyer_sku_code, customer_no, email } = metadata
          console.log(`[Billing Webhook] PPOB order: ${buyer_sku_code} for ${customer_no}`)

          // Panggil Digiflazz
          const ppobRes: any = await $fetch('/api/ppob/transaction', {
            method: 'POST',
            body: {
              buyer_sku_code,
              customer_no,
              ref_id: invoice_number,
              email: email || invoice.client?.email,
            }
          })

          console.log(`[Billing Webhook] PPOB result:`, ppobRes)

          const clientEmail = email || invoice.client?.email
          const clientName = invoice.client?.name
          const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n||0)

          if (ppobRes.status === 'Gagal') {
            // Notif admin via Telegram
            const { sendTelegram } = await import('~/server/utils/telegram.ts')
            await sendTelegram([
              '🔴 <b>Transaksi PPOB Gagal!</b>',
              '',
              `📋 <b>Invoice:</b> ${invoice_number}`,
              `👤 <b>Pelanggan:</b> ${clientEmail}`,
              `🛒 <b>Produk:</b> ${metadata.product_name || buyer_sku_code}`,
              `📱 <b>No. Pelanggan:</b> ${customer_no}`,
              `💰 <b>Nominal:</b> ${fmtRp(invoice.total)}`,
              `❌ <b>Pesan:</b> ${ppobRes.message || 'Tidak ada pesan'}`,
              '',
              '⚠️ Segera hubungi pelanggan dan proses refund jika diperlukan.',
            ].join('\n')).catch(() => {})
            console.error(`[Billing Webhook] PPOB GAGAL untuk ${invoice_number}: ${ppobRes.message}`)

          } else if (ppobRes.status === 'Sukses' && clientEmail) {
            // Kirim email token sukses
            await $fetch('/api/email/notify', {
              method: 'POST',
              body: {
                type: 'ppob_success',
                to: clientEmail,
                name: clientName,
                invoice_number,
                total: invoice.total,
                currency: invoice.currency || 'IDR',
                product_name: metadata.product_name || buyer_sku_code,
                customer_no,
                token: ppobRes.token || ppobRes.sn || '-',
                message: ppobRes.message || '',
              }
            })
            console.log(`[Billing Webhook] PPOB email sent to ${clientEmail}`)

          } else if (ppobRes.status === 'Pending') {
            // Tidak kirim email — tunggu cron check-pending
            console.log(`[Billing Webhook] PPOB Pending untuk ${invoice_number} — menunggu cron check`)
          }
        } catch (e: any) {
          console.error('[Billing Webhook] PPOB error:', e.message)
        }
      } else {
        // 3. Kirim email konfirmasi biasa (non-PPOB)
        try {
          const clientEmail = invoice.client?.email
          const clientName = invoice.client?.name
          if (clientEmail) {
            await $fetch('/api/email/notify', {
              method: 'POST',
              body: {
                type: 'invoice_paid',
                to: clientEmail,
                name: clientName,
                invoice_number,
                total: invoice.total,
                currency: invoice.currency || 'IDR',
                payment_method: payment_method || 'transfer',
                invoice_url: `${config.public.appUrl}/invoices`,
              }
            })
            console.log(`[Billing Webhook] Email sent to ${clientEmail}`)
          }
        } catch (e: any) {
          console.error('[Billing Webhook] Email error:', e.message)
        }
      }
    }

    // 4. Update order di box-portal Hasura jika ada
    try {
      await $fetch(config.hasuraGraphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': config.hasuraAdminSecret,
        },
        body: {
          query: `mutation UpdateOrderByInvoice($invoice_id: String!) {
            update_orders(
              where: {paymenter_invoice_id: {_eq: $invoice_id}}
              _set: {status: "paid"}
            ) { affected_rows }
          }`,
          variables: { invoice_id },
        },
      })
    } catch (e: any) {
      console.error('[Billing Webhook] Update order error:', e.message)
    }
  }

  if (billingEvent === 'invoice.created') {
    const { invoice_id, invoice_number, total } = payload.data
    console.log(`[Billing Webhook] Invoice ${invoice_number} CREATED — total: ${total}`)
  }

  return { ok: true, received: billingEvent }
})
