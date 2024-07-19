import { S3Client } from '@aws-sdk/client-s3';

if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_ACCESS_KEY) {
  throw new Error('Need credentials to init S3 Client.');
}

const client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export default client;
