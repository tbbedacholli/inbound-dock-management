// pages/api/s3-data.js
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.MY_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.MY_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  const { key } = req.query;

  // Log environment variables (do NOT log secrets in production)
  console.log('S3 ENV:', {
    region: process.env.MY_REGION,
    bucket: process.env.MY_S3_BUCKET_NAME,
    accessKey: !!process.env.MY_ACCESS_KEY_ID,
    secretKey: !!process.env.MY_SECRET_ACCESS_KEY
  });

  if (!key) {
    return res.status(400).json({ error: 'Missing key parameter' });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.MY_S3_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const data = await response.Body.transformToString();
    const jsonData = JSON.parse(data);

    res.status(200).json(jsonData);
  } catch (error) {
    console.error('S3 Error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to fetch data from S3',
      details: error.message,
      code: error.code,
      name: error.name
    });
  }
}