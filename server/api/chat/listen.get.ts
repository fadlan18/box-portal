import Redis from 'ioredis'

function getRedisClient() {
  const config = useRuntimeConfig()
  return new Redis(config.redisUrl)
}

export default defineEventHandler(async (event) => {
  const sessionId = getQuery(event).sessionId as string
  if (!sessionId) throw createError({ statusCode: 400, message: 'sessionId required' })

  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  })

  const res = event.node.res
  const send = (eventName: string, data: string) => {
    try { res.write('event: ' + eventName + '\ndata: ' + data + '\n\n') } catch {}
  }

  const redis = getRedisClient()
  const subscriber = getRedisClient()

  try {
    const existing = await redis.get('chat:reply:' + sessionId)
    if (existing) {
      const replies = JSON.parse(existing)
      for (const reply of replies) send('message', JSON.stringify(reply))
      await redis.del('chat:reply:' + sessionId)
    }
  } catch {}

  await subscriber.subscribe('chat:' + sessionId)
  subscriber.on('message', (_ch: string, data: string) => send('message', data))

  const heartbeat = setInterval(() => send('ping', 'ok'), 25000)

  await new Promise<void>((resolve) => {
    event.node.req.on('close', () => {
      clearInterval(heartbeat)
      subscriber.unsubscribe().catch(() => {})
      subscriber.quit().catch(() => {})
      redis.quit().catch(() => {})
      resolve()
    })
  })
})
