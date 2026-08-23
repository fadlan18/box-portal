import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { token, password } = await readBody(event)

  if (!token || !password) throw createError({ statusCode: 400, message: 'Token dan password wajib diisi' })
  if (password.length < 8) throw createError({ statusCode: 400, message: 'Password minimal 8 karakter' })

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `query { auth_users(where:{verify_token:{_eq:"${token}"}},limit:1) { id verify_token_expiry } }` }
  })

  const user = res.data?.auth_users?.[0]
  if (!user) throw createError({ statusCode: 400, message: 'Token tidak valid' })
  if (new Date(user.verify_token_expiry) < new Date()) {
    throw createError({ statusCode: 400, message: 'Token sudah kadaluarsa' })
  }

  const password_hash = await bcrypt.hash(password, 12)

  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `mutation { update_auth_users_by_pk(pk_columns:{id:"${user.id}"},
        _set:{password_hash:"${password_hash}",verify_token:null,verify_token_expiry:null}) { id } }`
    }
  })

  return { ok: true, message: 'Password berhasil diubah' }
})
