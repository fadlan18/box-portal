import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const { message } = await readBody(event)
  const config = useRuntimeConfig()

  if (!message) throw createError({ statusCode: 400, message: 'Pesan wajib diisi' })

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
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

  return { ok: true }
})
