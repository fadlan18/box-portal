import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const { email, otp } = await readBody(event)

  if (!email || !otp) {
    throw createError({ statusCode: 400, message: 'Email dan kode wajib diisi' })
  }

  const redis = getRedis()
  const stored = await redis.get(`otp:${email}`).catch(() => null)

  if (!stored) {
    throw createError({ statusCode: 400, message: 'Kode expired atau tidak valid, minta kode baru' })
  }

  if (stored !== otp.toString().trim()) {
    throw createError({ statusCode: 400, message: 'Kode verifikasi salah' })
  }

  // Hapus OTP setelah berhasil
  await redis.del(`otp:${email}`).catch(() => {})

  // Buat session 30 menit
  const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
  await redis.set(`otp:session:${sessionToken}`, email, 'EX', 1800)

  return { ok: true, session_token: sessionToken }
})
