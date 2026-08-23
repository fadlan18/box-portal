import crypto from 'crypto'
import https from 'https'
import { getDigiflazzBalance } from '~/server/utils/digiflazz-balance.ts'
import { sendTelegram } from '~/server/utils/telegram.ts'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { buyer_sku_code, customer_no, ref_id, email } = await readBody(event)

  if (!buyer_sku_code || !customer_no || !ref_id) {
    throw createError({ statusCode: 400, message: 'Data tidak lengkap' })
  }

  const username = config.digiflazzUsername
  const apiKey = config.digiflazzApiKey

  // Cek saldo sebelum transaksi
  try {
    const balance = await getDigiflazzBalance(username, apiKey)
    const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n)
    console.log(`[PPOB] Saldo Digiflazz: ${fmtRp(balance)}`)

    // Notif jika saldo di bawah Rp 100.000
    if (balance < 100000) {
      await sendTelegram([
        '⚠️ <b>Peringatan Saldo Digiflazz Rendah!</b>',
        '',
        `💰 Saldo saat ini: <b>${fmtRp(balance)}</b>`,
        '🔴 Segera isi saldo untuk menghindari kegagalan transaksi.',
        '',
        '🔗 <a href="https://member.digiflazz.com">Isi Saldo Digiflazz</a>',
      ].join('\n'))
    }

    // Tolak transaksi jika saldo 0
    if (balance <= 0) {
      throw createError({ statusCode: 503, message: 'Layanan sementara tidak tersedia, hubungi admin' })
    }
  } catch (e: any) {
    if (e.statusCode) throw e
    console.warn('[PPOB] Gagal cek saldo:', e.message)
  }

  const sign = crypto.createHash('md5').update(username + apiKey + ref_id).digest('hex')

  const result = await new Promise<any>((resolve, reject) => {
    const body = JSON.stringify({
      commands: 'transaction',
      username,
      buyer_sku_code,
      customer_no,
      ref_id,
      sign,
    })
    const options = {
      hostname: 'api.digiflazz.com',
      path: '/v1/transaction',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (c: any) => data += c)
      res.on('end', () => {
        try { resolve(JSON.parse(data).data) }
        catch (e) { reject(e) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })

  console.log(`[PPOB Transaction] ${buyer_sku_code} for ${customer_no}:`, result?.status, result?.sn)

  // Simpan ke tabel ppob_transactions
  try {
    await $fetch(config.hasuraGraphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
      body: {
        query: `mutation SavePPOB($obj: ppob_transactions_insert_input!) {
          insert_ppob_transactions_one(object: $obj,
            on_conflict: {constraint: ppob_transactions_ref_id_key, update_columns: [status, sn, message, updated_at]}
          ) { id }
        }`,
        variables: {
          obj: {
            email,
            buyer_sku_code,
            customer_no,
            ref_id,
            product_name: result?.product_name || buyer_sku_code,
            category: result?.buyer_sku_code || '',
            price: result?.price || 0,
            status: result?.status || 'pending',
            sn: result?.sn || null,
            message: result?.message || null,
          }
        }
      }
    })
  } catch (e: any) {
    console.error('[PPOB] Gagal simpan transaksi:', e.message)
  }

  return {
    ok: true,
    status: result?.status,
    sn: result?.sn,
    token: result?.sn,
    message: result?.message,
    product_name: result?.product_name,
  }
})
