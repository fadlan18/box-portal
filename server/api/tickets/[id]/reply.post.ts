import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const { message } = await readBody(event)
  const config = useRuntimeConfig()

  if (!message) throw createError({ statusCode: 400, message: 'Pesan wajib diisi' })

  // Ambil data tiket + email client
  const ticketRes: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      query GetTicket($id: uuid!) {
        tickets_by_pk(id: $id) {
          id subject user_id
          user: user_id
        }
      }
    `, variables: { id } }
  })

  const ticket = ticketRes.data?.tickets_by_pk

  // Simpan balasan
  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      mutation ReplyTicket($ticket_id: uuid!, $sender_id: String!, $sender_name: String!, $message: String!, $is_staff: Boolean!) {
        insert_ticket_messages_one(object: {
          ticket_id: $ticket_id
          sender_id: $sender_id
          sender_name: $sender_name
          message: $message
          is_staff: $is_staff
        }) { id }
        update_tickets_by_pk(
          pk_columns: {id: $ticket_id}
          _set: {status: "answered", updated_at: "now()"}
        ) { id status }
      }
    `, variables: {
      ticket_id: id,
      sender_id: user.id,
      sender_name: user.name || 'User',
      message,
      is_staff: user.role === 'admin',
    }}
  })

  // Kirim notifikasi email ke client jika admin yang balas
  if (user.role === 'admin' && ticket?.user_id) {
    try {
      // Ambil email user
      const userRes: any = await $fetch(config.hasuraGraphqlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
        body: { query: `
          query GetUser($id: String!) {
            users(where:{id:{_eq:$id}}, limit:1) { id email }
          }
        `, variables: { id: ticket.user_id } }
      })

      const clientEmail = userRes.data?.users?.[0]?.email
      if (clientEmail) {
        await $fetch('/api/email/notify', {
          method: 'POST',
          headers: { 'x-internal-secret': config.internalSecret || 'miTRANZ-Internal-2026!' },
          body: {
            type: 'ticket_reply',
            to: clientEmail,
            subject: ticket.subject,
            message: message.substring(0, 300),
            ticket_id: id,
            ticket_url: `https://mitranz.com/tickets/${id}`,
          }
        }).catch((e: any) => console.error('[TicketReply] Email error:', e.message))
      }
    } catch (e: any) {
      console.error('[TicketReply] Notifikasi gagal:', e.message)
    }
  }

  return { ok: true }
})
