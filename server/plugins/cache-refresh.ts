import crypto from 'crypto'
import https from 'https'
import { getRedis } from '~/server/utils/redis'

async function getActiveCategories(config: any): Promise<string[]> {
  try {
    const res: any = await $fetch(config.hasuraGraphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
      body: { query: `query { ppob_providers(where: {code: {_eq: "digiflazz"}, is_active: {_eq: true}}) { categories } }` }
    })
    return res.data?.ppob_providers?.[0]?.categories || ['Pulsa', 'Data', 'PLN', 'Games', 'TV']
  } catch {
    return ['Pulsa', 'Data', 'PLN', 'Games', 'TV']
  }
}

async function fetchDigiflazzProducts(username: string, apiKey: string): Promise<any[]> {
  const sign = crypto.createHash('md5').update(username + apiKey + 'pricelist').digest('hex')
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ cmd: 'prepaid', username, sign })
    const options = {
      hostname: 'api.digiflazz.com',
      path: '/v1/price-list',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (c: any) => data += c)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          // Cek apakah response adalah error (rc field)
          if (parsed.data?.rc) {
            console.warn('[Cache] ⚠️ Digiflazz error:', parsed.data.message)
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
}

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const redis = getRedis()

  async function refreshCache() {
    try {
      const [rawProducts, activeCategories] = await Promise.all([
        fetchDigiflazzProducts(config.digiflazzUsername, config.digiflazzApiKey),
        getActiveCategories(config),
      ])

      if (!rawProducts.length) {
        console.warn('[Cache] ⚠️ Auto-refresh: Digiflazz tidak return data, skip update')
        return
      }

      // Filter hanya kategori aktif
      const products = rawProducts.filter((p: any) => activeCategories.includes(p.category))
      console.log(`[Digiflazz] Total: ${rawProducts.length}, Filtered: ${products.length}, Kategori: ${activeCategories.join(', ')}`)

      if (products.length >= 5) {
        await redis.set('digiflazz:pricelist:all', JSON.stringify(products), 'EX', 60 * 20)
        console.log('[Cache] ✓ Auto-refresh berhasil — ' + products.length + ' produk (' + new Date().toLocaleString('id-ID') + ')')
      } else {
        console.warn('[Cache] ⚠️ Auto-refresh: produk setelah filter terlalu sedikit')
      }
    } catch (e: any) {
      console.error('[Cache] ✗ Auto-refresh gagal:', e.message)
    }
  }

  // Cek cache existing dulu
  const cached = await redis.get('digiflazz:pricelist:all').catch(() => null)
  const existing = cached ? JSON.parse(cached) : []

  if (existing.length >= 5) {
    console.log('[Cache] ✓ Cache existing valid — ' + existing.length + ' produk, skip initial fetch')
  } else {
    await refreshCache()
  }

  // Retry jika masih kosong
  setTimeout(async () => {
    const c = await redis.get('digiflazz:pricelist:all').catch(() => null)
    const p = c ? JSON.parse(c) : []
    if (p.length < 5) {
      console.log('[Cache] ⚠️ Cache tidak valid, retry...')
      await refreshCache()
    }
  }, 3 * 60 * 1000)

  setInterval(refreshCache, 15 * 60 * 1000)
  console.log('[Cache] ✓ Auto-refresh scheduler aktif (interval: 15 menit)')
})
