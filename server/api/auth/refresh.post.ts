import jwt from 'jsonwebtoken'
import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const redis = getRedis()
  const refreshToken = getCookie(event, 'refresh_token')
  if (!refreshToken) throw createError({ statusCode: 401, message: 'Refresh token tidak ditemukan' })

  const userId = await redis.get('refresh_token:' + refreshToken).catch(() => null)
  if (!userId) throw createError({ statusCode: 401, message: 'Refresh token tidak valid' })

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `query { auth_users_by_pk(id:"${userId}") { id email name role is_active } }` }
  })

  const user = res.data?.auth_users_by_pk
  if (!user || !user.is_active) {
    await redis.del('refresh_token:' + refreshToken).catch(() => {})
    throw createError({ statusCode: 401, message: 'Akun tidak aktif' })
  }

  const token = jwt.sign({
    sub: user.id, email: user.email, name: user.name, role: user.role,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': [user.role, 'anonymous'],
      'x-hasura-default-role': user.role,
      'x-hasura-user-id': user.id,
    }
  }, config.jwtSecret, { expiresIn: '1d' })

  setCookie(event, 'auth_token', token, {
    httpOnly: true, secure: true, sameSite: 'lax',
    maxAge: 60 * 60 * 24, path: '/'
  })

  return { ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
})
