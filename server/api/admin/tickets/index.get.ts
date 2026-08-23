import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only' })
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const status = query.status as string || ''

  const where = status ? `where: {status: {_eq: "${status}"}}` : ''

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      query GetAllTickets {
        tickets(${where} order_by: {updated_at: desc}) {
          id subject status priority created_at updated_at user_id
          ticket_messages_aggregate { aggregate { count } }
          ticket_messages(order_by: {created_at: desc} limit: 1) {
            message is_staff sender_name created_at
          }
        }
      }
    ` }
  })

  return { ok: true, tickets: res.data?.tickets || [] }
})
