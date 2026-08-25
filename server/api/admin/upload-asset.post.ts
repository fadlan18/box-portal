import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const s3 = new S3Client({
    endpoint: 'http://10.0.0.30:30900',
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'admin',
      secretAccessKey: 'MinIO_S3_Secure_XYZ789!'
    },
    forcePathStyle: true
  })

  const form = await readMultipartFormData(event)
  if (!form) throw createError({ statusCode: 400, message: 'No file uploaded' })

  const file = form.find(f => f.name === 'file')
  const folder = form.find(f => f.name === 'folder')?.data?.toString() || 'general'

  if (!file?.data) throw createError({ statusCode: 400, message: 'File not found' })

  const ext = file.filename?.split('.').pop() || 'png'
  const filename = `${folder}/${Date.now()}.${ext}`

  await s3.send(new PutObjectCommand({
    Bucket: 'mitranz-assets',
    Key: filename,
    Body: file.data,
    ContentType: file.type || 'image/png',
    ACL: 'public-read'
  }))

  const url = `https://drive-io.mitranz.com/mitranz-assets/${filename}`
  return { ok: true, url }
})
