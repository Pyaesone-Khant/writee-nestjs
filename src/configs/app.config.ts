import { registerAs } from "@nestjs/config";

export default registerAs('appConfig', () => ({
    environment: process.env.NODE_ENV || 'development',
    mailHost: process.env.MAIL_HOST,
    mailPort: parseInt(process.env.MAIL_PORT, 10),
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsBucketName: process.env.AWS_BUCKET_NAME,
}))