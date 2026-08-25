import { getCached } from '~/server/utils/redis'

export default defineEventHandler(async () => {
  return getCached('ppob:products:PulsaData', async () => {
    const redis = await import('~/server/utils/redis').then(m => m.getRedis())
    const cached = await redis.get('digiflazz:pricelist:all').catch(() => null)
    if (!cached) return { products: [] }
    const all = JSON.parse(cached)
    return { products: all.filter((p: any) => p.category === 'Pulsa' || p.category === 'Data') }
  })
})
