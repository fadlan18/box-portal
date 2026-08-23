import Redis from 'ioredis'

function getRedisClient() {
  const config = useRuntimeConfig()
  return new Redis(config.redisUrl)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { sessionId, name, email, phone, message } = await readBody(event)

  if (!sessionId || !message?.trim()) throw createError({ statusCode: 400, message: 'sessionId dan message wajib' })
  if (!name?.trim()) throw createError({ statusCode: 400, message: 'Nama wajib diisi' })
  if (!email?.trim()) throw createError({ statusCode: 400, message: 'Email wajib diisi' })
  if (!phone?.trim()) throw createError({ statusCode: 400, message: 'No HP wajib diisi' })

  const redis = getRedisClient()
  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' })

  try {
    const sessionKey = 'chat:session:' + sessionId
    const existing = await redis.get(sessionKey)
    const isNew = !existing

    if (isNew) {
      await redis.set(sessionKey, JSON.stringify({ sessionId, name, email, phone, startedAt: timestamp }), 'EX', 1800)
      await $fetch(config.hasuraGraphqlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
        body: {
          query: `mutation($sid:String!,$n:String!,$e:String!,$p:String!,$m:String!) {
            insert_chat_sessions_one(object:{session_id:$sid,name:$n,email:$e,phone:$p,first_message:$m},
              on_conflict:{constraint:chat_sessions_session_id_key,update_columns:[last_activity,message_count]}) { id }
          }`,
          variables: { sid: sessionId, n: name, e: email, p: phone, m: message.slice(0, 200) }
        }
      }).catch(() => {})
    } else {
      await redis.expire(sessionKey, 1800)
      await $fetch(config.hasuraGraphqlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
        body: {
          query: `mutation($sid:String!) {
            update_chat_sessions(where:{session_id:{_eq:$sid}},_set:{last_activity:"now()"},_inc:{message_count:1}) { affected_rows }
          }`,
          variables: { sid: sessionId }
        }
      }).catch(() => {})
    }

    const isNewLabel = isNew ? '🆕 *Chat Baru*' : '💬 *Pesan Lanjutan*'
    const telegramMsg = `${isNewLabel}\n👤 *Nama:* ${name}\n📧 *Email:* ${email}\n📱 *HP:* ${phone}\n🆔 *Session:* \`${sessionId.slice(0,8)}\`\n⏰ *Waktu:* ${timestamp} WITA\n\n📝 *Pesan:*\n${message}`

    const res: any = await $fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
      method: 'POST',
      body: { chat_id: config.telegramChatId, text: telegramMsg, parse_mode: 'Markdown' }
    })

    if (res?.result?.message_id) {
      await redis.set('chat:msg:' + res.result.message_id, sessionId, 'EX', 1800)
    }

    return { ok: true, isNew }
  } finally {
    redis.quit()
  }
})
