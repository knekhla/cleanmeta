import { S3Client } from '@aws-sdk/client-s3';
import { config } from '../config';

export const s3Client = new S3Client({
    region: config.s3.region,
    endpoint: config.s3.endpoint,
    credentials: config.s3.credentials,
    forcePathStyle: true, // Needed for MinIO/S3 compatible services
});

export const BUCKET_NAME = config.s3.bucket;
