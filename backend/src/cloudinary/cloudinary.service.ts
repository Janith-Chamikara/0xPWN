import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME',
      ),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
      ),
      secure: true,
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    filename?: string,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    try {
      // Validate buffer
      if (!buffer || buffer.length === 0) {
        throw new Error('Buffer is empty or undefined');
      }

      console.log(`Uploading buffer of size: ${buffer.length} bytes`);

      const uploadOptions: UploadApiOptions = {
        folder:
          this.configService.get<string>('CLOUDINARY_FOLDER') ?? undefined,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        filename_override: filename,
        ...options,
      };

      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              return reject(error);
            }
            if (!result) {
              console.error('Cloudinary upload failed: No result returned');
              return reject(new InternalServerErrorException('Upload failed'));
            }
            console.log('Cloudinary upload successful:', result.public_id);
            resolve(result);
          },
        );

        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        stream.pipe(uploadStream as unknown as NodeJS.WritableStream);
      });
    } catch (err) {
      console.error('Error uploading to Cloudinary:', err);
      throw new InternalServerErrorException(
        `Failed to upload file to Cloudinary: ${err.message}`,
      );
    }
  }

  async uploadFile(
    filePath: string,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    try {
      const uploadOptions: UploadApiOptions = {
        folder:
          this.configService.get<string>('CLOUDINARY_FOLDER') ?? undefined,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        ...options,
      };
      return await cloudinary.uploader.upload(filePath, uploadOptions);
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to upload file to Cloudinary',
      );
    }
  }

  async destroy(publicId: string): Promise<{ result: string } | undefined> {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      return res as unknown as { result: string };
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to delete file from Cloudinary',
      );
    }
  }
}
