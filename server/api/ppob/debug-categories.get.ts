import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const redis = getRedis()
  const cached = await redis.get('digiflazz:pricelist:all').catch(() => null)
  const products = cached ? JSON.parse(cached) : []
  const categories: Record<string, number> = {}
  products.forEach((p: any) => {
    categories[p.category] = (categories[p.category] || 0) + 1
  })
  return { total: products.length, categories }
})
