import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

const s3 = new S3Client({
  forcePathStyle: true,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const form = formidable()
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err)
      res.status(500).json({ error: 'Error parsing form' })
      return
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId

    if (!file || !userId) {
      res.status(400).json({ error: 'Missing file or userId' })
      return
    }

    try {
      const buffer = fs.readFileSync((file as formidable.File).filepath)
      const key = `${userId}/${(file as formidable.File).originalFilename}`
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: (file as formidable.File).mimetype || undefined,
          ACL: 'public-read',
        })
      )

      const base = process.env.S3_ENDPOINT?.replace(/\/$/, '')
      const url = `${base}/${process.env.S3_BUCKET_NAME}/${key}`
      res.status(200).json({ url })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Upload failed' })
    }
  })
}
