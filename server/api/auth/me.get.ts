import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (!token) {
    const refreshToken = getCookie(event, 'refresh_token')
    if (refreshToken) {
      try {
        return await $fetch('/api/auth/refresh', { method: 'POST' })
      } catch {}
    }
    return { ok: false, user: null }
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as any
    return {
      ok: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        isAdmin: payload.role === 'admin'
      }
    }
  } catch (e: any) {
    if (e.name === 'TokenExpiredError') {
      const refreshToken = getCookie(event, 'refresh_token')
      if (refreshToken) {
        try {
          return await $fetch('/api/auth/refresh', { method: 'POST' })
        } catch {}
      }
    }
    return { ok: false, user: null }
  }
})
