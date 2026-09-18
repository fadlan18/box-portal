import { requireAuth } from '~/server/utils/jwt'
import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only' })
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const allowed = ['category', 'brand', 'markup_type', 'value', 'is_active']
  const set: any = {}
  for (const k of allowed) {
    if (body[k] !== undefined) set[k] = body[k]
  }

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      mutation UpdateMarkup($id: uuid!, $set: ppob_markup_set_input!) {
        update_ppob_markup_by_pk(pk_columns: {id: $id}, _set: $set) {
          id category brand markup_type value is_active
        }
      }
    `, variables: { id, set } }
  })

  // Flush cache markup agar harga langsung update
  try {
    const redis = getRedis()
    await redis.del('ppob:markup:all')
    // Flush cache produk agar markup langsung update di frontend
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

  return { ok: true, markup: res.data?.update_ppob_markup_by_pk }
})
