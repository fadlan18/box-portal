import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only' })
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const set: any = {}
  if (body.is_active !== undefined) set.is_active = body.is_active
  if (body.role !== undefined) set.role = body.role

  const setStr = Object.entries(set).map(([k, v]) =>
    `${k}: ${typeof v === 'boolean' ? v : `"${v}"`}`
  ).join(', ')

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      mutation UpdateUser($id: uuid!) {
        update_auth_users_by_pk(
          pk_columns: {id: $id}
          _set: {${setStr}}
        ) { id email role is_active }
      }
    `, variables: { id } }
  })

  return { ok: true, user: res.data?.update_auth_users_by_pk }
})
