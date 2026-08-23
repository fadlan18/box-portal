import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')
  if (refreshToken) {
    const redis = getRedis()
    await redis.del('refresh_token:' + refreshToken).catch(() => {})
  }
  deleteCookie(event, 'auth_token', { path: '/' })
  deleteCookie(event, 'refresh_token', { path: '/' })
  return { ok: true }
})
