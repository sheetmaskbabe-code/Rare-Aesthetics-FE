import mongoose from 'mongoose';

const ServiceItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: '' },
  short: { type: String, default: '' },
  description: { type: String, default: '' },
  benefits: [{ type: String }],
  icon: { type: String, default: 'flask' },
  image: { type: String, default: '' },
});

const ServicesPageContentSchema = new mongoose.Schema(
  {
    id: { type: String, default: 'services_page', unique: true },
    eyebrow: { type: String, default: 'OUR CAPABILITIES' },
    title: { type: String, default: 'End-to-End Cosmetic Development' },
    description: {
      type: String,
      default:
        'Explore our specialized formulation, evaluation, regulatory, and production coordination services.',
    },
    services: [ServiceItemSchema],
  },
  { timestamps: true }
);

export const ServicesPageContent =
  mongoose.models.ServicesPageContent ||
  mongoose.model('ServicesPageContent', ServicesPageContentSchema);

export default ServicesPageContent;
