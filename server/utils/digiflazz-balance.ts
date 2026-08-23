import crypto from 'crypto'
import https from 'https'

export async function getDigiflazzBalance(username: string, apiKey: string): Promise<number> {
  const sign = crypto.createHash('md5').update(username + apiKey + 'depo').digest('hex')
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ cmd: 'deposit', username, sign })
    const options = {
      hostname: 'api.digiflazz.com',
      path: '/v1/cek-saldo',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (c: any) => data += c)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve(parsed.data?.deposit || 0)
        } catch(e) { reject(e) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}
