import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from "aws-sdk";

@Injectable()
export class AwsService {
    private readonly s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })

    async uploadFile(file?: Express.Multer.File) {
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: String(file.originalname),
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: process.env.AWS_REGION
            }
        }

        try {
            const result = await this.s3.upload(uploadParams).promise();
            const image = result?.Location;
            return image;
        } catch (error) {
            throw new InternalServerErrorException(error.message || "Error uploading file to S3!")
        }
    }

    async deleteFile(key: string) {
        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key
        }

        try {
            const result = await this.s3.deleteObject(deleteParams).promise();
            return result;
        } catch (error) {
            throw new InternalServerErrorException(error.message || "Error deleting file from S3!")
        }
    }
}
