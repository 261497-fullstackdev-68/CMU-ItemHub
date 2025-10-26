import { Injectable } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private client: Client;

  constructor() {
    this.client = new Client({
      endPoint: process.env.OBJ_STORAGE_ADDR || 'minio',
      port: parseInt(process.env.OBJ_STORAGE_PORT ?? '9000', 10),
      useSSL: false,
      accessKey: process.env.OBJ_ACCESS_KEY || process.env.MINIO_ROOT_USER,
      secretKey: process.env.OBJ_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD,
    });
  }

  async uploadImage(filename: string, fileBuffer: Buffer, mimeType: string) {
    const bucket = process.env.OBJ_BUCKET || 'app-bucket';
    const exists = await this.client.bucketExists(bucket);
    if (!exists) {
      await this.client.makeBucket(bucket, 'us-east-1');
    }

    await this.client.putObject(
      bucket,
      filename,
      fileBuffer,
      fileBuffer.length,
      { 'Content-Type': mimeType },
    );
    return `http://${process.env.OBJ_STORAGE_ADDR}:${process.env.OBJ_STORAGE_PORT}/${bucket}/${filename}`;
  }

  async getPresignedUrl(objectName: string) {
    const bucket = process.env.OBJ_BUCKET || 'app-bucket';
    const presignedUrl = await this.client.presignedGetObject(bucket, objectName);
    return presignedUrl;
  }
}
