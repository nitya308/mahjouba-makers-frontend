import AWS from 'aws-sdk';
import {
  S3_BUCKET_NAME,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} from '@env';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

const s3Bucket = new AWS.S3({
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  params: { Bucket: S3_BUCKET_NAME },
  signatureVersion: 'v4',
});

const uploadFile = (name: string, file: File) => {
  const params: PutObjectRequest = {
    Bucket: S3_BUCKET_NAME,
    Key: name,
    Body: file,
    ContentType: 'image',
  };

  return s3Bucket.putObject(params);
};

export const getUrlForFile = (name: string) => {
  return `https://mahjouba-media.s3.eu-west-3.amazonaws.com/${name}`;
};

export default uploadFile;
