import { Router } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configure Multer memory storage (up to 25MB file limit for images and documents)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

// GET /api/upload - List all uploaded media assets
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ media: [] });
    }

    const media = await MediaAsset.find().sort({ createdAt: -1 }).lean();
    return res.json({ media });
  } catch (err) {
    console.error('[Upload GET] Error listing media:', err);
    return res.status(500).json({ error: 'Failed to fetch media assets', media: [] });
  }
});

// POST /api/upload - Upload file to Cloudinary and record in database (with automatic local fallback)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'general';
    const originalName = req.file.originalname || `upload-${Date.now()}`;
    const resourceType = req.file.mimetype.startsWith('image/') ? 'image' : 'raw';

    let uploadedUrl = null;
    let publicId = null;
    let uploadSource = 'local';
    let format = req.file.mimetype;
    let bytes = req.file.size;
    let cloudErrorMsg = null;

    // Try Cloudinary first if configured
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, {
          folder: `rare_aesthetics/${folder}`,
          resourceType: 'auto',
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || undefined,
        });
        uploadedUrl = result.url;
        publicId = result.publicId;
        uploadSource = 'cloudinary';
        format = result.format || format;
        bytes = result.bytes || bytes;
      } catch (cloudErr) {
        cloudErrorMsg = cloudErr.message || 'Cloudinary upload rejected';
        console.warn(`[Upload] Cloudinary upload unavailable (${cloudErrorMsg}). Saving file locally to public/images/`);
      }
    }

    // Automatic Local Storage Fallback if Cloudinary is unavailable or disabled
    if (!uploadedUrl) {
      const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const targetDirs = [
        path.resolve(__dirname, '../public/images'),
        path.resolve(__dirname, '../../Rare/public/images'),
        path.resolve(__dirname, '../../public/images'),
      ];
      for (const dir of targetDirs) {
        try {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          await fs.promises.writeFile(path.join(dir, safeName), req.file.buffer);
        } catch (e) {
          console.warn(`[Upload] Failed saving to ${dir}:`, e.message);
        }
      }
      uploadedUrl = `/images/${safeName}`;
      publicId = safeName;
      uploadSource = 'local';
    }

    // Save to MediaAsset collection if MongoDB is connected
    let record = null;
    if (mongoose.connection.readyState === 1) {
      try {
        record = await MediaAsset.create({
          id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: originalName,
          url: uploadedUrl,
          publicId: publicId,
          folder,
          format,
          bytes,
          resourceType,
        });
      } catch (dbErr) {
        console.warn('[Upload] Media record save skipped:', dbErr.message);
      }
    }

    return res.json({
      success: true,
      url: uploadedUrl,
      publicId: publicId,
      name: originalName,
      format,
      bytes,
      source: uploadSource,
      media: record,
      mediaItem: record,
      cloudError: cloudErrorMsg,
      message:
        uploadSource === 'cloudinary'
          ? 'Uploaded to Cloudinary successfully'
          : `Saved locally to public/images/ (${cloudErrorMsg ? `Cloudinary error: ${cloudErrorMsg}` : 'Cloudinary disabled'})`,
    });
  } catch (err) {
    console.error('[Upload] Error processing upload:', err);
    return res.status(500).json({ error: err.message || 'Failed to upload media file' });
  }
});

// DELETE /api/upload/:id - Delete media asset from Cloudinary & Database (Admin protected)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const asset = await MediaAsset.findOne({ $or: [{ id }, { publicId: id }] });
      if (asset) {
        if (asset.publicId) {
          await deleteFromCloudinary(asset.publicId, asset.resourceType || 'image');
        }
        await MediaAsset.deleteOne({ _id: asset._id });
        return res.json({ success: true, message: 'Media asset deleted successfully' });
      }
    }

    // Attempt direct Cloudinary deletion with ID
    await deleteFromCloudinary(id);
    return res.json({ success: true, message: 'Deleted from Cloudinary' });
  } catch (err) {
    console.error('[Upload DELETE] Error deleting media:', err);
    return res.status(500).json({ error: 'Failed to delete media asset' });
  }
});

export default router;
