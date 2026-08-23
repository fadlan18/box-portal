import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { old_password, new_password } = await readBody(event)

  // Ambil token dari cookie
  const cookies = parseCookies(event)
  const token = cookies['auth_token'] || cookies['token'] || ''
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  let user: any
  try {
    user = jwt.verify(token, config.jwtSecret) as any
  } catch {
    throw createError({ statusCode: 401, message: 'Token tidak valid' })
  }

  if (!old_password || !new_password) {
    throw createError({ statusCode: 400, message: 'Semua field wajib diisi' })
  }
  if (new_password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password minimal 8 karakter' })
  }

  // Ambil password hash user
  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': config.hasuraAdminSecret,
    },
    body: {
      query: `query GetUser($id: uuid!) {
        auth_users_by_pk(id: $id) { password_hash }
      }`,
      variables: { id: user.id },
    },
  })

  const passwordHash = res.data?.auth_users_by_pk?.password_hash
  if (!passwordHash) throw createError({ statusCode: 404, message: 'User tidak ditemukan' })

  const valid = await bcrypt.compare(old_password, passwordHash)
  if (!valid) throw createError({ statusCode: 400, message: 'Password lama salah' })

  const newHash = await bcrypt.hash(new_password, 12)
  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': config.hasuraAdminSecret,
    },
    body: {
      query: `mutation UpdatePassword($id: uuid!, $hash: String!) {
        update_auth_users_by_pk(pk_columns: {id: $id}, _set: {password_hash: $hash}) { id }
      }`,
      variables: { id: user.id, hash: newHash },
    },
  })

  return { ok: true }
})
