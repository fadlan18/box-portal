import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const config = useRuntimeConfig()

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      query GetTickets($user_id: String!) {
        tickets(where: {user_id: {_eq: $user_id}} order_by: {updated_at: desc}) {
          id subject status priority created_at updated_at
          ticket_messages_aggregate { aggregate { count } }
          ticket_messages(order_by: {created_at: desc} limit: 1) {
            message is_staff created_at
          }
        }
      }
    `, variables: { user_id: user.id } }
  })

  return { ok: true, tickets: res.data?.tickets || [] }
})
