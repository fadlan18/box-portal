import { requireAuth } from '~/server/utils/jwt'
import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only' })
  const { category, brand, sku_code, markup_type, value, is_active } = await readBody(event)
  const config = useRuntimeConfig()

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      mutation CreateMarkup($category: String, $brand: String, $sku_code: String, $markup_type: String!, $value: numeric!, $is_active: Boolean!) {
        insert_ppob_markup_one(object: {
          category: $category
          brand: $brand
          sku_code: $sku_code
          markup_type: $markup_type
          value: $value
          is_active: $is_active
        }) { id category brand sku_code markup_type value is_active }
      }
    `, variables: { category: category || null, brand: brand || null, sku_code: sku_code || null, markup_type, value, is_active } }
  })

  // Flush cache markup
  try {
    const redis = getRedis()
    await redis.del('ppob:markup:all')
  } catch (e) { console.error('[Markup] gagal flush cache:', e) }

  return { ok: true, markup: res.data?.insert_ppob_markup_one }
})
