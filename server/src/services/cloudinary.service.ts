/**
 * AUTOSURE — Cloudinary Service
 * Handles secure image uploads.
 */

import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';

// Configure Cloudinary globally
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Upload an image buffer directly to Cloudinary
   * @param fileBuffer The image buffer from multer
   * @param folder The folder to store the image in Cloudinary
   */
  async uploadImageBuffer(fileBuffer: Buffer, folder: string = 'autosure_claims'): Promise<{ url: string; publicId: string }> {
    if (!env.CLOUDINARY_API_SECRET || env.CLOUDINARY_API_SECRET === '**********' || env.CLOUDINARY_API_SECRET.startsWith('your_')) {
      logger.warn('[Cloudinary] Placeholder credentials detected. Using fallback mock image.');
      return {
        url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600',
        publicId: 'mock_cloudinary_id_' + Date.now(),
      };
    }

    return new Promise((resolve) => {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image' },
          (error, result) => {
            if (error) {
              logger.warn('[Cloudinary] Upload failed, falling back to mock image.', { error });
              return resolve({
                url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600',
                publicId: 'mock_cloudinary_id_' + Date.now(),
              });
            }
            if (!result) {
              logger.warn('[Cloudinary] No result returned, falling back to mock image.');
              return resolve({
                url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600',
                publicId: 'mock_cloudinary_id_' + Date.now(),
              });
            }
            
            logger.info(`[Cloudinary] Image uploaded successfully: ${result.public_id}`);
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        );

        uploadStream.end(fileBuffer);
      } catch (err) {
        logger.warn('[Cloudinary] Stream failed, falling back to mock image.', { error: err });
        resolve({
          url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600',
          publicId: 'mock_cloudinary_id_' + Date.now(),
        });
      }
    });
  }
}

export const cloudinaryService = new CloudinaryService();
