// pages/api/env-test.js
export default function handler(req, res) {
  res.status(200).json({
    testVar: process.env.TEST_VAR || 'missing',
    region: process.env.MY_REGION ? 'set' : 'missing',
    bucket: process.env.MY_S3_BUCKET_NAME ? 'set' : 'missing',
    accessKey: process.env.MY_ACCESS_KEY_ID ? 'set' : 'missing',
    secretKey: process.env.MY_SECRET_ACCESS_KEY ? 'set' : 'missing'
  });
}