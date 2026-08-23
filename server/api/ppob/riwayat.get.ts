import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { session_token } = getQuery(event)

  if (!session_token || typeof session_token !== 'string') {
    throw createError({ statusCode: 401, message: 'Session tidak valid' })
  }

  // Validasi session
  const redis = getRedis()
  const email = await redis.get(`otp:session:${session_token}`).catch(() => null)
  if (!email) {
    throw createError({ statusCode: 401, message: 'Session expired, verifikasi ulang' })
  }

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `
        query GetRiwayat($email: String!) {
          ppob_transactions(
            where: { email: { _eq: $email } }
            order_by: { created_at: desc }
            limit: 50
          ) {
            id ref_id product_name category customer_no
            price status sn message created_at
          }
        }
      `,
      variables: { email }
    }
  })

  return { ok: true, email, transactions: res.data?.ppob_transactions || [] }
})
