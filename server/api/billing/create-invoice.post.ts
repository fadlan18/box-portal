export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { user_id, user_name, user_email, items, form } = await readBody(event)

  if (!user_id || !items?.length) {
    throw createError({ statusCode: 400, message: 'Data tidak lengkap' })
  }

  const res: any = await $fetch(`${config.billingUrl}/api/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.billingApiKey,
    },
    body: {
      client: {
        external_id: user_id,
        name: user_name,
        email: user_email,
        phone: form?.phone || null,
      },
      items,
      due_days: 7,
      notes: form?.notes || null,
      currency: 'IDR',
      metadata: {
        source: 'mitranz-portal',
        item_count: items.length,
      },
    },
  })

  return { ok: true, invoice: res.invoice }
})
