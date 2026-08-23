import { getRedis } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { customer_no, product, email, name } = await readBody(event)

  if (!customer_no || !product || !email) {
    throw createError({ statusCode: 400, message: 'Data tidak lengkap' })
  }

  if (!product.buyer_sku_code || !product.category) {
    throw createError({ statusCode: 400, message: 'Data produk tidak valid' })
  }

  // Validasi harga dari cache Redis — jangan percaya harga dari frontend
  let validatedPrice = product.price
  let validatedProduct = product
  try {
    const redis = getRedis()
    const cached = await redis.get('digiflazz:pricelist:all')
    if (cached) {
      const products = JSON.parse(cached)
      const found = products.find((p: any) => p.buyer_sku_code === product.buyer_sku_code)
      if (found) {
        validatedProduct = found
        // Hitung markup dari cache markup
        const markupCache = await redis.get('ppob:markup:all')
        const markups = markupCache ? JSON.parse(markupCache) : []
        const markup = markups.find((m: any) =>
          m.is_active && m.sku_code && m.sku_code === found.buyer_sku_code && m.value > 0
        ) || markups.find((m: any) =>
          m.is_active && !m.sku_code && m.brand === found.brand && m.category === found.category && m.value > 0
        ) || markups.find((m: any) =>
          m.is_active && !m.sku_code && !m.brand && m.category === found.category
        )
        const markupVal = markup ? Number(markup.value) : 0
        const markupType = markup?.markup_type || 'fixed'
        validatedPrice = markupType === 'percent'
          ? Math.round(found.price * (1 + markupVal / 100))
          : found.price + markupVal

        console.log(`[PPOB Order] Harga divalidasi: ${product.buyer_sku_code} = ${validatedPrice} (frontend: ${product.price})`)
      } else {
        throw createError({ statusCode: 400, message: 'Produk tidak ditemukan atau tidak aktif' })
      }
    }
  } catch (e: any) {
    if (e.statusCode) throw e
    console.warn('[PPOB Order] Gagal validasi harga dari cache:', e.message)
  }

  // Idempotency key — cek apakah sudah ada invoice untuk customer_no + sku_code dalam 5 menit terakhir
  try {
    const redis = getRedis()
    const idemKey = `ppob:order:${email}:${product.buyer_sku_code}:${customer_no}`
    const existing = await redis.get(idemKey).catch(() => null)
    if (existing) {
      throw createError({ statusCode: 429, message: 'Pesanan serupa sedang diproses, mohon tunggu beberapa menit' })
    }
    // Set lock 5 menit
    await redis.set(idemKey, '1', 'EX', 300).catch(() => {})
  } catch (e: any) {
    if (e.statusCode) throw e
  }

  // Buat invoice di billing portal
  const res: any = await $fetch(`${config.billingUrl}/api/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': config.billingApiKey },
    body: {
      client: {
        external_id: email,
        name: name || email,
        email,
      },
      items: [{
        description: `${validatedProduct.product_name} — ${customer_no}`,
        quantity: 1,
        unit_price: validatedPrice,
      }],
      due_days: 1,
      currency: 'IDR',
      metadata: {
        type: 'ppob',
        category: validatedProduct.category,
        buyer_sku_code: validatedProduct.buyer_sku_code,
        customer_no,
        product_name: validatedProduct.product_name,
        price_original: validatedProduct.price,
        email,
      },
    },
  })

  return { ok: true, invoice: res.invoice }
})
