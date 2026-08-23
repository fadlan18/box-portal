import jwt from 'jsonwebtoken'
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, message: 'Tidak terautentikasi' })
  const payload = jwt.verify(token, config.jwtSecret) as any
  if (payload.role !== 'admin') throw createError({ statusCode: 403, message: 'Akses ditolak' })
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `mutation($cutoff:timestamptz!) {
        delete_chat_sessions(where:{is_archived:{_eq:true},archived_at:{_lt:$cutoff}}) { affected_rows }
      }`,
      variables: { cutoff }
    }
  })
  return { ok: true, deleted: res.data?.delete_chat_sessions?.affected_rows || 0 }
})
