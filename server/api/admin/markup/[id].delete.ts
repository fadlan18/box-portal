import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only' })
  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()

  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `
      mutation DeleteMarkup($id: uuid!) {
        delete_ppob_markup_by_pk(id: $id) { id }
      }
    `, variables: { id } }
  })

  return { ok: true }
})
