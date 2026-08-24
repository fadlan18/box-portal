// Ambil kategori PPOB dari Hasura
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const query = `
    query GetPpobCategories {
      ppob_categories(
        where: { is_active: { _eq: true } }
        order_by: { featured_order: asc }
      ) {
        id name icon href description is_active is_featured featured_order
      }
    }
  `

  const res = await $fetch<any>(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': config.hasuraAdminSecret
    },
    body: { query }
  })

  return res.data?.ppob_categories ?? []
})
