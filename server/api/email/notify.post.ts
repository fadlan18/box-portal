import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Proteksi — hanya dari internal (server-side $fetch tidak punya x-forwarded-for)
  const forwarded = getHeader(event, 'x-forwarded-for')
  const host = getHeader(event, 'host') || ''
  const internalSecret = getHeader(event, 'x-internal-secret')
  const expectedSecret = config.internalSecret || 'miTRANZ-Internal-2026!'
  if (forwarded && internalSecret !== expectedSecret) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event)
  const { type, to, email, name, resetUrl, invoice_number, total, currency, payment_method, invoice_url } = body
  const recipient = to || email

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: false,
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  })

  try {
    await transporter.verify()
    console.log('[SMTP] ✓ Connection verified')
  } catch (e: any) {
    console.error('[SMTP] ✗ Verify failed:', e.message)
    throw createError({ statusCode: 500, message: 'SMTP connection failed: ' + e.message })
  }

  let subject = ''
  let html = ''
  let text = ''

  if (type === 'invoice_paid') {
    if (!recipient) throw createError({ statusCode: 400, message: 'Email recipient required' })
    const fmtCurrency = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: currency || 'IDR', maximumFractionDigits: 0 }).format(n)
    subject = '\u2705 Pembayaran Dikonfirmasi \u2014 ' + invoice_number + ' \u2014 miTRANZ'
    text = 'Halo ' + (name || 'Pelanggan') + ',\n\nPembayaran Anda untuk invoice ' + invoice_number + ' sebesar ' + fmtCurrency(total) + ' telah dikonfirmasi.\n\nLayanan Anda kini aktif. Lihat detail di: ' + invoice_url + '\n\nSalam,\nTim miTRANZ'
    html = [
      '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"></head>',
      '<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif">',
      '<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f4f6f9">',
      '<tr><td align="center">',
      '<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">',
      '<tr><td style="background:#1a4fa0;padding:28px 40px;text-align:center">',
      '<span style="font-size:28px;font-weight:900;color:#fff">mi</span>',
      '<span style="font-size:28px;font-weight:900;color:#ff6b35">TRANZ</span>',
      '</td></tr>',
      '<tr><td style="padding:40px">',
      '<div style="text-align:center;margin-bottom:24px">',
      '<div style="font-size:48px">\u2705</div>',
      '<h2 style="margin:8px 0;color:#065f46;font-size:20px">Pembayaran Dikonfirmasi!</h2>',
      '</div>',
      '<p style="color:#4a5568;font-size:15px">Halo <strong>' + (name || 'Pelanggan') + '</strong>,</p>',
      '<p style="color:#4a5568;font-size:15px">Pembayaran Anda telah berhasil dikonfirmasi. Layanan Anda kini aktif.</p>',
      '<table width="100%" cellpadding="12" style="background:#f8fafc;border-radius:8px;margin:20px 0">',
      '<tr><td style="color:#64748b;font-size:13px">No. Invoice</td><td style="font-weight:700;color:#1a202c;text-align:right">' + invoice_number + '</td></tr>',
      '<tr><td style="color:#64748b;font-size:13px">Total Dibayar</td><td style="font-weight:700;color:#1a4fa0;text-align:right;font-size:18px">' + fmtCurrency(total) + '</td></tr>',
      '<tr><td style="color:#64748b;font-size:13px">Metode</td><td style="color:#1a202c;text-align:right">' + (payment_method || 'Transfer') + '</td></tr>',
      '</table>',
      '<div style="text-align:center;margin-top:24px">',
      '<a href="' + invoice_url + '" style="background:#1a4fa0;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">Lihat Invoice</a>',
      '</div>',
      '<p style="color:#94a3b8;font-size:12px;margin-top:32px;text-align:center">miTRANZ \u2014 Platform Layanan Digital</p>',
      '</td></tr></table></td></tr></table></body></html>',
    ].join('')
  } else if (type === 'ppob_success') {
    const { product_name, customer_no, token, total, currency, invoice_number, message } = body
    const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency: currency||'IDR', maximumFractionDigits:0 }).format(n||0)
    subject = `⚡ Transaksi PPOB Berhasil — ${invoice_number}`
    html = [
      `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#f0f7ff;padding:32px 16px">`,
      `<div style="background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0">`,
      `<div style="text-align:center;margin-bottom:24px">`,
      `<div style="font-size:28px;font-weight:900"><span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span></div>`,
      `</div>`,
      `<div style="text-align:center;margin-bottom:24px">`,
      `<div style="font-size:48px">⚡</div>`,
      `<h2 style="color:#1a202c;margin:8px 0">Transaksi Berhasil!</h2>`,
      `<p style="color:#64748b;font-size:14px">Pesanan Anda telah diproses</p>`,
      `</div>`,
      `<div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:20px">`,
      `<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px">`,
      `<span style="color:#64748b">No. Invoice</span><span style="font-weight:700;color:#1a202c">${invoice_number}</span>`,
      `</div>`,
      `<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px">`,
      `<span style="color:#64748b">Produk</span><span style="font-weight:700;color:#1a202c">${product_name}</span>`,
      `</div>`,
      `<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px">`,
      `<span style="color:#64748b">No. Pelanggan</span><span style="font-weight:700;color:#1a202c">${customer_no}</span>`,
      `</div>`,
      `<div style="display:flex;justify-content:space-between;font-size:14px;padding-top:12px;border-top:1px solid #e2e8f0">`,
      `<span style="color:#64748b">Total Bayar</span><span style="font-weight:800;color:#1a4fa0;font-size:16px">${fmtRp(total)}</span>`,
      `</div>`,
      `</div>`,
      token && token !== '-' ? [
        `<div style="background:#f0fdf4;border:2px solid #86efac;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px">`,
        `<div style="font-size:12px;color:#16a34a;font-weight:600;margin-bottom:8px">TOKEN LISTRIK</div>`,
        `<div style="font-size:28px;font-weight:900;color:#15803d;letter-spacing:4px">${token}</div>`,
        `<div style="font-size:12px;color:#16a34a;margin-top:8px">Masukkan token ini pada meteran listrik Anda</div>`,
        `</div>`,
      ].join('') : '',
      message ? `<p style="color:#64748b;font-size:13px;text-align:center">${message}</p>` : '',
      `<div style="text-align:center;margin-top:20px">`,
      `<a href="https://mitranz.com/ppob/riwayat" style="display:inline-block;padding:10px 24px;background:#1a4fa0;color:white;border-radius:10px;text-decoration:none;font-size:13px;font-weight:700">📋 Cek Status Transaksi</a>`,
      `</div>`,
      `<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">Terima kasih telah menggunakan layanan miTRANZ</p>`,
      `</div></div>`,
    ].join('')
  } else if (type === 'otp') {
    const { otp } = body
    subject = '🔐 Kode Verifikasi Riwayat Transaksi — miTRANZ'
    html = [
      '<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#f0f7ff;padding:32px 16px">',
      '<div style="background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0">',
      '<div style="text-align:center;margin-bottom:24px">',
      '<div style="font-size:28px;font-weight:900"><span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span></div>',
      '</div>',
      '<div style="text-align:center;margin-bottom:24px">',
      '<div style="font-size:40px;margin-bottom:12px">🔐</div>',
      '<h2 style="color:#1a202c;margin:0 0 8px">Kode Verifikasi</h2>',
      '<p style="color:#64748b;font-size:14px;margin:0">Gunakan kode ini untuk melihat riwayat transaksi Anda</p>',
      '</div>',
      '<div style="background:#f0f7ff;border:2px solid #bfdbfe;border-radius:12px;padding:24px;text-align:center;margin-bottom:20px">',
      `<div style="font-size:40px;font-weight:900;color:#1a4fa0;letter-spacing:8px">${otp}</div>`,
      '</div>',
      '<p style="color:#94a3b8;font-size:12px;text-align:center">Kode berlaku selama <b>5 menit</b>. Jangan bagikan kode ini kepada siapapun.</p>',
      '</div></div>',
    ].join('')
    text = `Kode verifikasi miTRANZ Anda: ${otp}\n\nBerlaku 5 menit.`
  } else if (type === 'reset_password') {
    subject = 'Permintaan Reset Password - miTRANZ'
    text = `Halo ${name},\n\nKami menerima permintaan reset password untuk akun miTRANZ Anda.\n\nKlik link berikut untuk membuat password baru:\n${resetUrl}\n\nLink ini berlaku selama 1 jam.\n\nJika Anda tidak meminta reset password, abaikan email ini.\n\nSalam,\nTim miTRANZ\nhttps://mitranz.com`
    html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr>
          <td style="background:#1a4fa0;padding:28px 40px;text-align:center">
            <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px">mi</span><span style="font-size:28px;font-weight:900;color:#ff6b35">TRANZ</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px">
            <h2 style="margin:0 0 16px;font-size:20px;color:#1a202c;font-weight:700">Reset Password Akun Anda</h2>
            <p style="margin:0 0 16px;font-size:15px;color:#4a5568;line-height:1.6">Halo <strong>${name || 'Pengguna'}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#4a5568;line-height:1.6">Kami menerima permintaan untuk mereset password akun miTRANZ Anda. Klik tombol di bawah untuk membuat password baru.</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px">
              <tr>
                <td style="background:#1a4fa0;border-radius:6px;padding:14px 28px">
                  <a href="${resetUrl}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:700">Reset Password Sekarang</a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;color:#718096">Atau copy link berikut ke browser Anda:</p>
            <p style="margin:0 0 24px;font-size:13px;color:#1a4fa0;word-break:break-all">${resetUrl}</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
            <p style="margin:0;font-size:13px;color:#a0aec0;line-height:1.6">Link ini berlaku selama <strong>1 jam</strong>. Jika Anda tidak meminta reset password, abaikan email ini dan password Anda tidak akan berubah.</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f7fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0">
            <p style="margin:0 0 4px;font-size:13px;color:#718096">miTRANZ — Platform Layanan Digital Terpercaya</p>
            <p style="margin:0;font-size:12px;color:#a0aec0">
              <a href="https://mitranz.com" style="color:#1a4fa0;text-decoration:none">mitranz.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  }

  try {
    const info = await transporter.sendMail({
      from: config.smtpFrom,
      to: recipient,
      subject,
      text,
      html,
    })
    console.log('[SMTP] ✓ Email sent:', info.messageId)
    return { ok: true, to: recipient }
  } catch (e: any) {
    console.error('[SMTP] ✗ Send failed:', e.message)
    throw createError({ statusCode: 500, message: 'Send failed: ' + e.message })
  }
})
