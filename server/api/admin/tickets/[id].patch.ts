import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only' })
  const id = getRouterParam(event, 'id')
  const { status } = await readBody(event)
  const config = useRuntimeConfig()

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      mutation UpdateTicket($id: uuid!, $status: String!) {
        update_tickets_by_pk(
          pk_columns: {id: $id}
          _set: {status: $status, updated_at: "now()"}
        ) { id status }
      }
    `, variables: { id, status } }
  })

  return { ok: true, ticket: res.data?.update_tickets_by_pk }
})
