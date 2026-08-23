import { sendTelegram } from '~/server/utils/telegram.ts'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Proteksi endpoint
  const secret = getHeader(event, 'x-cron-secret') || getQuery(event).secret
  const expectedSecret = config.cronSecret || 'miTRANZ-Cron-Secret-2026!'
  if (secret !== expectedSecret) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // Ambil invoice pending_confirmation lebih dari 24 jam
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const res: any = await $fetch(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: {
      query: `
        mutation AutoCancel($cutoff: timestamptz!) {
          update_invoices(
            where: {
              status: { _eq: "pending_confirmation" }
              updated_at: { _lt: $cutoff }
            }
            _set: { status: "cancelled", notes: "Auto-cancelled: tidak ada konfirmasi dalam 24 jam" }
          ) {
            affected_rows
            returning { id invoice_number client { name email } total currency }
          }
        }
      `,
      variables: { cutoff }
    }
  })

  const cancelled = res.data?.update_invoices?.returning || []
  const count = res.data?.update_invoices?.affected_rows || 0

  if (count > 0) {
    const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n||0)
    const lines = cancelled.map((inv: any) =>
      `• ${inv.invoice_number} — ${inv.client?.email} — ${fmtRp(inv.total)}`
    ).join('\n')

    await sendTelegram([
      `🚫 <b>Auto-Cancel Invoice (${count})</b>`,
      '',
      'Invoice berikut dibatalkan otomatis karena tidak ada konfirmasi dalam 24 jam:',
      '',
      lines,
    ].join('\n')).catch(() => {})

    console.log(`[Auto-Cancel] ${count} invoice dibatalkan`)
  }

  return { ok: true, cancelled: count }
})
