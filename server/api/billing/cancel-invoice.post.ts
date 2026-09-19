export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { invoice_id, user_id } = await readBody(event)

  if (!invoice_id || !user_id) {
    throw createError({ statusCode: 400, message: 'Data tidak lengkap' })
  }

  const res: any = await $fetch(`${config.billingUrl}/api/invoices/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.billingApiKey,
    },
    body: { invoice_id, external_id: user_id },
  })

  return { ok: true, invoice: res.invoice }
})
