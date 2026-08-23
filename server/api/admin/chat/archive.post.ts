import jwt from 'jsonwebtoken'
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, message: 'Tidak terautentikasi' })
  const payload = jwt.verify(token, config.jwtSecret) as any
  if (payload.role !== 'admin') throw createError({ statusCode: 403, message: 'Akses ditolak' })
  const { id, restore } = await readBody(event)
  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `mutation($id:uuid!,$archived:Boolean!,$at:timestamptz) {
        update_chat_sessions_by_pk(pk_columns:{id:$id},_set:{is_archived:$archived,archived_at:$at}) { id }
      }`,
      variables: { id, archived: !restore, at: restore ? null : new Date().toISOString() }
    }
  })
  return { ok: true }
})
