import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')
  const body = await readBody(event)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': config.hasuraAdminSecret,
  }

  if (token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret) as any
      headers['x-hasura-role'] = payload.role || 'user'
      headers['x-hasura-user-id'] = payload.sub
    } catch {}
  }

  const res = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers,
    body,
  })

  return res
})
