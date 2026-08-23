import jwt from 'jsonwebtoken'
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, message: 'Tidak terautentikasi' })
  const payload = jwt.verify(token, config.jwtSecret) as any
  if (payload.role !== 'admin') throw createError({ statusCode: 403, message: 'Akses ditolak' })
  const { id } = await readBody(event)
  const check: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `query { chat_sessions_by_pk(id:"${id}") { is_archived } }` }
  })
  if (!check.data?.chat_sessions_by_pk?.is_archived) {
    throw createError({ statusCode: 400, message: 'Arsipkan chat terlebih dahulu sebelum menghapus' })
  }
  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `mutation { delete_chat_sessions_by_pk(id:"${id}") { id } }` }
  })
  return { ok: true }
})
