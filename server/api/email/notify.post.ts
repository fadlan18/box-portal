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
    const { product_name, customer_no, token, total, currency, invoice_number, message, category } = body
    const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style:'currency', currency: currency||'IDR', maximumFractionDigits:0 }).format(n||0)
    const isToken = token && token !== '-' && token !== 'null'
    const isPLN = category === 'PLN' || (product_name || '').toUpperCase().includes('PLN')
    subject = `✅ Transaksi Berhasil — ${product_name} — miTRANZ`

    const tokenBlock = isToken ? `
        <tr><td style="padding:0 0 20px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #86efac;border-radius:12px">
            <tr><td style="padding:24px;text-align:center">
              <div style="font-size:11px;font-weight:700;color:#16a34a;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px">
                ${isPLN ? '⚡ Token Listrik PLN' : '🎫 Kode / Token'}
              </div>
              <div style="font-size:32px;font-weight:900;color:#15803d;letter-spacing:6px;font-family:Courier,monospace;background:#fff;padding:12px 20px;border-radius:8px;border:1px dashed #86efac;display:inline-block">
                ${token}
              </div>
              <div style="font-size:12px;color:#166534;margin-top:12px;line-height:1.6">
                ${isPLN ? 'Masukkan token ini pada meteran listrik Anda.<br>Simpan token ini sebagai bukti transaksi.' : 'Gunakan kode ini sesuai petunjuk produk.<br>Simpan sebagai bukti transaksi.'}
              </div>
            </td></tr>
          </table>
        </td></tr>` : ''

    const messageBlock = message ? `
        <tr><td style="padding:0 0 20px">
          <table width="100%" cellpadding="16" cellspacing="0" style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0">
            <tr><td style="font-size:13px;color:#92400e;line-height:1.6">${message}</td></tr>
          </table>
        </td></tr>` : ''

    html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Transaksi Berhasil — miTRANZ</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a4fa0,#2563eb);border-radius:12px 12px 0 0;padding:28px 40px;text-align:center">
          <div style="font-size:30px;font-weight:900;line-height:1">
            <span style="color:#ffffff">mi</span><span style="color:#ff6b35">TRANZ</span>
          </div>
          <div style="color:rgba(255,255,255,0.75);font-size:12px;margin-top:4px;letter-spacing:1px">PLATFORM LAYANAN DIGITAL</div>
        </td></tr>

        <!-- Status Banner -->
        <tr><td style="background:#16a34a;padding:16px 40px;text-align:center">
          <div style="color:#fff;font-size:15px;font-weight:700">✅ Transaksi Berhasil Diproses</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;border-radius:0 0 12px 12px">
          <table width="100%" cellpadding="0" cellspacing="0">

            <!-- Greeting -->
            <tr><td style="padding:0 0 24px">
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.7">
                Halo, terima kasih telah bertransaksi di <strong>miTRANZ</strong>.<br>
                Pesanan Anda telah berhasil diproses secara otomatis.
              </p>
            </td></tr>

            <!-- Detail Transaksi -->
            <tr><td style="padding:0 0 20px">
              <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;border-bottom:2px solid #e5e7eb;padding-bottom:8px">
                Detail Transaksi
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#6b7280;width:45%">No. Invoice</td>
                  <td style="padding:8px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;font-family:Courier,monospace">${invoice_number}</td>
                </tr>
                <tr style="border-top:1px solid #f3f4f6">
                  <td style="padding:8px 0;font-size:13px;color:#6b7280">Produk</td>
                  <td style="padding:8px 0;font-size:13px;font-weight:700;color:#111827;text-align:right">${product_name}</td>
                </tr>
                <tr style="border-top:1px solid #f3f4f6">
                  <td style="padding:8px 0;font-size:13px;color:#6b7280">No. Pelanggan / ID</td>
                  <td style="padding:8px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;font-family:Courier,monospace">${customer_no}</td>
                </tr>
                <tr style="border-top:2px solid #e5e7eb;background:#f9fafb">
                  <td style="padding:12px 8px;font-size:14px;font-weight:700;color:#374151">Total Dibayar</td>
                  <td style="padding:12px 8px;font-size:18px;font-weight:900;color:#1a4fa0;text-align:right">${fmtRp(total)}</td>
                </tr>
              </table>
            </td></tr>

            ${tokenBlock}
            ${messageBlock}

            <!-- CTA -->
            <tr><td style="padding:8px 0 0;text-align:center">
              <a href="https://mitranz.com/ppob/riwayat"
                style="display:inline-block;background:#1a4fa0;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px">
                Cek Riwayat Transaksi
              </a>
            </td></tr>

          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;text-align:center">
          <p style="margin:0 0 6px;font-size:12px;color:#9ca3af">
            Email ini dikirim secara otomatis oleh sistem miTRANZ.
          </p>
          <p style="margin:0;font-size:12px;color:#9ca3af">
            Butuh bantuan? Hubungi kami di <a href="https://mitranz.com/kontak" style="color:#1a4fa0;text-decoration:none">mitranz.com/kontak</a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#d1d5db">
            &copy; 2026 miTRANZ — Platform Layanan Digital Terpercaya
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
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
  } else if (type === 'ticket_reply') {
    const { subject, message: replyMsg, ticket_url } = body
    subject_line = `[miTRANZ] Tim Support membalas tiket Anda: ${subject}`
    html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#1a4fa0,#2563eb);padding:32px 40px;text-align:center">
          <div style="font-size:24px;font-weight:900;color:white;letter-spacing:-0.5px">miTRANZ</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px">Solusi Platform Digital Anda</div>
        </div>
        <div style="padding:32px 40px">
          <div style="font-size:16px;font-weight:700;color:#111827;margin-bottom:8px">Tim Support telah membalas tiket Anda</div>
          <div style="font-size:13px;color:#6b7280;margin-bottom:20px">Subjek: <strong>${subject}</strong></div>
          <div style="background:#f8fafc;border-left:4px solid #1a4fa0;border-radius:8px;padding:16px 20px;margin-bottom:24px">
            <div style="font-size:11px;color:#6b7280;margin-bottom:8px;font-weight:600">BALASAN TIM SUPPORT</div>
            <div style="font-size:14px;color:#111827;line-height:1.7;white-space:pre-wrap">${replyMsg}</div>
          </div>
          <a href="${ticket_url}" style="display:inline-block;padding:12px 28px;background:#1a4fa0;color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700">
            Lihat & Balas Tiket →
          </a>
        </div>
        <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center">
          <div style="font-size:11px;color:#9ca3af">© ${new Date().getFullYear()} PT Mitra Trans Digital · mitranz.com</div>
        </div>
      </div>
    `
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
