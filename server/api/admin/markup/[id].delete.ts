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
    await redis.del('ppob:products:PLN')
    await redis.del('ppob:products:Pulsa')
    await redis.del('ppob:products:Data')
    await redis.del('ppob:products:PulsaData')
    await redis.del('ppob:products:Games')
    await redis.del('ppob:products:TV')
    await redis.del('ppob:products:EMoney')
    await redis.del('ppob:game-brands:active')
    await redis.del('digiflazz:pricelist:all')
  } catch (e) { console.error('[Markup] gagal flush cache:', e) }
  return { ok: true }
})
