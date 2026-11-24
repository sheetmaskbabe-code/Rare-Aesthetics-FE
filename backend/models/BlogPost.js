import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    category: { type: String, default: 'General' },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    content: { type: String, default: '' },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
