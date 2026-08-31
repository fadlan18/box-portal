import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only' })
  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()

  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      mutation DeleteMarkup($id: uuid!) {
        delete_ppob_markup_by_pk(id: $id) { id }
      }
    `, variables: { id } }
  })

  // Flush semua cache produk agar markup langsung update
  try {
    const { getRedis } = await import('~/server/utils/redis')
    const redis = getRedis()
    await redis.del('ppob:markup:all')
    await redis.del('ppob:products:games')
    await redis.del('ppob:products:pulsa')
    await redis.del('ppob:products:pln')
    await redis.del('ppob:products:emoney')
    await redis.del('ppob:products:tv')
    await redis.del('digiflazz:pricelist:all')
  } catch (e) { console.error('[Markup] gagal flush cache:', e) }
  return { ok: true }
})
