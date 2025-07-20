// lib/aws-s3.js
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.MY_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.MY_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_SECRET_ACCESS_KEY,
  },
});

export const fetchS3Data = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.MY_S3_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const data = await response.Body.transformToString();
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error fetching ${key} from S3:`, error);
    throw error;
  }
};

export const fetchS3DataWithFallback = async (key, fallbackData) => {
  try {
    return await fetchS3Data(key);
  } catch (error) {
    console.warn(`Using fallback data for ${key}:`, error.message);
    return fallbackData;
  }
};