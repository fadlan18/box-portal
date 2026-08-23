export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const user_id = query.user_id as string

  if (!user_id) throw createError({ statusCode: 400, message: 'user_id required' })

  // Ambil invoice dari billing berdasarkan external_id (user_id miTRANZ)
  const data: any = await $fetch(`${config.billingUrl}/api/invoices/client/${user_id}`, {
    headers: { 'x-api-key': config.billingApiKey },
  }).catch(() => ({ invoices: [] }))

  return { ok: true, invoices: data.invoices || [] }
})
