import mongoose from 'mongoose';

const PortfolioItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    client: { type: String, default: '' },
    year: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    content: { type: String, default: '' },
    galleryImages: [{ type: String }],
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    published: { type: Boolean, default: true },
    link: { type: String, default: '' },
    buttonText: { type: String, default: 'LEARN MORE' },
  },
  { timestamps: true }
);

export const PortfolioItem = mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', PortfolioItemSchema);
