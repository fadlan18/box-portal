import crypto from 'crypto'
import https from 'https'
import { getCached, getRedis } from '~/server/utils/redis'

// Ambil kategori aktif dari DB ppob_providers
async function getActiveCategories(): Promise<string[]> {
  try {
    const config = useRuntimeConfig()
    const res: any = await $fetch(config.hasuraGraphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
      body: { query: `
        query {
          ppob_providers(where: {code: {_eq: "digiflazz"}, is_active: {_eq: true}}) {
            categories
          }
        }
      ` }
    })
    return res.data?.ppob_providers?.[0]?.categories || ['Pulsa', 'Data', 'PLN', 'Games', 'TV']
  } catch {
    return ['Pulsa', 'Data', 'PLN', 'Games', 'TV']
  }
}

export async function getAllProducts(username: string, apiKey: string): Promise<any[]> {
  return getCached('digiflazz:pricelist:all', async () => {
    const sign = crypto.createHash('md5').update(username + apiKey + 'pricelist').digest('hex')
    const result = await new Promise<any>((resolve, reject) => {
      const body = JSON.stringify({ cmd: 'prepaid', username, sign })
      const options = {
        hostname: 'api.digiflazz.com',
        path: '/v1/price-list',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      }
      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', (c: any) => data += c)
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data)
            // Cek error response dari Digiflazz
          if (parsed.data?.rc) {
            console.warn('[Digiflazz] API error:', parsed.data.message)
            resolve([])
            return
          }
          const arr = Array.isArray(parsed.data) ? parsed.data : Object.values(parsed.data || {})
          resolve(arr.filter((p: any) => typeof p === 'object' && p.product_name))
          } catch (e) { reject(e) }
        })
      })
      req.on('error', reject)
      req.write(body)
      req.end()
    })

    // Filter hanya kategori aktif dari ppob_providers
    const activeCategories = await getActiveCategories()
    const filtered = (result as any[]).filter((p: any) =>
      activeCategories.includes(p.category)
    )

    console.log(`[Digiflazz] Total: ${(result as any[]).length}, Filtered: ${filtered.length}, Kategori: ${activeCategories.join(', ')}`)
    return filtered
  })
}

export function applyMarkup(products: any[], markups: any[]): any[] {
  return products.map(p => {
    // Prioritas: sku_code spesifik (value>0) > brand+category > category saja
    const markup = markups.find(m =>
      m.is_active && m.sku_code && m.sku_code === p.buyer_sku_code && m.value > 0
    ) || markups.find(m =>
      m.is_active && !m.sku_code && m.brand === p.brand && m.category === p.category && m.value > 0
    ) || markups.find(m =>
      m.is_active && !m.sku_code && !m.brand && m.category === p.category
    )

    const markupVal = markup ? Number(markup.value) : 0
    const markupType = markup?.markup_type || 'fixed'
    const finalPrice = markupType === 'percent'
      ? Math.round(p.price * (1 + markupVal / 100))
      : p.price + markupVal

    return {
      ...p,
      price_original: p.price,
      price: finalPrice,
      markup: finalPrice - p.price,
    }
  })
}
