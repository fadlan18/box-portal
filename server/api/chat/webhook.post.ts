import Redis from 'ioredis'

function getRedisClient() {
  const config = useRuntimeConfig()
  return new Redis(config.redisUrl)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const redis = getRedisClient()

  try {
    if (body.callback_query) {
      await $fetch(`https://api.telegram.org/bot${config.telegramBotToken}/answerCallbackQuery`, {
        method: 'POST',
        body: { callback_query_id: body.callback_query.id, text: 'Balas pesan ini untuk menjawab pengunjung' }
      }).catch(() => {})
      return { ok: true }
    }

    const message = body.message
    if (!message || message.from?.is_bot) return { ok: true }
    const text = message.text || ''
    if (!text.trim()) return { ok: true }

    let targetSessionId: string | null = null
    if (message.reply_to_message?.message_id) {
      targetSessionId = await redis.get('chat:msg:' + message.reply_to_message.message_id)
    }
    if (!targetSessionId) return { ok: true }

    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' })
    const newReply = { role: 'admin', text, time: timestamp, adminName: message.from?.first_name || 'Tim miTRANZ' }

    const replyKey = 'chat:reply:' + targetSessionId
    const existing = await redis.get(replyKey)
    const replies = existing ? JSON.parse(existing) : []
    replies.push(newReply)
    await redis.set(replyKey, JSON.stringify(replies), 'EX', 86400)
    await redis.publish('chat:' + targetSessionId, JSON.stringify(newReply))

    return { ok: true }
  } finally {
    redis.quit()
  }
})
