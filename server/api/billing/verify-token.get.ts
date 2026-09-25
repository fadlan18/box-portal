import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = query.token as string

  if (!token) throw createError({ statusCode: 400, message: 'Token tidak ditemukan' })

  const config = useRuntimeConfig()
  try {
    const secret = new TextEncoder().encode(config.jwtSecret)
    const { payload } = await jwtVerify(token, secret)

    if (payload.type !== 'public_view') {
      throw createError({ statusCode: 401, message: 'Token tidak valid' })
    }

    return { ok: true, invoice_id: payload.invoice_id }
  } catch {
    throw createError({ statusCode: 401, message: 'Token tidak valid atau sudah kedaluwarsa' })
  }
})
