import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, message: 'Email tidak valid' })
  }

  const redis = getRedis()

  // Rate limit — max 3x per 10 menit per email
  const rateLimitKey = `otp:ratelimit:${email}`
  const attempts = await redis.incr(rateLimitKey).catch(() => 1)
  if (attempts === 1) await redis.expire(rateLimitKey, 600).catch(() => {})
  if (attempts > 3) {
    throw createError({ statusCode: 429, message: 'Terlalu banyak permintaan, coba lagi 10 menit' })
  }

  // Generate OTP 6 digit
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Simpan OTP di Redis TTL 5 menit
  await redis.set(`otp:${email}`, otp, 'EX', 300)

  // Kirim email OTP
  await $fetch('/api/email/notify', {
    method: 'POST',
    body: {
      type: 'otp',
      to: email,
      otp,
    }
  })

  console.log(`[OTP] Kode terkirim ke ${email}`)
  return { ok: true, message: 'Kode verifikasi dikirim ke email Anda' }
})
