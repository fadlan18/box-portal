import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const { subject, message, priority } = await readBody(event)
  const config = useRuntimeConfig()

  if (!subject || !message) throw createError({ statusCode: 400, message: 'Subject dan pesan wajib diisi' })

  // Step 1: Buat tiket
  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      mutation CreateTicket($user_id: String!, $subject: String!, $priority: String!) {
        insert_tickets_one(object: {
          user_id: $user_id
          subject: $subject
          status: "open"
          priority: $priority
        }) { id subject status }
      }
    `, variables: {
      user_id: user.id,
      subject,
      priority: priority || 'normal',
    }}
  })

  const ticket = res.data?.insert_tickets_one
  if (!ticket) {
    console.error('[Tickets] GraphQL error:', JSON.stringify(res.errors || res))
    throw createError({ statusCode: 500, message: 'Gagal membuat tiket' })
  }

  // Step 2: Insert pesan pertama
  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      mutation CreateFirstMessage($ticket_id: uuid!, $sender_id: String!, $sender_name: String!, $message: String!) {
        insert_ticket_messages_one(object: {
          ticket_id: $ticket_id
          sender_id: $sender_id
          sender_name: $sender_name
          message: $message
          is_staff: false
        }) { id }
      }
    `, variables: {
      ticket_id: ticket.id,
      sender_id: user.id,
      sender_name: user.name || 'User',
      message,
    }}
  })

  // Notifikasi admin via Telegram
  const config2 = useRuntimeConfig()
  try {
    await $fetch(`https://api.telegram.org/bot${config2.telegramBotToken}/sendMessage`, {
      method: 'POST',
      body: {
        chat_id: config2.telegramChatId,
        text: `🎫 Tiket Baru\n\nDari: ${user.name} (${user.email})\nSubject: ${subject}\nPrioritas: ${priority || 'normal'}\nPesan: ${message.substring(0, 200)}`,
        parse_mode: 'HTML',
      }
    })
  } catch (e) {}

  return { ok: true, ticket }
})
