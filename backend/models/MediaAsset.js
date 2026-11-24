import mongoose from 'mongoose';

const MediaAssetSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    folder: { type: String, default: 'general' },
    format: { type: String, default: '' },
    bytes: { type: Number, default: 0 },
    resourceType: { type: String, default: 'image' },
  },
  { timestamps: true }
);

export const MediaAsset =
  mongoose.models.MediaAsset || mongoose.model('MediaAsset', MediaAssetSchema);
