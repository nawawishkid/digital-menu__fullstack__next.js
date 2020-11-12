import S3 from "aws-sdk/clients/s3";

export default function getS3Instance(options = {}) {
  return new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    ...options,
  });
}
