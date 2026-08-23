export function useBilling() {
  const config = useRuntimeConfig()

  async function createInvoice(params: {
    client: {
      external_id: string
      name: string
      email: string
      phone?: string
    }
    items: Array<{
      description: string
      quantity: number
      unit_price: number
      product_id?: string
    }>
    due_days?: number
    notes?: string
    currency?: string
    metadata?: any
  }) {
    return $fetch(`${config.billingUrl}/api/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.billingApiKey,
      },
      body: params,
    })
  }

  async function getInvoice(invoice_id: string) {
    return $fetch(`${config.billingUrl}/api/invoices/${invoice_id}`, {
      headers: { 'x-api-key': config.billingApiKey },
    })
  }

  return { createInvoice, getInvoice }
}
