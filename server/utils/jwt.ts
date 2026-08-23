import jwt from 'jsonwebtoken'

export function getAuthUser(event: any) {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'auth_token')
  if (!cookie) return null
  try {
    const payload: any = jwt.verify(cookie, config.jwtSecret)
    // Normalize: JWT pakai 'sub' sebagai user ID
    return {
      id: payload.id || payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role || 'user',
    }
  } catch {
    return null
  }
}

export function requireAuth(event: any) {
  const user = getAuthUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })
  return user
}
