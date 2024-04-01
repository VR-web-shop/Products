
const {
  S3_ENDPOINT_URL,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ENDPOINT_PROTOCOL,
  S3_CDN_URL
} = process.env;

export default {
  cdnURL: S3_CDN_URL,
  bucketName: S3_BUCKET_NAME,
  endpoint: `${S3_ENDPOINT_PROTOCOL}${S3_ENDPOINT_URL}`,
  region: S3_REGION, 
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY
  }
}
