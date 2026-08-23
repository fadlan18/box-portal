export interface PricingOption {
  id: string
  label: string
  period: string
  amount: number
  promo?: boolean
  promo_label?: string
}

export function useOrders() {
  const { user } = useCustomAuth()

  function getPricingOptions(product: any): PricingOption[] {
    if (!product?.specs) return []
    const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs
    if (!specs?.pricing || !Array.isArray(specs.pricing)) return []
    return specs.pricing.map((p: any) => ({
      id: p.id || p.label,
      label: p.label,
      period: p.period,
      amount: Number(p.amount || p.price || 0),
      promo: p.promo || false,
      promo_label: p.promo_label || '',
    }))
  }

  function rp(amount: number) {
    if (!amount || isNaN(amount)) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
  }

  async function createOrder(product: any, selectedOption: PricingOption) {
    if (!selectedOption?.amount) throw new Error('Harga tidak tersedia')
    const res = await $fetch<any>('/api/orders', {
      method: 'POST',
      body: {
        product_id: product.id,
        product_name: product.name,
        unit_price: selectedOption.amount,
        total_amount: selectedOption.amount,
        period: selectedOption.period,
        currency: 'IDR',
      }
    })
    return { ...res, product }
  }

  return { getPricingOptions, rp, createOrder }
}
