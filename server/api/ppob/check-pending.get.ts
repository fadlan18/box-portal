import crypto from 'crypto'
import https from 'https'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Proteksi endpoint — hanya bisa diakses dengan secret key
  const secret = getHeader(event, 'x-cron-secret') || getQuery(event).secret
  const expectedSecret = config.cronSecret || 'miTRANZ-Cron-Secret-2026!'
  if (secret !== expectedSecret) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // Ambil transaksi pending dari DB
  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `query {
        ppob_transactions(
          where: {status: {_eq: "Pending"}},
          order_by: {created_at: asc},
          limit: 10
        ) { id ref_id buyer_sku_code customer_no email product_name price }
      }`
    }
  })

  const pending = res.data?.ppob_transactions || []
  console.log('[PPOB Check] ' + pending.length + ' transaksi pending')

  const results: any[] = []

  for (const trx of pending) {
    try {
      const username = config.digiflazzUsername
      const apiKey = config.digiflazzApiKey
      const sign = crypto.createHash('md5').update(username + apiKey + trx.ref_id).digest('hex')

      const status: any = await new Promise((resolve, reject) => {
        const body = JSON.stringify({ commands: 'transaction-status', username, ref_id: trx.ref_id, sign })
        const options = {
          hostname: 'api.digiflazz.com',
          path: '/v1/transaction',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
        }
        const req = https.request(options, (r) => {
          let data = ''
          r.on('data', (c: any) => data += c)
          r.on('end', () => { try { resolve(JSON.parse(data).data) } catch(e) { reject(e) } })
        })
        req.on('error', reject)
        req.write(body)
        req.end()
      })

      console.log('[PPOB Check] ' + trx.ref_id + ': ' + status?.status + ' SN: ' + status?.sn)

      if (status?.status && status.status !== 'Pending') {
        // Update DB
        await $fetch(config.hasuraGraphqlUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
          body: {
            query: `mutation UpdateTrx($ref_id: String!, $status: String!, $sn: String, $message: String) {
              update_ppob_transactions(
                where: {ref_id: {_eq: $ref_id}},
                _set: {status: $status, sn: $sn, message: $message}
              ) { affected_rows }
            }`,
            variables: { ref_id: trx.ref_id, status: status.status, sn: status.sn || null, message: status.message || null }
          }
        })

        const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n||0)

        if (status.status === 'Sukses' && trx.email) {
          // Kirim email token
          await $fetch('/api/email/notify', {
            method: 'POST',
            body: {
              type: 'ppob_success',
              to: trx.email,
              name: trx.email,
              invoice_number: trx.ref_id,
              total: trx.price,
              currency: 'IDR',
              product_name: trx.product_name,
              customer_no: trx.customer_no,
              token: status.sn || '-',
              message: status.message || '',
            }
          })
          console.log('[PPOB Check] Token sent to ' + trx.email + ': ' + status.sn)

        } else if (status.status === 'Gagal') {
          // Notif admin Telegram
          const { sendTelegram } = await import('~/server/utils/telegram.ts')
          await sendTelegram([
            '🔴 <b>Transaksi PPOB Gagal!</b>',
            '',
            `📋 <b>Ref ID:</b> ${trx.ref_id}`,
            `👤 <b>Pelanggan:</b> ${trx.email}`,
            `🛒 <b>Produk:</b> ${trx.product_name}`,
            `📱 <b>No. Pelanggan:</b> ${trx.customer_no}`,
            `💰 <b>Nominal:</b> ${fmtRp(trx.price)}`,
            `❌ <b>Pesan:</b> ${status.message || 'Tidak ada pesan'}`,
            '',
            '⚠️ Segera hubungi pelanggan dan proses refund jika diperlukan.',
          ].join('\n')).catch(() => {})
          console.error('[PPOB Check] GAGAL: ' + trx.ref_id + ' — ' + status.message)
        }

        results.push({ ref_id: trx.ref_id, status: status.status, sn: status.sn })
      }
    } catch (e: any) {
      console.error('[PPOB Check] Error ' + trx.ref_id + ':', e.message)
    }
  }

  return { ok: true, checked: pending.length, updated: results }
})
