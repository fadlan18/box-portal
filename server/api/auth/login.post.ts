import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email dan password wajib diisi' })
  }

  const redis = getRedis()

  // Rate limiting
  const rlKey = `login_attempt:${getRequestIP(event)}`
  const attempts = await redis.incr(rlKey).catch(() => 1)
  if (attempts === 1) await redis.expire(rlKey, 60 * 15).catch(() => {})
  if (attempts > 5) {
    const ttl = await redis.ttl(rlKey).catch(() => 900)
    const menit = Math.ceil(ttl / 60)
    throw createError({ statusCode: 429, message: `Terlalu banyak percobaan login. Coba lagi dalam ${menit} menit.` })
  }

  // Ambil user dari DB via Hasura
  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `query { auth_users(where:{email:{_eq:"${email}"}}, limit:1) { id email password_hash name role is_verified is_active } }` }
  })

  const user = res.data?.auth_users?.[0]
  if (!user) throw createError({ statusCode: 401, message: 'Email atau password salah' })
  if (!user.is_active) throw createError({ statusCode: 401, message: 'Akun tidak aktif' })

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) throw createError({ statusCode: 401, message: 'Email atau password salah' })

  // Reset rate limit
  await redis.del(rlKey).catch(() => {})

  // Generate access token
  const token = jwt.sign({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isAdmin: user.role === 'admin',
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': [user.role, 'anonymous'],
      'x-hasura-default-role': user.role,
      'x-hasura-user-id': user.id,
      'x-hasura-user-email': user.email,
    }
  }, config.jwtSecret, { expiresIn: '1d' })

  // Generate refresh token
  const { randomBytes } = await import('crypto')
  const refreshToken = randomBytes(64).toString('hex')
  await redis.set('refresh_token:' + refreshToken, user.id, 'EX', 60 * 60 * 24 * 30).catch(() => {})

  // Set cookies
  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true, secure: true, sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, path: '/'
  })
  setCookie(event, 'auth_token', token, {
    httpOnly: true, secure: true, sameSite: 'lax',
    maxAge: 60 * 60 * 24, path: '/'
  })

  // Sync ke tabel users lama
  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `mutation { insert_users_one(object:{id:"${user.id}",email:"${user.email}",full_name:"${user.name}"},
        on_conflict:{constraint:users_pkey,update_columns:[email,full_name,updated_at]}) { id } }`
    }
  }).catch(() => {})

  return { ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, isAdmin: user.role === 'admin' } }
})
