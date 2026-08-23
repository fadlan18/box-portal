import Redis from 'ioredis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { sessionId } = await readBody(event)
  if (!sessionId) throw createError({ statusCode: 400, message: 'sessionId required' })
  const redis = new Redis(config.redisUrl)
  try {
    await redis.del('chat:session:' + sessionId)
    await redis.del('chat:reply:' + sessionId)
    return { ok: true }
  } finally {
    redis.quit()
  }
})
