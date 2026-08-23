import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { email, password, name } = await readBody(event)

  if (!email || !password || !name) {
    throw createError({ statusCode: 400, message: 'Semua field wajib diisi' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password minimal 8 karakter' })
  }

  const password_hash = await bcrypt.hash(password, 12)

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `mutation {
        insert_auth_users_one(object:{email:"${email}",password_hash:"${password_hash}",name:"${name}",role:"user",is_verified:false,is_active:true}) {
          id email name role
        }
      }`
    }
  }).catch((e: any) => {
    if (e.message?.includes('unique') || e.message?.includes('duplicate')) {
      throw createError({ statusCode: 409, message: 'Email sudah terdaftar' })
    }
    throw e
  })

  const user = res.data?.insert_auth_users_one
  if (!user) throw createError({ statusCode: 500, message: 'Gagal membuat akun' })

  // Sync ke tabel users lama
  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `mutation { insert_users_one(object:{id:"${user.id}",email:"${user.email}",full_name:"${user.name}"},
        on_conflict:{constraint:users_pkey,update_columns:[email,full_name,updated_at]}) { id } }`
    }
  }).catch(() => {})

  return { ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
})
