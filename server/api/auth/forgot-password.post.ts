import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { email } = await readBody(event)
  if (!email) throw createError({ statusCode: 400, message: 'Email wajib diisi' })

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `query { auth_users(where:{email:{_eq:"${email}"},is_active:{_eq:true}},limit:1) { id name } }` }
  })

  const user = res.data?.auth_users?.[0]
  if (!user) return { ok: true }

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString()

  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `mutation { update_auth_users_by_pk(pk_columns:{id:"${user.id}"},
        _set:{verify_token:"${resetToken}",verify_token_expiry:"${resetExpiry}"}) { id } }`
    }
  })

  const resetUrl = `${config.public.appUrl}/auth/reset-password?token=${resetToken}`
  await $fetch('/api/email/notify', {
    method: 'POST',
    body: { type: 'reset_password', email, name: user.name, resetUrl }
  }).catch(() => {})

  return { ok: true }
})
