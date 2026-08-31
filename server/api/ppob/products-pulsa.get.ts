import { hasuraQuery } from '~/server/utils/hasura'
import { applyMarkup } from '~/server/utils/digiflazz'
import { getCached } from '~/server/utils/redis'

export default defineEventHandler(async () => {
  return getCached('ppob:products:PulsaData', async () => {
    const data = await hasuraQuery(`
      query {
        ppob_products(
          where: {
            _and: [
              { is_active: { _eq: true } }
              { buyer_product_status: { _eq: true } }
              { category: { _in: ["Pulsa", "Data", "Paket SMS & Telpon", "Masa Aktif", "Aktivasi Perdana"] } }
            ]
          }
          order_by: { brand: asc, price: asc }
        ) {
          buyer_sku_code product_name category brand seller_name
          price price_final buyer_product_status is_active multi start_cut_off end_cut_off
        }
      }
    `)
    const products = data.ppob_products || []
    const markupRes: any = await $fetch('/api/ppob/markup').catch(() => ({ markups: [] }))
    const withMarkup = applyMarkup(products, markupRes.markups || [])

    // Deduplikasi: nama sama ambil harga terendah
    const deduped: Map<string, any> = new Map()
    withMarkup.forEach((p: any) => {
      const key = `${p.brand}-${p.product_name}`.toLowerCase().trim()
      const existing = deduped.get(key)
      if (!existing || p.price < existing.price) deduped.set(key, p)
    })
    const unique = Array.from(deduped.values())

    return { products: unique, total: unique.length }
  }, 900)
})
