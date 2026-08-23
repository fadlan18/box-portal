export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `query { categories(order_by:{sort_order:asc}) { id name slug status sort_order } }` }
  })
  return { categories: res.data?.categories || [] }
})
