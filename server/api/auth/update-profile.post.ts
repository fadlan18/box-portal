import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name } = await readBody(event)

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

  if (!name?.trim()) throw createError({ statusCode: 400, message: 'Nama tidak boleh kosong' })

  await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': config.hasuraAdminSecret,
    },
    body: {
      query: `mutation UpdateUser($id: uuid!, $name: String!) {
        update_auth_users_by_pk(pk_columns: {id: $id}, _set: {name: $name}) { id }
      }`,
      variables: { id: user.id, name: name.trim() },
    },
  })

  return { ok: true }
})
