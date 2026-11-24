import mongoose from 'mongoose';

const ProcessStepSchema = new mongoose.Schema({
  step: { type: String, required: true },
  tag: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  proceedText: { type: String, default: '' },
  isAction: { type: Boolean, default: false },
  actionText: { type: String, default: 'Book a Consultation' },
  actionUrl: { type: String, default: '/contact' },
  secondaryActionText: { type: String, default: 'Start a Conversation' },
  secondaryActionUrl: { type: String, default: '/contact' },
});

const ProcessPageContentSchema = new mongoose.Schema(
  {
    id: { type: String, default: 'process_page', unique: true },
    eyebrow: { type: String, default: 'Our Approach' },
    title: { type: String, default: 'The Pathway to Beauty Innovation' },
    description: {
      type: String,
      default:
        'A disciplined, collaborative framework uniting visionary creativity, cosmetic science, quality formulation, and commercial execution.',
    },
    steps: [ProcessStepSchema],
  },
  { timestamps: true }
);

export const ProcessPageContent =
  mongoose.models.ProcessPageContent ||
  mongoose.model('ProcessPageContent', ProcessPageContentSchema);

export default ProcessPageContent;
