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
    const { user } = useCustomAuth()
    if (!user.value?.id) throw new Error('Silakan login terlebih dahulu')
    const res = await $fetch<any>('/api/billing/create-invoice', {
      method: 'POST',
      body: {
        user_id: user.value.id,
        user_name: user.value.name,
        user_email: user.value.email,
        service: {
          id: product.id,
          name: product.name,
          price: selectedOption.amount,
          period: selectedOption.period,
        },
        form: {
          notes: selectedOption.label,
        }
      }
    })
    return { ...res, product }
  }

  return { getPricingOptions, rp, createOrder }
}
