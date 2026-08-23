import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only' })
  const config = useRuntimeConfig()

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      query {
        ppob_markup(order_by: {category: asc, brand: asc}) {
          id category brand sku_code markup_type value is_active created_at
        }
      }
    ` }
  })

  return { ok: true, markups: res.data?.ppob_markup || [] }
})
