import AWS from 'aws-sdk';
import {
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} from '@env';
import { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';

const s3Bucket = new AWS.S3({
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  // region: S3_REGION,
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

export const getUrlForFile = async (name: string) => {
  try {
    const url = await s3Bucket.getSignedUrlPromise('getObject', {
      Bucket: S3_BUCKET_NAME,
      Key: name,
    });
    return url;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export default uploadFile;
