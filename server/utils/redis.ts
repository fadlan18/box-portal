import Redis from 'ioredis'

let redisInstance: Redis | null = null

export function getRedis(): Redis {
  if (!redisInstance) {
    const config = useRuntimeConfig()
    redisInstance = new Redis(config.redisUrl)
    redisInstance.on('error', (e) => console.error('[Redis] error:', e.message))
  }
  return redisInstance
}

const CACHE_TTL = 60 * 20 // 20 menit

export async function getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const redis = getRedis()
  try {
    const cached = await redis.get(key)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (key.includes('digiflazz:pricelist') && Array.isArray(parsed) && parsed.length < 5) {
        console.warn('[Redis] cache invalid (' + parsed.length + ' produk), re-fetch...')
        await redis.del(key)
      } else {
        console.log('[Redis] cache hit: ' + key)
        return parsed
      }
    }
  } catch (e: any) {
    console.error('[Redis] get error:', e.message)
  }

  const data = await fetcher()

  try {
    await redis.set(key, JSON.stringify(data), 'EX', CACHE_TTL)
    console.log('[Redis] cached: ' + key + ' (TTL: ' + CACHE_TTL + 's)')
  } catch (e: any) {
    console.error('[Redis] set error:', e.message)
  }

  return data
}
