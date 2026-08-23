import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only' })
  const config = useRuntimeConfig()

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      query {
        auth_users(order_by: {created_at: desc}) {
          id email name role is_active created_at
        }
      }
    ` }
  })

  return { ok: true, users: res.data?.auth_users || [] }
})
