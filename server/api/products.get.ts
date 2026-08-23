export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': config.hasuraAdminSecret,
    },
    body: {
      query: `query {
        products(where: {status: {_eq: "active"}}, order_by: {sort_order: asc, created_at: asc}) {
          id name slug category short_desc description specs featured
        }
      }`
    }
  })

  return { products: res.data?.products ?? [] }
})
