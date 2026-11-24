import mongoose from 'mongoose';

const SlideSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  media: { type: String, default: '' },
});

const PageHeaderSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      index: true,
      enum: ['home', 'about', 'services', 'portfolio', 'blog', 'contact', 'process', 'global'],
    },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    slides: [SlideSchema],
  },
  { timestamps: true }
);

export const PageHeader =
  mongoose.models.PageHeader || mongoose.model('PageHeader', PageHeaderSchema);

export default PageHeader;
