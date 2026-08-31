export async function hasuraQuery(query: string, variables?: any) {
  const config = useRuntimeConfig()
  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': config.hasuraAdminSecret,
    },
    body: JSON.stringify({ query, variables }),
  })
  if (res.errors?.length) throw new Error(res.errors[0].message)
  return res.data
}
