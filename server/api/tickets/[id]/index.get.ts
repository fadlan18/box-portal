import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      query GetTicket($id: uuid!) {
        tickets_by_pk(id: $id) {
          id subject status priority created_at updated_at user_id
          ticket_messages(order_by: {created_at: asc}) {
            id message is_staff sender_name created_at
          }
        }
      }
    `, variables: { id } }
  })

  const ticket = res.data?.tickets_by_pk
  if (!ticket) throw createError({ statusCode: 404, message: 'Tiket tidak ditemukan' })
  if (ticket.user_id !== user.id && user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Akses ditolak' })
  }

  return { ok: true, ticket }
})
