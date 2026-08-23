import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Verifikasi signature Digiflazz
  const { data } = body
  if (!data) return { ok: true }

  const { ref_id, status, sn, buyer_sku_code, customer_no, price, product_name, message } = data

  console.log(`[Digiflazz Webhook] ${ref_id}: ${status} — SN: ${sn}`)

  // Update status di ppob_transactions
  try {
    await $fetch(config.hasuraGraphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
      body: {
        query: `mutation UpdatePPOB($ref_id: String!, $status: String!, $sn: String, $message: String) {
          update_ppob_transactions(
            where: {ref_id: {_eq: $ref_id}},
            _set: {status: $status, sn: $sn, message: $message, updated_at: "now()"}
          ) { affected_rows returning { email product_name customer_no price } }
        }`,
        variables: { ref_id, status, sn: sn || null, message: message || null }
      }
    }).then(async (res: any) => {
      const updated = res.data?.update_ppob_transactions?.returning?.[0]
      if (!updated) return

      // Kirim email dengan token jika sukses
      if (status === 'Sukses' && updated.email) {
        await $fetch('/api/email/notify', {
          method: 'POST',
          body: {
            type: 'ppob_success',
            to: updated.email,
            name: updated.email,
            invoice_number: ref_id,
            total: updated.price || price,
            currency: 'IDR',
            product_name: updated.product_name || product_name,
            customer_no: updated.customer_no || customer_no,
            token: sn || '-',
            message: message || '',
          }
        })
        console.log(`[Digiflazz Webhook] Token email sent to ${updated.email}: ${sn}`)
      }
    })
  } catch (e: any) {
    console.error('[Digiflazz Webhook] Error:', e.message)
  }

  return { ok: true }
})
