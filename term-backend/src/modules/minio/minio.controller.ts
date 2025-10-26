import {
  Controller,
  Get,
  Post,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { MinioService } from './minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Generate unique filename (timestamp + original name)
    const filename = `testing/${Date.now()}-${file.originalname}`;

    const fileUrl = await this.minioService.uploadImage(
      filename,
      file.buffer,
      file.mimetype,
    );

    return {
      ok: true,
      message: 'File uploaded successfully',
      fileUrl,
    };
  }

  @Get('presigned')
  async getPresignedUrl(@Query('objectName') objectName: string) {
    const url = await this.minioService.getPresignedUrl(objectName);
    return { url };
  }
}
