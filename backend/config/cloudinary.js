import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

export function ensureConfigured() {
  const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const api_key = (process.env.CLOUDINARY_API_KEY || '').trim();
  const api_secret = (process.env.CLOUDINARY_API_SECRET || '').trim();

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });

  return { cloud_name, api_key, api_secret };
}

// Initial configuration
ensureConfigured();

export function isCloudinaryConfigured() {
  const { cloud_name, api_key, api_secret } = ensureConfigured();

  return Boolean(
    cloud_name &&
    api_key &&
    api_secret &&
    cloud_name !== 'your_cloud_name' &&
    api_key !== 'your_api_key' &&
    api_secret !== 'your_api_secret'
  );
}

/**
 * Upload a memory buffer (from multer) directly to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {Object} options - Upload options (folder, resource_type, etc.)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(buffer, options = {}) {
  const { cloud_name } = ensureConfigured();
  const preset = options.upload_preset || process.env.CLOUDINARY_UPLOAD_PRESET;
  
  // If an unsigned upload preset is provided, use it directly (bypasses restricted API key checks)
  if (preset) {
    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: base64,
        upload_preset: preset,
        folder: options.folder || 'rare_aesthetics',
      }),
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return {
      url: data.secure_url || data.url,
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'rare_aesthetics',
        resource_type: options.resourceType || 'auto',
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an asset from Cloudinary by its public ID
 * @param {string} publicId
 * @param {string} resourceType
 */
export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  if (!publicId || !isCloudinaryConfigured()) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`[Cloudinary] Failed to delete asset ${publicId}:`, err.message);
    return null;
  }
}

export { cloudinary };
