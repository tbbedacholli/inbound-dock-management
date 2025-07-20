// pages/api/s3-data.js (or app/api/s3-data/route.js for App Router)
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  const { key } = req.query;
  
  if (!key) {
    return res.status(400).json({ error: 'Missing key parameter' });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const data = await response.Body.transformToString();
    const jsonData = JSON.parse(data);
    
    res.status(200).json(jsonData);
  } catch (error) {
    console.error('S3 Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from S3' });
  }
}