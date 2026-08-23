import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async () => {
  const redis = await getRedis()
  const cached = await redis.get('digiflazz:pricelist:all')
  if (!cached) return { products: [] }
  const products = JSON.parse(cached)
  return { products }
})
