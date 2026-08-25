import { getCached } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string || 'PLN'

  return getCached(`ppob:products:${category}`, async () => {
    const config = useRuntimeConfig()
    const redis = await import('~/server/utils/redis').then(m => m.getRedis())
    const cached = await redis.get('digiflazz:pricelist:all').catch(() => null)
    if (!cached) return { products: [] }
    const all = JSON.parse(cached)
    const filtered = all.filter((p: any) => p.category === category)
    return { products: filtered }
  })
})
