import { hasuraQuery } from '~/server/utils/hasura'

export default defineEventHandler(async () => {
  const data = await hasuraQuery(`
    query {
      ppob_products(
        order_by: { category: asc, brand: asc, price: asc }
      ) {
        buyer_sku_code product_name category brand seller_name
        price price_final buyer_product_status is_active multi
      }
    }
  `)
  return { products: data.ppob_products || [] }
})
