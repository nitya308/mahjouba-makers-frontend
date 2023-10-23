import AWS from 'aws-sdk';
import {
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} from '@env';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

const s3Bucket = new AWS.S3({
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  region: S3_REGION,
  params: { Bucket: S3_BUCKET_NAME },
});

const uploadFile = (name: string, file: File) => {
  const params: PutObjectRequest = {
    Bucket: S3_BUCKET_NAME,
    Key: name,
    Body: file,
  };

  return s3Bucket.putObject(params);
};

export default uploadFile;
