export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const user_id = query.user_id as string

  if (!id) throw createError({ statusCode: 400, message: 'Invoice ID required' })

  const res: any = await $fetch(`${config.billingUrl}/api/invoices/${id}`).catch(() => null)

  if (!res?.invoice) throw createError({ statusCode: 404, message: 'Invoice tidak ditemukan' })

  // Verifikasi kepemilikan di box-portal side
  if (user_id && res.invoice.client?.external_id !== user_id) {
    throw createError({ statusCode: 403, message: 'Akses ditolak' })
  }

  return { ok: true, invoice: res.invoice, settings: res.settings || {} }
})
